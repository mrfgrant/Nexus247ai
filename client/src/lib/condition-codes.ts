export interface ConditionCodeEntry {
  name: string;
  aliases: string[];
  icd10: string;
  diagnosticCode: string;
  category: string;
  maxRating: number;
}

export const CONDITION_CODES: ConditionCodeEntry[] = [
  { name: "PTSD", aliases: ["post traumatic stress disorder", "post-traumatic stress", "combat stress"], icd10: "F43.10", diagnosticCode: "9411", category: "Mental Health", maxRating: 100 },
  { name: "Major Depressive Disorder", aliases: ["depression", "mdd", "major depression", "depressive disorder"], icd10: "F33.1", diagnosticCode: "9434", category: "Mental Health", maxRating: 100 },
  { name: "Generalized Anxiety Disorder", aliases: ["anxiety", "gad", "anxiety disorder"], icd10: "F41.1", diagnosticCode: "9400", category: "Mental Health", maxRating: 100 },
  { name: "Bipolar Disorder", aliases: ["bipolar", "manic depression", "bipolar i", "bipolar ii"], icd10: "F31.9", diagnosticCode: "9432", category: "Mental Health", maxRating: 100 },
  { name: "Adjustment Disorder", aliases: ["adjustment disorder with anxiety", "adjustment disorder with depression"], icd10: "F43.20", diagnosticCode: "9440", category: "Mental Health", maxRating: 100 },
  { name: "Panic Disorder", aliases: ["panic attacks", "panic"], icd10: "F41.0", diagnosticCode: "9412", category: "Mental Health", maxRating: 100 },
  { name: "Insomnia", aliases: ["sleep disorder", "difficulty sleeping", "chronic insomnia"], icd10: "G47.00", diagnosticCode: "8108", category: "Mental Health", maxRating: 100 },
  { name: "Traumatic Brain Injury", aliases: ["tbi", "brain injury", "concussion", "head injury"], icd10: "S06.9", diagnosticCode: "8045", category: "Neurological", maxRating: 100 },
  { name: "Obstructive Sleep Apnea", aliases: ["sleep apnea", "osa", "apnea"], icd10: "G47.33", diagnosticCode: "6847", category: "Respiratory", maxRating: 100 },

  { name: "Tinnitus", aliases: ["ringing in ears", "ear ringing", "ringing ears"], icd10: "H93.19", diagnosticCode: "6260", category: "Ear/Hearing", maxRating: 10 },
  { name: "Bilateral Hearing Loss", aliases: ["hearing loss", "hearing impairment", "sensorineural hearing loss", "hearing damage"], icd10: "H90.3", diagnosticCode: "6100", category: "Ear/Hearing", maxRating: 100 },
  { name: "Meniere's Disease", aliases: ["meniere", "menieres", "vertigo with hearing loss"], icd10: "H81.09", diagnosticCode: "6205", category: "Ear/Hearing", maxRating: 100 },

  { name: "Lumbar Strain", aliases: ["low back pain", "lower back pain", "back strain", "lumbago", "lumbar spine"], icd10: "M54.5", diagnosticCode: "5237", category: "Musculoskeletal", maxRating: 50 },
  { name: "Degenerative Disc Disease (Lumbar)", aliases: ["ddd lumbar", "lumbar disc disease", "degenerative disc lumbar", "back disc"], icd10: "M51.36", diagnosticCode: "5242", category: "Musculoskeletal", maxRating: 60 },
  { name: "Cervical Strain", aliases: ["neck pain", "neck strain", "cervical spine", "neck injury"], icd10: "M54.2", diagnosticCode: "5237", category: "Musculoskeletal", maxRating: 40 },
  { name: "Degenerative Disc Disease (Cervical)", aliases: ["ddd cervical", "cervical disc disease", "degenerative disc neck", "neck disc"], icd10: "M50.30", diagnosticCode: "5242", category: "Musculoskeletal", maxRating: 60 },
  { name: "Thoracolumbar Strain", aliases: ["thoracolumbar", "mid back pain", "thoracic back"], icd10: "M54.6", diagnosticCode: "5237", category: "Musculoskeletal", maxRating: 50 },
  { name: "Left Knee Strain", aliases: ["left knee pain", "left knee injury"], icd10: "M25.562", diagnosticCode: "5260", category: "Musculoskeletal", maxRating: 30 },
  { name: "Right Knee Strain", aliases: ["right knee pain", "right knee injury"], icd10: "M25.561", diagnosticCode: "5260", category: "Musculoskeletal", maxRating: 30 },
  { name: "Knee Osteoarthritis", aliases: ["knee arthritis", "degenerative knee", "knee oa"], icd10: "M17.9", diagnosticCode: "5003", category: "Musculoskeletal", maxRating: 20 },
  { name: "Left Shoulder Strain", aliases: ["left shoulder pain", "left shoulder injury", "left rotator cuff"], icd10: "M75.102", diagnosticCode: "5201", category: "Musculoskeletal", maxRating: 40 },
  { name: "Right Shoulder Strain", aliases: ["right shoulder pain", "right shoulder injury", "right rotator cuff"], icd10: "M75.101", diagnosticCode: "5201", category: "Musculoskeletal", maxRating: 40 },
  { name: "Rotator Cuff Tear", aliases: ["rotator cuff", "rotator cuff injury", "shoulder tear"], icd10: "M75.10", diagnosticCode: "5201", category: "Musculoskeletal", maxRating: 40 },
  { name: "Left Ankle Strain", aliases: ["left ankle pain", "left ankle injury"], icd10: "M25.572", diagnosticCode: "5271", category: "Musculoskeletal", maxRating: 20 },
  { name: "Right Ankle Strain", aliases: ["right ankle pain", "right ankle injury"], icd10: "M25.571", diagnosticCode: "5271", category: "Musculoskeletal", maxRating: 20 },
  { name: "Plantar Fasciitis", aliases: ["heel pain", "foot pain", "plantar fascia", "heel spur"], icd10: "M72.2", diagnosticCode: "5276", category: "Musculoskeletal", maxRating: 50 },
  { name: "Flat Feet (Pes Planus)", aliases: ["flat feet", "pes planus", "fallen arches", "flatfoot"], icd10: "M21.40", diagnosticCode: "5276", category: "Musculoskeletal", maxRating: 50 },
  { name: "Left Hip Strain", aliases: ["left hip pain", "left hip injury"], icd10: "M25.552", diagnosticCode: "5252", category: "Musculoskeletal", maxRating: 40 },
  { name: "Right Hip Strain", aliases: ["right hip pain", "right hip injury"], icd10: "M25.551", diagnosticCode: "5252", category: "Musculoskeletal", maxRating: 40 },
  { name: "Left Wrist Strain", aliases: ["left wrist pain", "left wrist injury"], icd10: "M25.532", diagnosticCode: "5215", category: "Musculoskeletal", maxRating: 10 },
  { name: "Right Wrist Strain", aliases: ["right wrist pain", "right wrist injury"], icd10: "M25.531", diagnosticCode: "5215", category: "Musculoskeletal", maxRating: 10 },
  { name: "Carpal Tunnel Syndrome", aliases: ["carpal tunnel", "cts", "wrist numbness", "hand numbness"], icd10: "G56.00", diagnosticCode: "8515", category: "Neurological", maxRating: 70 },
  { name: "Fibromyalgia", aliases: ["fibro", "widespread pain", "chronic pain syndrome"], icd10: "M79.7", diagnosticCode: "5025", category: "Musculoskeletal", maxRating: 40 },
  { name: "Sciatica", aliases: ["sciatic nerve", "radiating leg pain", "lumbar radiculopathy"], icd10: "M54.30", diagnosticCode: "8520", category: "Neurological", maxRating: 80 },
  { name: "Gout", aliases: ["gouty arthritis"], icd10: "M10.9", diagnosticCode: "5017", category: "Musculoskeletal", maxRating: 60 },
  { name: "Rheumatoid Arthritis", aliases: ["ra", "inflammatory arthritis"], icd10: "M06.9", diagnosticCode: "5002", category: "Musculoskeletal", maxRating: 100 },

  { name: "Migraine Headaches", aliases: ["migraines", "headaches", "chronic headaches", "migraine", "tension headaches"], icd10: "G43.909", diagnosticCode: "8100", category: "Neurological", maxRating: 50 },
  { name: "Peripheral Neuropathy (Upper)", aliases: ["upper extremity neuropathy", "hand neuropathy", "arm neuropathy", "radiculopathy upper"], icd10: "G62.9", diagnosticCode: "8515", category: "Neurological", maxRating: 70 },
  { name: "Peripheral Neuropathy (Lower)", aliases: ["lower extremity neuropathy", "foot neuropathy", "leg neuropathy", "radiculopathy lower"], icd10: "G62.9", diagnosticCode: "8520", category: "Neurological", maxRating: 80 },
  { name: "Radiculopathy", aliases: ["pinched nerve", "nerve root", "radicular pain"], icd10: "M54.10", diagnosticCode: "8510", category: "Neurological", maxRating: 80 },
  { name: "Epilepsy", aliases: ["seizures", "seizure disorder"], icd10: "G40.909", diagnosticCode: "8910", category: "Neurological", maxRating: 100 },

  { name: "Hypertension", aliases: ["high blood pressure", "htn", "elevated blood pressure"], icd10: "I10", diagnosticCode: "7101", category: "Cardiovascular", maxRating: 60 },
  { name: "Coronary Artery Disease", aliases: ["cad", "heart disease", "ischemic heart disease", "coronary disease"], icd10: "I25.10", diagnosticCode: "7005", category: "Cardiovascular", maxRating: 100 },
  { name: "Heart Arrhythmia", aliases: ["irregular heartbeat", "afib", "atrial fibrillation", "arrhythmia"], icd10: "I49.9", diagnosticCode: "7010", category: "Cardiovascular", maxRating: 100 },

  { name: "Asthma", aliases: ["bronchial asthma", "reactive airway"], icd10: "J45.909", diagnosticCode: "6602", category: "Respiratory", maxRating: 100 },
  { name: "COPD", aliases: ["chronic obstructive pulmonary disease", "emphysema", "chronic bronchitis"], icd10: "J44.1", diagnosticCode: "6604", category: "Respiratory", maxRating: 100 },
  { name: "Sinusitis", aliases: ["chronic sinusitis", "sinus problems", "sinus infection"], icd10: "J32.9", diagnosticCode: "6513", category: "Respiratory", maxRating: 50 },
  { name: "Allergic Rhinitis", aliases: ["allergies", "hay fever", "nasal allergies", "rhinitis"], icd10: "J30.9", diagnosticCode: "6522", category: "Respiratory", maxRating: 30 },
  { name: "Deviated Septum", aliases: ["nasal septum deviation", "septum"], icd10: "J34.2", diagnosticCode: "6502", category: "Respiratory", maxRating: 10 },

  { name: "GERD", aliases: ["acid reflux", "gastroesophageal reflux", "heartburn", "reflux"], icd10: "K21.0", diagnosticCode: "7346", category: "Gastrointestinal", maxRating: 60 },
  { name: "Irritable Bowel Syndrome", aliases: ["ibs", "irritable bowel", "spastic colon"], icd10: "K58.9", diagnosticCode: "7319", category: "Gastrointestinal", maxRating: 30 },
  { name: "Hiatal Hernia", aliases: ["hiatus hernia", "stomach hernia"], icd10: "K44.9", diagnosticCode: "7346", category: "Gastrointestinal", maxRating: 60 },
  { name: "Crohn's Disease", aliases: ["crohns", "regional enteritis"], icd10: "K50.90", diagnosticCode: "7323", category: "Gastrointestinal", maxRating: 60 },
  { name: "Ulcerative Colitis", aliases: ["colitis", "uc"], icd10: "K51.90", diagnosticCode: "7323", category: "Gastrointestinal", maxRating: 60 },
  { name: "Hemorrhoids", aliases: ["piles"], icd10: "K64.9", diagnosticCode: "7336", category: "Gastrointestinal", maxRating: 20 },

  { name: "Type 2 Diabetes", aliases: ["diabetes", "diabetes mellitus", "type ii diabetes", "t2dm", "dm2"], icd10: "E11.9", diagnosticCode: "7913", category: "Endocrine", maxRating: 100 },
  { name: "Hypothyroidism", aliases: ["underactive thyroid", "low thyroid", "hashimotos"], icd10: "E03.9", diagnosticCode: "7903", category: "Endocrine", maxRating: 100 },
  { name: "Hyperthyroidism", aliases: ["overactive thyroid", "graves disease"], icd10: "E05.90", diagnosticCode: "7900", category: "Endocrine", maxRating: 100 },
  { name: "Erectile Dysfunction", aliases: ["ed", "impotence", "sexual dysfunction"], icd10: "N52.9", diagnosticCode: "7522", category: "Genitourinary", maxRating: 20 },

  { name: "Eczema", aliases: ["dermatitis", "atopic dermatitis", "skin rash"], icd10: "L30.9", diagnosticCode: "7806", category: "Skin", maxRating: 60 },
  { name: "Psoriasis", aliases: ["skin psoriasis", "plaque psoriasis"], icd10: "L40.9", diagnosticCode: "7816", category: "Skin", maxRating: 60 },
  { name: "Acne", aliases: ["cystic acne", "chloracne", "acne vulgaris"], icd10: "L70.0", diagnosticCode: "7828", category: "Skin", maxRating: 30 },
  { name: "Chronic Urticaria", aliases: ["hives", "chronic hives"], icd10: "L50.8", diagnosticCode: "7825", category: "Skin", maxRating: 60 },
  { name: "Skin Cancer", aliases: ["melanoma", "basal cell carcinoma", "squamous cell carcinoma"], icd10: "C44.9", diagnosticCode: "7818", category: "Skin", maxRating: 100 },
  { name: "Burn Scars", aliases: ["scarring", "burn scar", "scars from burns"], icd10: "L90.5", diagnosticCode: "7801", category: "Skin", maxRating: 80 },

  { name: "Kidney Stones", aliases: ["renal calculi", "nephrolithiasis"], icd10: "N20.0", diagnosticCode: "7508", category: "Genitourinary", maxRating: 30 },
  { name: "Chronic Kidney Disease", aliases: ["ckd", "renal disease", "kidney failure"], icd10: "N18.9", diagnosticCode: "7502", category: "Genitourinary", maxRating: 100 },
  { name: "Urinary Incontinence", aliases: ["bladder problems", "incontinence", "overactive bladder"], icd10: "N39.3", diagnosticCode: "7542", category: "Genitourinary", maxRating: 60 },

  { name: "Vision Loss", aliases: ["vision impairment", "blindness", "low vision", "visual impairment"], icd10: "H54.7", diagnosticCode: "6066", category: "Eye/Vision", maxRating: 100 },
  { name: "Glaucoma", aliases: ["eye pressure", "open angle glaucoma"], icd10: "H40.9", diagnosticCode: "6012", category: "Eye/Vision", maxRating: 100 },
  { name: "Cataracts", aliases: ["cataract", "lens opacity"], icd10: "H26.9", diagnosticCode: "6027", category: "Eye/Vision", maxRating: 30 },
  { name: "Dry Eye Syndrome", aliases: ["dry eyes", "keratoconjunctivitis sicca"], icd10: "H04.129", diagnosticCode: "6025", category: "Eye/Vision", maxRating: 30 },

  { name: "Gulf War Illness", aliases: ["gulf war syndrome", "undiagnosed illness", "chronic multisymptom illness"], icd10: "F48.8", diagnosticCode: "8863", category: "Environmental/Toxic Exposure", maxRating: 100 },
  { name: "Toxic Exposure (Burn Pit)", aliases: ["burn pit exposure", "airborne hazards", "toxic exposure"], icd10: "Z77.098", diagnosticCode: "6602", category: "Environmental/Toxic Exposure", maxRating: 100 },
  { name: "Agent Orange Presumptive", aliases: ["agent orange", "herbicide exposure"], icd10: "Z77.098", diagnosticCode: "7913", category: "Environmental/Toxic Exposure", maxRating: 100 },
];

export function searchConditions(query: string): ConditionCodeEntry[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase().trim();
  return CONDITION_CODES.filter((entry) => {
    if (entry.name.toLowerCase().includes(q)) return true;
    if (entry.aliases.some((a) => a.toLowerCase().includes(q))) return true;
    if (entry.category.toLowerCase().includes(q)) return true;
    return false;
  }).slice(0, 8);
}

export function findExactCondition(name: string): ConditionCodeEntry | undefined {
  const q = name.toLowerCase().trim();
  return CONDITION_CODES.find(
    (entry) =>
      entry.name.toLowerCase() === q ||
      entry.aliases.some((a) => a === q),
  );
}
