export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  nextBirthdayDays: number;
}

export function calculateAge(birthDateString: string, targetDateString?: string): AgeResult | null {
  if (!birthDateString) return null;
  const birth = new Date(birthDateString);
  const target = targetDateString ? new Date(targetDateString) : new Date();

  if (isNaN(birth.getTime()) || isNaN(target.getTime())) return null;
  if (birth > target) return null;

  let years = target.getFullYear() - birth.getFullYear();
  let months = target.getMonth() - birth.getMonth();
  let days = target.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const diffMs = target.getTime() - birth.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;

  // Next birthday calculation
  let nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBday < target) {
    nextBday = new Date(target.getFullYear() + 1, birth.getMonth(), birth.getDate());
  }
  const nextBirthdayDays = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalHours,
    nextBirthdayDays,
  };
}

export interface FuelCostInput {
  distanceKm: number;
  fuelEfficiencyKmPerLiter: number; // e.g. 15 km/l
  fuelPricePerLiter: number;
  passengers?: number;
}

export interface FuelCostResult {
  litersNeeded: number;
  totalCost: number;
  costPerKm: number;
  costPerPerson: number;
}

export function calculateFuelCost(input: FuelCostInput): FuelCostResult {
  const dist = Math.max(0, input.distanceKm);
  const efficiency = Math.max(0.1, input.fuelEfficiencyKmPerLiter);
  const price = Math.max(0, input.fuelPricePerLiter);
  const passengers = Math.max(1, input.passengers || 1);

  const litersNeeded = dist / efficiency;
  const totalCost = litersNeeded * price;
  const costPerKm = dist > 0 ? totalCost / dist : 0;
  const costPerPerson = totalCost / passengers;

  return {
    litersNeeded: Math.round(litersNeeded * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    costPerKm: Math.round(costPerKm * 100) / 100,
    costPerPerson: Math.round(costPerPerson * 100) / 100,
  };
}

export interface DateDiffResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  businessDays: number;
  weekendDays: number;
}

export function calculateDateDifference(startDateStr: string, endDateStr: string): DateDiffResult | null {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  const d1 = start < end ? start : end;
  const d2 = start < end ? end : start;

  let years = d2.getFullYear() - d1.getFullYear();
  let months = d2.getMonth() - d1.getMonth();
  let days = d2.getDate() - d1.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const diffMs = d2.getTime() - d1.getTime();
  const totalDays = Math.round(diffMs / 86400000);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;

  // Count business days
  let businessDays = 0;
  let weekendDays = 0;
  const cur = new Date(d1.getTime());
  while (cur < d2) {
    const dayOfWeek = cur.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendDays++;
    } else {
      businessDays++;
    }
    cur.setDate(cur.getDate() + 1);
  }

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalHours,
    businessDays,
    weekendDays,
  };
}

export interface HoursWorkedInput {
  startTime: string; // "09:00"
  endTime: string; // "17:30"
  breakMinutes: number; // e.g. 30
  hourlyRate?: number;
}

export interface HoursWorkedResult {
  totalMinutes: number;
  totalHoursDecimal: number;
  hoursAndMinutes: string;
  regularHours: number;
  overtimeHours: number;
  grossPay?: number;
}

export function calculateHoursWorked(input: HoursWorkedInput): HoursWorkedResult {
  const [sH, sM] = (input.startTime || '09:00').split(':').map(Number);
  const [eH, eM] = (input.endTime || '17:00').split(':').map(Number);

  let startMinutes = sH * 60 + sM;
  let endMinutes = eH * 60 + eM;
  if (endMinutes < startMinutes) {
    // Overnight shift
    endMinutes += 24 * 60;
  }

  const rawMinutes = Math.max(0, endMinutes - startMinutes);
  const breakMin = Math.max(0, input.breakMinutes || 0);
  const netMinutes = Math.max(0, rawMinutes - breakMin);

  const totalHoursDecimal = Math.round((netMinutes / 60) * 100) / 100;
  const h = Math.floor(netMinutes / 60);
  const m = netMinutes % 60;

  const regularHours = Math.min(8, totalHoursDecimal);
  const overtimeHours = Math.max(0, totalHoursDecimal - 8);

  let grossPay: number | undefined;
  if (input.hourlyRate && input.hourlyRate > 0) {
    // Standard 1.5x overtime rate for >8 hours
    grossPay = Math.round((regularHours * input.hourlyRate + overtimeHours * input.hourlyRate * 1.5) * 100) / 100;
  }

  return {
    totalMinutes: netMinutes,
    totalHoursDecimal,
    hoursAndMinutes: `${h}h ${m}m`,
    regularHours,
    overtimeHours,
    grossPay,
  };
}

export interface CourseGrade {
  courseName: string;
  gradePoints: number; // e.g. A=4.0, B=3.0
  creditHours: number; // e.g. 3
}

export interface GPAResult {
  gpa: number;
  totalCredits: number;
  totalQualityPoints: number;
  academicStanding: string;
}

export function calculateGPA(courses: CourseGrade[]): GPAResult {
  let totalCredits = 0;
  let totalPoints = 0;

  for (const c of courses) {
    const cr = Math.max(0, c.creditHours);
    totalCredits += cr;
    totalPoints += cr * c.gradePoints;
  }

  const gpa = totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0;
  let academicStanding = 'Good Standing';
  if (gpa >= 3.8) academicStanding = 'Summa Cum Laude / Dean’s List';
  else if (gpa >= 3.5) academicStanding = 'Magna Cum Laude';
  else if (gpa >= 3.0) academicStanding = 'Cum Laude / Above Average';
  else if (gpa < 2.0) academicStanding = 'Academic Warning / Probation';

  return {
    gpa,
    totalCredits,
    totalQualityPoints: Math.round(totalPoints * 100) / 100,
    academicStanding,
  };
}

export interface FinalGradeInput {
  currentGradePercent: number;
  targetGradePercent: number;
  finalWeightPercent: number;
}

export interface FinalGradeResult {
  requiredFinalScorePercent: number;
  isPossible: boolean;
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Very Difficult' | 'Impossible';
}

export function calculateFinalGrade(input: FinalGradeInput): FinalGradeResult {
  const current = Math.max(0, input.currentGradePercent);
  const target = Math.max(0, input.targetGradePercent);
  const weight = Math.max(1, Math.min(100, input.finalWeightPercent)) / 100;

  // Formula: Target = Current*(1 - Weight) + Final*Weight => Final = (Target - Current*(1 - Weight)) / Weight
  const required = (target - current * (1 - weight)) / weight;
  const score = Math.round(required * 10) / 10;

  let difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Very Difficult' | 'Impossible' = 'Moderate';
  if (score > 100) difficulty = 'Impossible';
  else if (score > 90) difficulty = 'Very Difficult';
  else if (score > 75) difficulty = 'Challenging';
  else if (score > 50) difficulty = 'Moderate';
  else difficulty = 'Easy';

  return {
    requiredFinalScorePercent: score,
    isPossible: score <= 100,
    difficulty,
  };
}

export interface PasswordConfig {
  length: number;
  includeUpper: boolean;
  includeLower: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean;
}

export function generatePassword(config: PasswordConfig): { password: string; entropyBits: number; strength: string } {
  let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let lower = 'abcdefghijklmnopqrstuvwxyz';
  let numbers = '0123456789';
  let symbols = '!@#$%^&*()_+~|}{[]:;?><,.-=';

  if (config.excludeAmbiguous) {
    upper = upper.replace(/[IO]/g, '');
    lower = lower.replace(/[lo]/g, '');
    numbers = numbers.replace(/[01]/g, '');
    symbols = symbols.replace(/[|{};:[\]]/g, '');
  }

  let pool = '';
  if (config.includeUpper) pool += upper;
  if (config.includeLower) pool += lower;
  if (config.includeNumbers) pool += numbers;
  if (config.includeSymbols) pool += symbols;

  if (!pool) pool = lower + numbers;

  const len = Math.max(6, Math.min(64, config.length));
  let password = '';
  const cryptoObj = typeof window !== 'undefined' && window.crypto ? window.crypto : null;

  if (cryptoObj && cryptoObj.getRandomValues) {
    const array = new Uint32Array(len);
    cryptoObj.getRandomValues(array);
    for (let i = 0; i < len; i++) {
      password += pool[array[i] % pool.length];
    }
  } else {
    for (let i = 0; i < len; i++) {
      password += pool[Math.floor(Math.random() * pool.length)];
    }
  }

  // Calculate entropy: E = L * log2(pool.length)
  const entropyBits = Math.round(len * (Math.log(pool.length) / Math.log(2)));
  let strength = 'Weak';
  if (entropyBits >= 80) strength = 'Very Strong';
  else if (entropyBits >= 60) strength = 'Strong';
  else if (entropyBits >= 40) strength = 'Moderate';

  return {
    password,
    entropyBits,
    strength,
  };
}

export interface SubnetResult {
  ipAddress: string;
  cidr: number;
  netmask: string;
  wildcardMask: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsableIP: string;
  lastUsableIP: string;
  totalHosts: number;
  usableHosts: number;
}

export function calculateSubnet(ip: string, cidr: number): SubnetResult | null {
  const parts = ip.trim().split('.').map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return null;
  }
  const prefix = Math.max(0, Math.min(32, cidr));

  const ipInt = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
  const maskInt = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  const wildcardInt = ~maskInt >>> 0;

  const netInt = (ipInt & maskInt) >>> 0;
  const bcastInt = (netInt | wildcardInt) >>> 0;

  const toIP = (val: number) =>
    [(val >>> 24) & 255, (val >>> 16) & 255, (val >>> 8) & 255, val & 255].join('.');

  const totalHosts = Math.pow(2, 32 - prefix);
  const usableHosts = prefix >= 31 ? 0 : Math.max(0, totalHosts - 2);

  const firstUsable = prefix >= 31 ? toIP(netInt) : toIP(netInt + 1);
  const lastUsable = prefix >= 31 ? toIP(bcastInt) : toIP(bcastInt - 1);

  return {
    ipAddress: parts.join('.'),
    cidr: prefix,
    netmask: toIP(maskInt),
    wildcardMask: toIP(wildcardInt),
    networkAddress: toIP(netInt),
    broadcastAddress: toIP(bcastInt),
    firstUsableIP: firstUsable,
    lastUsableIP: lastUsable,
    totalHosts,
    usableHosts,
  };
}

export interface TravelBudgetInput {
  days: number;
  travelers: number;
  flightsTransit: number;
  lodgingPerNight: number;
  foodPerDayPerPerson: number;
  activitiesPerDayPerPerson: number;
  localTransport: number;
  contingencyPercent: number;
}

export interface TravelBudgetResult {
  totalBudget: number;
  costPerPerson: number;
  costPerDay: number;
  flightsTotal: number;
  lodgingTotal: number;
  foodTotal: number;
  activitiesTotal: number;
  localTransportTotal: number;
  contingencyTotal: number;
}

export function calculateTravelBudget(input: TravelBudgetInput): TravelBudgetResult {
  const days = Math.max(1, input.days || 1);
  const travelers = Math.max(1, input.travelers || 1);
  const nights = Math.max(0, days - 1);

  const flightsTotal = Math.max(0, input.flightsTransit || 0);
  const lodgingTotal = Math.max(0, input.lodgingPerNight || 0) * nights;
  const foodTotal = Math.max(0, input.foodPerDayPerPerson || 0) * days * travelers;
  const activitiesTotal = Math.max(0, input.activitiesPerDayPerPerson || 0) * days * travelers;
  const localTransportTotal = Math.max(0, input.localTransport || 0);

  const subtotal = flightsTotal + lodgingTotal + foodTotal + activitiesTotal + localTransportTotal;
  const contingencyPercent = Math.max(0, input.contingencyPercent || 0);
  const contingencyTotal = Math.round((subtotal * contingencyPercent) / 100);
  const totalBudget = subtotal + contingencyTotal;

  return {
    totalBudget,
    costPerPerson: Math.round(totalBudget / travelers),
    costPerDay: Math.round(totalBudget / days),
    flightsTotal,
    lodgingTotal,
    foodTotal,
    activitiesTotal,
    localTransportTotal,
    contingencyTotal,
  };
}

