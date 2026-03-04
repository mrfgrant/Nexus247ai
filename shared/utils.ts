const RANK_MAP: Record<string, Record<string, string>> = {
  Army: {
    "E-1": "PVT", "E-2": "PV2", "E-3": "PFC", "E-4": "SPC", "E-5": "SGT",
    "E-6": "SSG", "E-7": "SFC", "E-8": "MSG", "E-9": "SGM",
    "O-1": "2LT", "O-2": "1LT", "O-3": "CPT", "O-4": "MAJ", "O-5": "LTC",
    "O-6": "COL", "O-7": "BG", "O-8": "MG", "O-9": "LTG", "O-10": "GEN",
    "W-1": "WO1", "W-2": "CW2", "W-3": "CW3", "W-4": "CW4", "W-5": "CW5",
  },
  Marines: {
    "E-1": "Pvt", "E-2": "PFC", "E-3": "LCpl", "E-4": "Cpl", "E-5": "Sgt",
    "E-6": "SSgt", "E-7": "GySgt", "E-8": "MSgt", "E-9": "MGySgt",
    "O-1": "2ndLt", "O-2": "1stLt", "O-3": "Capt", "O-4": "Maj", "O-5": "LtCol",
    "O-6": "Col", "O-7": "BGen", "O-8": "MajGen", "O-9": "LtGen", "O-10": "Gen",
    "W-1": "WO", "W-2": "CWO2", "W-3": "CWO3", "W-4": "CWO4", "W-5": "CWO5",
  },
  Navy: {
    "E-1": "SR", "E-2": "SA", "E-3": "SN", "E-4": "PO3", "E-5": "PO2",
    "E-6": "PO1", "E-7": "CPO", "E-8": "SCPO", "E-9": "MCPO",
    "O-1": "ENS", "O-2": "LTJG", "O-3": "LT", "O-4": "LCDR", "O-5": "CDR",
    "O-6": "CAPT", "O-7": "RDML", "O-8": "RADM", "O-9": "VADM", "O-10": "ADM",
    "W-1": "WO1", "W-2": "CWO2", "W-3": "CWO3", "W-4": "CWO4", "W-5": "CWO5",
  },
  "Coast Guard": {
    "E-1": "SR", "E-2": "SA", "E-3": "SN", "E-4": "PO3", "E-5": "PO2",
    "E-6": "PO1", "E-7": "CPO", "E-8": "SCPO", "E-9": "MCPO",
    "O-1": "ENS", "O-2": "LTJG", "O-3": "LT", "O-4": "LCDR", "O-5": "CDR",
    "O-6": "CAPT", "O-7": "RDML", "O-8": "RADM", "O-9": "VADM", "O-10": "ADM",
    "W-1": "WO1", "W-2": "CWO2", "W-3": "CWO3", "W-4": "CWO4", "W-5": "CWO5",
  },
  "Air Force": {
    "E-1": "AB", "E-2": "Amn", "E-3": "A1C", "E-4": "SrA", "E-5": "SSgt",
    "E-6": "TSgt", "E-7": "MSgt", "E-8": "SMSgt", "E-9": "CMSgt",
    "O-1": "2d Lt", "O-2": "1st Lt", "O-3": "Capt", "O-4": "Maj", "O-5": "Lt Col",
    "O-6": "Col", "O-7": "Brig Gen", "O-8": "Maj Gen", "O-9": "Lt Gen", "O-10": "Gen",
    "W-1": "WO1", "W-2": "CW2", "W-3": "CW3", "W-4": "CW4", "W-5": "CW5",
  },
  "Space Force": {
    "E-1": "Spc 1", "E-2": "Spc 2", "E-3": "Spc 3", "E-4": "Spc 4", "E-5": "Sgt",
    "E-6": "TSgt", "E-7": "MSgt", "E-8": "SMSgt", "E-9": "CMSgt",
    "O-1": "2d Lt", "O-2": "1st Lt", "O-3": "Capt", "O-4": "Maj", "O-5": "Lt Col",
    "O-6": "Col", "O-7": "Brig Gen", "O-8": "Maj Gen", "O-9": "Lt Gen", "O-10": "Gen",
    "W-1": "WO1", "W-2": "CW2", "W-3": "CW3", "W-4": "CW4", "W-5": "CW5",
  },
};

const BRANCH_ALIASES: Record<string, string> = {
  "army": "Army",
  "navy": "Navy",
  "air force": "Air Force",
  "airforce": "Air Force",
  "usaf": "Air Force",
  "marines": "Marines",
  "marine corps": "Marines",
  "usmc": "Marines",
  "coast guard": "Coast Guard",
  "uscg": "Coast Guard",
  "us coast guard": "Coast Guard",
  "space force": "Space Force",
  "ussf": "Space Force",
};

function normalizeBranch(branch: string | null | undefined): string {
  if (!branch) return "";
  const key = branch.trim().toLowerCase();
  return BRANCH_ALIASES[key] || branch.trim();
}

const ALL_KNOWN_ABBREVS = new Set<string>();
for (const branch of Object.values(RANK_MAP)) {
  for (const abbrev of Object.values(branch)) {
    ALL_KNOWN_ABBREVS.add(abbrev.toUpperCase());
  }
}

function normalizePayGrade(input: string): string | null {
  const match = input.match(/([EOW])-?(\d{1,2})/i);
  if (match) {
    return `${match[1].toUpperCase()}-${match[2]}`;
  }
  return null;
}

function extractRankAbbrev(rank: string, branch: string | null | undefined): string | null {
  if (!rank) return null;
  const trimmed = rank.trim();

  if (trimmed.includes("/")) {
    const parts = trimmed.split("/");
    const afterSlash = parts[parts.length - 1].trim();
    if (afterSlash && afterSlash.length > 0) {
      return afterSlash;
    }
  }

  const payGrade = normalizePayGrade(trimmed);
  if (payGrade) {
    const branchKey = normalizeBranch(branch);
    const branchMap = RANK_MAP[branchKey];
    if (branchMap && branchMap[payGrade]) {
      return branchMap[payGrade];
    }
    if (RANK_MAP["Army"][payGrade]) {
      return RANK_MAP["Army"][payGrade];
    }
    return payGrade;
  }

  if (ALL_KNOWN_ABBREVS.has(trimmed.toUpperCase())) {
    return trimmed;
  }

  if (/^[A-Za-z]{2,}/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

export function getRankDisplayName(
  rank: string | null | undefined,
  branch: string | null | undefined,
  lastName: string | null | undefined,
  firstName?: string | null | undefined,
): string {
  const abbrev = rank ? extractRankAbbrev(rank, branch) : null;
  const last = lastName?.trim() || null;
  const first = firstName?.trim() || null;

  if (abbrev && last) return `${abbrev} ${last}`;
  if (abbrev) return abbrev;
  if (last) return last;
  if (first) return first;
  return "Veteran";
}
