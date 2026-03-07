import type { Condition } from "@shared/schema";

const CONDITION_SYNONYMS: Record<string, string[]> = {
  "ptsd": ["post-traumatic stress", "posttraumatic stress", "combat stress", "ptsd", "anxiety disorder", "hypervigilance", "nightmares", "flashback"],
  "tinnitus": ["tinnitus", "ringing in ears", "ear ringing", "auditory"],
  "hearing loss": ["hearing loss", "sensorineural", "audiology", "audiogram", "hearing test", "decibel", "bilateral hearing"],
  "sleep apnea": ["sleep apnea", "obstructive sleep", "cpap", "sleep study", "polysomnography", "ahi"],
  "migraines": ["migraine", "headache", "cephalgia", "prostrating"],
  "tbi": ["traumatic brain injury", "tbi", "concussion", "head injury", "closed head"],
  "back": ["lumbar", "lumbosacral", "thoracolumbar", "degenerative disc", "herniated", "spinal stenosis", "back pain", "spine"],
  "knee": ["knee", "patellofemoral", "meniscus", "acl", "mcl", "patellar"],
  "shoulder": ["shoulder", "rotator cuff", "glenohumeral", "impingement", "labral"],
  "ankle": ["ankle", "plantar fasciitis", "achilles", "foot pain"],
  "depression": ["depression", "depressive disorder", "major depressive", "mdd", "dysthymia", "mood disorder"],
  "anxiety": ["anxiety", "generalized anxiety", "gad", "panic disorder", "anxious"],
  "gerd": ["gerd", "gastroesophageal reflux", "acid reflux", "heartburn", "esophagitis"],
  "sinusitis": ["sinusitis", "rhinitis", "nasal", "sinus"],
  "hypertension": ["hypertension", "high blood pressure", "elevated bp", "blood pressure"],
  "diabetes": ["diabetes", "diabetic", "glucose", "a1c", "insulin", "blood sugar"],
  "radiculopathy": ["radiculopathy", "radicular", "sciatica", "nerve root", "neuropathy"],
  "erectile dysfunction": ["erectile dysfunction", "ed ", "sexual dysfunction", "impotence"],
  "flat feet": ["flat feet", "pes planus", "fallen arches", "plantar"],
  "scars": ["scar", "scarring", "keloid", "surgical scar"],
};

function buildSearchTerms(conditions: Condition[]): string[] {
  const terms: string[] = [];

  for (const cond of conditions) {
    if (cond.conditionName) {
      terms.push(cond.conditionName.toLowerCase());

      const words = cond.conditionName.toLowerCase().split(/\s+/);
      for (const word of words) {
        if (word.length > 3) {
          terms.push(word);
        }
      }

      for (const [key, synonyms] of Object.entries(CONDITION_SYNONYMS)) {
        if (cond.conditionName.toLowerCase().includes(key) ||
            synonyms.some(s => cond.conditionName.toLowerCase().includes(s))) {
          terms.push(...synonyms);
        }
      }
    }

    if (cond.icd10Code) {
      terms.push(cond.icd10Code.toLowerCase());
      const baseCode = cond.icd10Code.split(".")[0];
      if (baseCode) terms.push(baseCode.toLowerCase());
    }

    if (cond.diagnosticCode) {
      terms.push(cond.diagnosticCode.toLowerCase());
    }
  }

  return [...new Set(terms)].filter(t => t.length >= 2);
}

function extractSections(content: string, searchTerms: string[], contextChars: number = 500): string {
  const contentLower = content.toLowerCase();
  const matches: Array<{ start: number; end: number }> = [];

  for (const term of searchTerms) {
    let idx = 0;
    while (idx < contentLower.length) {
      const found = contentLower.indexOf(term, idx);
      if (found === -1) break;

      let sectionStart = Math.max(0, found - contextChars);
      let sectionEnd = Math.min(content.length, found + term.length + contextChars);

      const prevNewline = content.lastIndexOf("\n", sectionStart);
      if (prevNewline >= sectionStart - 50) sectionStart = prevNewline + 1;

      const nextNewline = content.indexOf("\n", sectionEnd);
      if (nextNewline > 0 && nextNewline <= sectionEnd + 50) sectionEnd = nextNewline;

      matches.push({ start: sectionStart, end: sectionEnd });
      idx = found + term.length;
    }
  }

  if (matches.length === 0) return "";

  matches.sort((a, b) => a.start - b.start);

  const merged: Array<{ start: number; end: number }> = [matches[0]];
  for (let i = 1; i < matches.length; i++) {
    const last = merged[merged.length - 1];
    if (matches[i].start <= last.end + 100) {
      last.end = Math.max(last.end, matches[i].end);
    } else {
      merged.push({ ...matches[i] });
    }
  }

  const sections = merged.map(m => content.slice(m.start, m.end).trim());
  return sections.join("\n\n---\n\n");
}

export function extractRelevantContext(fullContent: string, conditions: Condition[]): string {
  if (!fullContent || conditions.length === 0) return "";

  const searchTerms = buildSearchTerms(conditions);
  if (searchTerms.length === 0) return "";

  const extracted = extractSections(fullContent, searchTerms);

  const maxLength = 200000;
  if (extracted.length > maxLength) {
    return extracted.slice(0, maxLength);
  }

  return extracted;
}

export function searchContentForTopic(fullContent: string, topic: string): string {
  if (!fullContent || !topic) return "";

  const terms = topic.toLowerCase().split(/\s+/).filter(t => t.length >= 3);

  for (const [key, synonyms] of Object.entries(CONDITION_SYNONYMS)) {
    if (terms.some(t => key.includes(t) || synonyms.some(s => s.includes(t)))) {
      terms.push(...synonyms);
    }
  }

  const uniqueTerms = [...new Set(terms)];
  return extractSections(fullContent, uniqueTerms, 300);
}
