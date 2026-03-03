export const MONTHLY_RATES: Record<number, number> = {
  0: 0, 10: 171, 20: 338, 30: 524, 40: 755,
  50: 1075, 60: 1362, 70: 1808, 80: 2102,
  90: 2362, 100: 3939,
};

export const SMC_RATES: Record<string, number> = {
  K: 140,
  S: 4409,
  L: 4901,
  "L½": 5577,
  M: 6081,
  "M½": 6585,
  N: 7089,
  "N½": 7230,
  "O/P": 8078,
  R1: 9974,
  R2: 11272,
};

export interface SmcLevel {
  level: string;
  rate: number;
  description: string;
}

export const SMC_INFO: SmcLevel[] = [
  { level: "K", rate: 140, description: "Loss or loss of use of a hand, foot, eye, or reproductive organ. Added to base pay; up to 3 awards possible." },
  { level: "S", rate: 4409, description: "Housebound: 100% rating plus an additional disability rated 60%+, or permanently confined to home." },
  { level: "L", rate: 4901, description: "Loss of both feet, blindness in both eyes, or bedridden with need for Aid & Attendance." },
  { level: "L½", rate: 5577, description: "Between SMC-L and SMC-M severity levels." },
  { level: "M", rate: 6081, description: "Loss of use of both hands, or both legs at or above the knee." },
  { level: "M½", rate: 6585, description: "Between SMC-M and SMC-N severity levels." },
  { level: "N", rate: 7089, description: "Loss of both arms at or above the elbow, or combination of severe anatomical losses." },
  { level: "N½", rate: 7230, description: "Between SMC-N and SMC-O severity levels." },
  { level: "O/P", rate: 8078, description: "Most severe anatomical losses requiring Aid & Attendance." },
  { level: "R1", rate: 9974, description: "High-level SMC plus daily Aid & Attendance needed for basic self-care." },
  { level: "R2", rate: 11272, description: "Requires continuous skilled nursing care or supervision (nursing home level of care)." },
];
