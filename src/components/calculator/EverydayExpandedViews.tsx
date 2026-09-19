import React, { useState, useMemo } from 'react';
import { useSettings } from '../../context/SettingsContext';
import {
  calculateDateDifference,
  calculateHoursWorked,
  calculateGPA,
  calculateFinalGrade,
  generatePassword,
  calculateSubnet,
  calculateTravelBudget,
  CourseGrade,
} from '../../engine/everyday';
import { NumberSliderInput } from '../common/NumberSliderInput';
import {
  Calendar,
  Clock,
  GraduationCap,
  Key,
  Network,
  Copy,
  CheckCircle2,
  Plus,
  Trash2,
  RefreshCw,
  Plane,
  Wallet,
  Users,
  Bed,
  Utensils,
  Ticket,
  RotateCcw,
} from 'lucide-react';

interface EverydayExpandedViewsProps {
  toolSlug: string;
}

const EmptyStateCard: React.FC<{
  icon: React.ElementType;
  title: string;
  subtitle: string;
}> = ({ icon: Icon, title, subtitle }) => (
  <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[260px]">
    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-sm font-bold text-slate-800">{title}</h3>
    <p className="text-xs text-slate-500 mt-1 max-w-xs">{subtitle}</p>
  </div>
);

export const EverydayExpandedViews: React.FC<EverydayExpandedViewsProps> = ({ toolSlug }) => {
  const { formatMoney, currencySymbol } = useSettings();

  // ==========================================
  // DATE DIFFERENCE CALCULATOR
  // ==========================================
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  const dateDiffResult = useMemo(() => {
    if (!dateStart || !dateEnd) return null;
    return calculateDateDifference(dateStart, dateEnd);
  }, [dateStart, dateEnd]);

  const handleResetDateDiff = () => {
    setDateStart('');
    setDateEnd('');
  };

  // ==========================================
  // HOURS WORKED / TIMESHEET CALCULATOR
  // ==========================================
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [breakMins, setBreakMins] = useState<number | ''>('');
  const [hourlyWage, setHourlyWage] = useState<number | ''>('');
  const [otRateMultiplier, setOtRateMultiplier] = useState<number | ''>('');
  const [daysWorked, setDaysWorked] = useState<number | ''>('');

  const hoursResult = useMemo(() => {
    if (!timeStart || !timeEnd || typeof hourlyWage !== 'number' || hourlyWage <= 0) {
      return null;
    }
    const days = typeof daysWorked === 'number' && daysWorked > 0 ? daysWorked : 1;
    const otMult = typeof otRateMultiplier === 'number' && otRateMultiplier > 0 ? otRateMultiplier : 1.5;
    const singleShift = calculateHoursWorked({
      startTime: timeStart,
      endTime: timeEnd,
      breakMinutes: typeof breakMins === 'number' ? breakMins : 0,
      hourlyRate: hourlyWage,
    });
    const regularPay = singleShift.regularHours * hourlyWage * days;
    const overtimePay = singleShift.overtimeHours * hourlyWage * otMult * days;
    const totalGrossPay = regularPay + overtimePay;
    const totalHours = Math.round(singleShift.totalHoursDecimal * days * 10) / 10;
    return {
      dailyHours: singleShift.totalHoursDecimal,
      totalHours,
      regularPay,
      overtimePay,
      totalGrossPay,
    };
  }, [timeStart, timeEnd, breakMins, hourlyWage, otRateMultiplier, daysWorked]);

  const handleResetHours = () => {
    setTimeStart('');
    setTimeEnd('');
    setBreakMins('');
    setHourlyWage('');
    setOtRateMultiplier('');
    setDaysWorked('');
  };

  // ==========================================
  // GPA CALCULATOR
  // ==========================================
  interface UIcourse {
    id: string;
    courseName: string;
    credits: number | '';
    letterGrade: string;
  }

  const [courses, setCourses] = useState<UIcourse[]>([
    { id: '1', courseName: '', credits: '', letterGrade: '' },
  ]);

  const GRADE_SCALE: Record<string, number> = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0,
  };

  const gpaResult = useMemo(() => {
    const validCourses = courses.filter(
      (c) => typeof c.credits === 'number' && c.credits > 0 && c.letterGrade && GRADE_SCALE[c.letterGrade] !== undefined
    );
    if (validCourses.length === 0) return null;
    const engineCourses: CourseGrade[] = validCourses.map((c) => ({
      courseName: c.courseName || 'Course',
      creditHours: typeof c.credits === 'number' ? c.credits : 0,
      gradePoints: GRADE_SCALE[c.letterGrade] ?? 4.0,
    }));
    return calculateGPA(engineCourses);
  }, [courses]);

  const handleAddCourse = () => {
    setCourses((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        courseName: '',
        credits: '',
        letterGrade: '',
      },
    ]);
  };

  const handleRemoveCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleResetGPA = () => {
    setCourses([{ id: '1', courseName: '', credits: '', letterGrade: '' }]);
  };

  // ==========================================
  // FINAL GRADE CALCULATOR
  // ==========================================
  const [currentGrade, setCurrentGrade] = useState<number | ''>('');
  const [targetGrade, setTargetGrade] = useState<number | ''>('');
  const [finalWeight, setFinalWeight] = useState<number | ''>('');

  const finalGradeResult = useMemo(() => {
    if (
      typeof currentGrade !== 'number' ||
      typeof targetGrade !== 'number' ||
      typeof finalWeight !== 'number' ||
      finalWeight <= 0
    ) {
      return null;
    }
    return calculateFinalGrade({
      currentGradePercent: currentGrade,
      targetGradePercent: targetGrade,
      finalWeightPercent: finalWeight,
    });
  }, [currentGrade, targetGrade, finalWeight]);

  const handleResetGrade = () => {
    setCurrentGrade('');
    setTargetGrade('');
    setFinalWeight('');
  };

  // ==========================================
  // PASSWORD GENERATOR
  // ==========================================
  const [pwLength, setPwLength] = useState(16);
  const [pwUpper, setPwUpper] = useState(true);
  const [pwLower, setPwLower] = useState(true);
  const [pwNumbers, setPwNumbers] = useState(true);
  const [pwSymbols, setPwSymbols] = useState(true);
  const [copiedPw, setCopiedPw] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const passwordData = useMemo(() => {
    // refreshTrigger forces regenerate
    return generatePassword({
      length: pwLength,
      includeUpper: pwUpper,
      includeLower: pwLower,
      includeNumbers: pwNumbers,
      includeSymbols: pwSymbols,
      excludeAmbiguous: false,
    });
  }, [pwLength, pwUpper, pwLower, pwNumbers, pwSymbols, refreshTrigger]);

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(passwordData.password);
    setCopiedPw(true);
    setTimeout(() => setCopiedPw(false), 2000);
  };

  const handleResetPassword = () => {
    setPwLength(16);
    setPwUpper(true);
    setPwLower(true);
    setPwNumbers(true);
    setPwSymbols(true);
  };

  // ==========================================
  // IP SUBNET CALCULATOR
  // ==========================================
  const [subnetIp, setSubnetIp] = useState('');
  const [subnetCidr, setSubnetCidr] = useState<number | ''>('');

  const subnetResult = useMemo(() => {
    if (!subnetIp.trim() || typeof subnetCidr !== 'number') {
      return null;
    }
    return calculateSubnet(subnetIp.trim(), subnetCidr);
  }, [subnetIp, subnetCidr]);

  const handleResetSubnet = () => {
    setSubnetIp('');
    setSubnetCidr('');
  };

  // 1. DATE DIFFERENCE CALCULATOR
  if (toolSlug === 'date-difference-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-5">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-slate-500">Enter Calendar Dates</span>
            <button
              type="button"
              onClick={handleResetDateDiff}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-100"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Start Date</label>
            <input
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">End Date</label>
            <input
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-white"
            />
          </div>
        </div>

        {dateDiffResult ? (
          <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Duration</span>
            <div className="text-5xl font-extrabold text-blue-600 tracking-tight mt-2">
              {dateDiffResult.totalDays} Days
            </div>
            <p className="text-xs text-slate-500 mt-2">
              (~{dateDiffResult.totalWeeks} Weeks and {dateDiffResult.days} Days)
            </p>

            <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-slate-200 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Working Business Days</span>
                <span className="text-2xl font-bold text-emerald-600 mt-1 block">
                  {dateDiffResult.businessDays} Days
                </span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Weekend Days</span>
                <span className="text-2xl font-bold text-slate-700 mt-1 block">
                  {dateDiffResult.weekendDays} Days
                </span>
              </div>
            </div>
          </div>
        ) : (
          <EmptyStateCard
            icon={Calendar}
            title="Select Start and End Dates"
            subtitle="Pick both dates to calculate the exact calendar duration, business days, and weekend count."
          />
        )}
      </div>
    );
  }

  // 2. HOURS WORKED / TIMESHEET CALCULATOR
  if (toolSlug === 'hours-worked-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-5">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-slate-500">Shift Parameters</span>
            <button
              type="button"
              onClick={handleResetHours}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-100"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Shift Start Time</label>
              <input
                type="time"
                value={timeStart}
                onChange={(e) => setTimeStart(e.target.value)}
                className="w-full text-sm font-semibold p-2.5 rounded-xl border border-slate-200 bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Shift End Time</label>
              <input
                type="time"
                value={timeEnd}
                onChange={(e) => setTimeEnd(e.target.value)}
                className="w-full text-sm font-semibold p-2.5 rounded-xl border border-slate-200 bg-white"
              />
            </div>
          </div>

          <NumberSliderInput
            id="break-mins"
            label="Unpaid Lunch / Break (Minutes per day)"
            value={breakMins}
            onChange={setBreakMins}
            min={0}
            max={120}
            step={15}
            suffix="Mins"
            placeholder="e.g. 30"
          />
          <NumberSliderInput
            id="days-worked"
            label="Work Days in Pay Period"
            value={daysWorked}
            onChange={setDaysWorked}
            min={1}
            max={14}
            step={1}
            suffix="Days"
            placeholder="e.g. 5"
          />
          <div className="grid grid-cols-2 gap-4">
            <NumberSliderInput
              id="hourly-wage"
              label="Hourly Pay Rate"
              value={hourlyWage}
              onChange={setHourlyWage}
              min={5}
              max={150}
              step={1}
              prefix={currencySymbol}
              formattedDisplay={typeof hourlyWage === 'number' ? formatMoney(hourlyWage) : undefined}
              placeholder="e.g. 25"
            />
            <NumberSliderInput
              id="ot-mult"
              label="Overtime Multiplier"
              value={otRateMultiplier}
              onChange={setOtRateMultiplier}
              min={1.0}
              max={2.5}
              step={0.25}
              suffix="x"
              placeholder="e.g. 1.5"
            />
          </div>
        </div>

        {hoursResult ? (
          <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Gross Total Earnings</span>
            <div className="text-5xl font-extrabold text-emerald-600 tracking-tight mt-2">
              {formatMoney(hoursResult.totalGrossPay)}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Total {hoursResult.totalHours} Net Work Hours across {daysWorked || 1} days
            </p>

            <div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-slate-200 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Daily Net</span>
                <span className="text-base font-bold text-slate-900 mt-1 block">{hoursResult.dailyHours} hrs</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Regular Pay</span>
                <span className="text-base font-bold text-slate-900 mt-1 block">{formatMoney(hoursResult.regularPay)}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Overtime Pay</span>
                <span className="text-base font-bold text-amber-600 mt-1 block">{formatMoney(hoursResult.overtimePay)}</span>
              </div>
            </div>
          </div>
        ) : (
          <EmptyStateCard
            icon={Clock}
            title="Enter Shift Hours & Wage"
            subtitle="Specify shift start/end times and your hourly rate to calculate total earnings and overtime pay."
          />
        )}
      </div>
    );
  }

  // 3. GPA CALCULATOR
  if (toolSlug === 'gpa-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-slate-900">Course Grades & Credit Hours</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetGPA}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={handleAddCourse}
                className="text-xs font-bold px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl border border-blue-200 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Course</span>
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-2xs"
              >
                <input
                  type="text"
                  value={course.courseName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCourses((prev) =>
                      prev.map((c) => (c.id === course.id ? { ...c, courseName: val } : c))
                    );
                  }}
                  className="flex-1 text-xs font-medium p-2 border border-slate-200 rounded-lg"
                  placeholder="Course title"
                />
                <div className="w-20">
                  <input
                    type="number"
                    value={course.credits}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : Number(e.target.value);
                      setCourses((prev) =>
                        prev.map((c) => (c.id === course.id ? { ...c, credits: val } : c))
                      );
                    }}
                    min={1}
                    max={10}
                    className="w-full text-xs font-semibold p-2 border border-slate-200 rounded-lg text-center"
                    placeholder="Credits"
                  />
                </div>
                <div className="w-24">
                  <select
                    value={course.letterGrade}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCourses((prev) =>
                        prev.map((c) => (c.id === course.id ? { ...c, letterGrade: val } : c))
                      );
                    }}
                    className="w-full text-xs font-bold p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="">Grade</option>
                    {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCourse(course.id)}
                  disabled={courses.length <= 1}
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors disabled:opacity-30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {gpaResult ? (
          <div className="lg:col-span-5 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cumulative Grade Point Average (GPA)</span>
            <div className="text-6xl font-extrabold text-blue-600 tracking-tight mt-3">
              {gpaResult.gpa}
            </div>
            <div className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              {gpaResult.academicStanding}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-slate-200 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Total Credits</span>
                <span className="text-lg font-bold text-slate-900 mt-1 block">{gpaResult.totalCredits}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Quality Points</span>
                <span className="text-lg font-bold text-slate-900 mt-1 block">{gpaResult.totalQualityPoints}</span>
              </div>
            </div>
          </div>
        ) : (
          <EmptyStateCard
            icon={GraduationCap}
            title="Enter Course Credits & Grades"
            subtitle="Add course credit hours and letter grades to calculate your cumulative GPA and honors status."
          />
        )}
      </div>
    );
  }

  // 4. FINAL GRADE CALCULATOR
  if (toolSlug === 'grade-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-5">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-slate-500">Grade Targets</span>
            <button
              type="button"
              onClick={handleResetGrade}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-100"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
          <NumberSliderInput
            id="grade-current"
            label="Current Grade in Class (%)"
            value={currentGrade}
            onChange={setCurrentGrade}
            min={0}
            max={100}
            step={0.5}
            suffix="%"
            placeholder="e.g. 82"
          />
          <NumberSliderInput
            id="grade-target"
            label="Target Desired Final Grade (%)"
            value={targetGrade}
            onChange={setTargetGrade}
            min={50}
            max={100}
            step={0.5}
            suffix="%"
            placeholder="e.g. 85"
          />
          <NumberSliderInput
            id="grade-weight"
            label="Final Exam Weight Worth (%)"
            value={finalWeight}
            onChange={setFinalWeight}
            min={5}
            max={70}
            step={1}
            suffix="%"
            placeholder="e.g. 30"
          />
        </div>

        {finalGradeResult ? (
          <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Required Score on Final Exam</span>
            <div
              className={`text-5xl font-extrabold tracking-tight mt-2 ${
                finalGradeResult.isPossible ? 'text-blue-600' : 'text-rose-600'
              }`}
            >
              {finalGradeResult.requiredExamScorePercent}%
            </div>

            <div
              className={`mt-4 p-3 rounded-xl border text-xs font-semibold ${
                finalGradeResult.isPossible
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {finalGradeResult.statusMessage}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 text-xs text-slate-600 text-left">
              <span className="font-bold text-slate-900 block mb-1">Formula Applied:</span>
              <code className="bg-white p-2 rounded border border-slate-200 block text-center font-mono">
                Required = (Target - (Current × (1 - Weight))) / Weight
              </code>
            </div>
          </div>
        ) : (
          <EmptyStateCard
            icon={GraduationCap}
            title="Enter Grade Goals & Exam Weight"
            subtitle="Enter your current class grade, desired final grade, and final exam weight to calculate what score you need."
          />
        )}
      </div>
    );
  }

  // 5. PASSWORD GENERATOR
  if (toolSlug === 'password-generator') {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        {/* Output Password Box */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-md flex items-center justify-between gap-3">
          <span className="font-mono text-lg sm:text-xl font-bold tracking-wider break-all select-all">
            {passwordData.password}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleResetPassword}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Reset to default settings"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setRefreshTrigger((t) => t + 1)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Regenerate password"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCopyPassword}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              {copiedPw ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedPw ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Strength Meter */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Entropy & Strength</span>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              {passwordData.strength} ({passwordData.entropyBits} bits)
            </span>
          </div>

          <NumberSliderInput
            id="pw-len"
            label="Password Length"
            value={pwLength}
            onChange={setPwLength}
            min={8}
            max={64}
            step={1}
            suffix="chars"
          />

          <div className="grid grid-cols-2 gap-3 pt-2">
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={pwUpper}
                onChange={(e) => setPwUpper(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600"
              />
              <span className="text-xs font-semibold text-slate-800">Uppercase (A-Z)</span>
            </label>
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={pwLower}
                onChange={(e) => setPwLower(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600"
              />
              <span className="text-xs font-semibold text-slate-800">Lowercase (a-z)</span>
            </label>
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={pwNumbers}
                onChange={(e) => setPwNumbers(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600"
              />
              <span className="text-xs font-semibold text-slate-800">Numbers (0-9)</span>
            </label>
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={pwSymbols}
                onChange={(e) => setPwSymbols(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600"
              />
              <span className="text-xs font-semibold text-slate-800">Symbols (!@#$%^&*)</span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  // 6. IP SUBNET CALCULATOR
  if (toolSlug === 'subnet-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-5">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-slate-500">Subnet Parameters</span>
            <button
              type="button"
              onClick={handleResetSubnet}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-100"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">IPv4 Host Address</label>
            <input
              type="text"
              value={subnetIp}
              onChange={(e) => setSubnetIp(e.target.value)}
              className="w-full text-base font-mono font-semibold p-3 rounded-xl border border-slate-200 bg-white"
              placeholder="e.g. 192.168.1.1"
            />
          </div>
          <NumberSliderInput
            id="subnet-cidr"
            label="CIDR Subnet Prefix Length (Bitmask)"
            value={subnetCidr}
            onChange={setSubnetCidr}
            min={8}
            max={30}
            step={1}
            prefix="/"
            placeholder="e.g. 24"
          />
        </div>

        {subnetResult ? (
          <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7">
            <div className="text-center pb-5 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Usable Host IP Range</span>
              <div className="text-xl sm:text-2xl font-mono font-extrabold text-blue-600 mt-1">
                {subnetResult.usableHostRange}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {subnetResult.usableHostsCount != null ? subnetResult.usableHostsCount.toLocaleString() : '0'} Usable Host Addresses
              </p>
            </div>

            <div className="space-y-2 mt-5 text-xs">
              <div className="flex justify-between p-2.5 bg-white rounded-xl border border-slate-200 font-mono">
                <span className="text-slate-500">Subnet Netmask:</span>
                <span className="font-bold text-slate-900">{subnetResult.netmask}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-white rounded-xl border border-slate-200 font-mono">
                <span className="text-slate-500">Network ID Address:</span>
                <span className="font-bold text-slate-900">{subnetResult.networkAddress}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-white rounded-xl border border-slate-200 font-mono">
                <span className="text-slate-500">Directed Broadcast Address:</span>
                <span className="font-bold text-slate-900">{subnetResult.broadcastAddress}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-white rounded-xl border border-slate-200 font-mono">
                <span className="text-slate-500">Total Addresses in Subnet:</span>
                <span className="font-bold text-slate-900">{subnetResult.totalAddresses != null ? subnetResult.totalAddresses.toLocaleString() : '0'}</span>
              </div>
            </div>
          </div>
        ) : (
          <EmptyStateCard
            icon={Network}
            title="Enter IPv4 Address & Prefix"
            subtitle="Enter a valid host IPv4 address and CIDR prefix length (e.g. /24) to calculate subnet masks, network, and broadcast ranges."
          />
        )}
      </div>
    );
  }

  // ==========================================
  // TRAVEL BUDGET CALCULATOR
  // ==========================================
  if (toolSlug === 'travel-budget-calculator') {
    return <TravelBudgetCalculatorView />;
  }

  return null;
};

const TravelBudgetCalculatorView: React.FC = () => {
  const { formatMoney, currencySymbol } = useSettings();
  const [days, setDays] = useState<number | ''>('');
  const [travelers, setTravelers] = useState<number | ''>('');
  const [flights, setFlights] = useState<number | ''>('');
  const [lodging, setLodging] = useState<number | ''>('');
  const [food, setFood] = useState<number | ''>('');
  const [activities, setActivities] = useState<number | ''>('');
  const [localTransport, setLocalTransport] = useState<number | ''>('');
  const [contingency, setContingency] = useState<number | ''>('');

  const budget = useMemo(() => {
    if (typeof days !== 'number' || days <= 0) {
      return null;
    }
    return calculateTravelBudget({
      days,
      travelers: typeof travelers === 'number' && travelers > 0 ? travelers : 1,
      flightsTransit: typeof flights === 'number' ? flights : 0,
      lodgingPerNight: typeof lodging === 'number' ? lodging : 0,
      foodPerDayPerPerson: typeof food === 'number' ? food : 0,
      activitiesPerDayPerPerson: typeof activities === 'number' ? activities : 0,
      localTransport: typeof localTransport === 'number' ? localTransport : 0,
      contingencyPercent: typeof contingency === 'number' ? contingency : 10,
    });
  }, [days, travelers, flights, lodging, food, activities, localTransport, contingency]);

  const handleResetTravel = () => {
    setDays('');
    setTravelers('');
    setFlights('');
    setLodging('');
    setFood('');
    setActivities('');
    setLocalTransport('');
    setContingency('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7 space-y-6">
        <div className="flex justify-between items-center">
          <div className="p-3 bg-teal-50/60 border border-teal-200/70 rounded-2xl flex items-center gap-3 text-sm text-teal-900 flex-1 mr-3">
            <Plane className="w-5 h-5 text-teal-600 shrink-0" />
            <span className="text-xs sm:text-sm">
              Estimate comprehensive trip expenses for flights, accommodations, dining, activities, and safety buffer.
            </span>
          </div>
          <button
            type="button"
            onClick={handleResetTravel}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 shrink-0 shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberSliderInput
            id="travel-days"
            label="Trip Duration (Days)"
            value={days}
            onChange={setDays}
            min={1}
            max={60}
            step={1}
            suffix="days"
            placeholder="e.g. 7"
          />
          <NumberSliderInput
            id="travel-travelers"
            label="Number of Travelers"
            value={travelers}
            onChange={setTravelers}
            min={1}
            max={20}
            step={1}
            suffix="people"
            placeholder="e.g. 2"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberSliderInput
            id="travel-flights"
            label="Flights / Primary Transit"
            value={flights}
            onChange={setFlights}
            min={0}
            max={10000}
            step={25}
            prefix={currencySymbol}
            placeholder="e.g. 500"
          />
          <NumberSliderInput
            id="travel-lodging"
            label="Accommodation (per Night)"
            value={lodging}
            onChange={setLodging}
            min={0}
            max={2000}
            step={10}
            prefix={currencySymbol}
            placeholder="e.g. 120"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberSliderInput
            id="travel-food"
            label="Food & Dining (per Day/Person)"
            value={food}
            onChange={setFood}
            min={0}
            max={500}
            step={5}
            prefix={currencySymbol}
            placeholder="e.g. 45"
          />
          <NumberSliderInput
            id="travel-activities"
            label="Activities & Tours (per Day/Person)"
            value={activities}
            onChange={setActivities}
            min={0}
            max={500}
            step={5}
            prefix={currencySymbol}
            placeholder="e.g. 30"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberSliderInput
            id="travel-local-transport"
            label="Local Cabs / Transit / Car Rental"
            value={localTransport}
            onChange={setLocalTransport}
            min={0}
            max={2000}
            step={10}
            prefix={currencySymbol}
            placeholder="e.g. 100"
          />
          <NumberSliderInput
            id="travel-contingency"
            label="Emergency Safety Buffer"
            value={contingency}
            onChange={setContingency}
            min={0}
            max={30}
            step={1}
            suffix="%"
            placeholder="e.g. 10"
          />
        </div>
      </div>

      {budget ? (
        <div className="lg:col-span-5 bg-gradient-to-b from-teal-50/50 to-white p-6 rounded-3xl border border-teal-100 shadow-sm space-y-5">
          <div className="text-center pb-4 border-b border-teal-100/60">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Estimated Total Trip Cost</span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
              {formatMoney(budget.totalBudget)}
            </div>
            <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-600 mt-2">
              <span>{formatMoney(budget.costPerPerson)} / person</span>
              <span>•</span>
              <span>{formatMoney(budget.costPerDay)} / day</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-600 flex items-center gap-2">
                <Plane className="w-3.5 h-3.5 text-teal-600" /> Flights & Long-Distance Transit
              </span>
              <span className="font-bold text-slate-900">{formatMoney(budget.flightsTotal)}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-600 flex items-center gap-2">
                <Bed className="w-3.5 h-3.5 text-blue-600" /> Lodging ({Math.max(0, (typeof days === 'number' ? days : 1) - 1)} nights)
              </span>
              <span className="font-bold text-slate-900">{formatMoney(budget.lodgingTotal)}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-600 flex items-center gap-2">
                <Utensils className="w-3.5 h-3.5 text-amber-600" /> Food & Dining ({days} days)
              </span>
              <span className="font-bold text-slate-900">{formatMoney(budget.foodTotal)}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-600 flex items-center gap-2">
                <Ticket className="w-3.5 h-3.5 text-purple-600" /> Activities & Sightseeing
              </span>
              <span className="font-bold text-slate-900">{formatMoney(budget.activitiesTotal)}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-600 flex items-center gap-2">
                <Wallet className="w-3.5 h-3.5 text-slate-600" /> Local Transport
              </span>
              <span className="font-bold text-slate-900">{formatMoney(budget.localTransportTotal)}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-600 flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[9px] font-bold">+</span>
                Emergency Buffer ({contingency || 0}%)
              </span>
              <span className="font-bold text-emerald-700">{formatMoney(budget.contingencyTotal)}</span>
            </div>
          </div>
        </div>
      ) : (
        <EmptyStateCard
          icon={Plane}
          title="Enter Trip Duration & Costs"
          subtitle="Specify your trip duration, travelers, transit, and daily allowances to calculate total and per-person travel budgets."
        />
      )}
    </div>
  );
};
