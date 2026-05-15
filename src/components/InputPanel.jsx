import { formatTHB } from '../engines/financeEngine'

const SALARY_MIN = 15_000
const SALARY_MAX = 500_000

function NumericField({ label, value, min, max, step, unit, displayValue, displayColor, onChange, onBlur, sliderMin, sliderMax }) {
  return (
    <div className="space-y-2">
      <label className="label-th">{label}</label>
      <div className="flex gap-2 items-center">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={onChange}
          onBlur={onBlur}
          className="w-28 bg-slate-800 border border-slate-600 focus:border-blue-500 focus:outline-none text-white px-3 py-1.5 rounded-lg text-sm font-mono"
        />
        <span className="text-slate-400 text-xs">{unit}</span>
        {displayValue != null && (
          <span className={`text-sm font-semibold ml-auto ${displayColor ?? 'text-blue-400'}`}>
            {displayValue}
          </span>
        )}
      </div>
      <input
        type="range"
        min={sliderMin ?? min}
        max={sliderMax ?? max}
        step={step}
        value={Math.max(sliderMin ?? min, Math.min(sliderMax ?? max, value))}
        onChange={onChange}
        className="w-full h-2 rounded-full cursor-pointer"
      />
      <div className="flex justify-between text-xs text-slate-500">
        <span>{sliderMin != null ? sliderMin : min}{unit === '%' ? '%' : ''}</span>
        <span>{sliderMax != null ? sliderMax : max}{unit === '%' ? '%' : ''}</span>
      </div>
    </div>
  )
}

export default function InputPanel({ salary, pvdPct, pvdCompanyPct, onSalaryChange, onPvdChange, onPvdCompanyChange }) {
  const pvdEmployeeAmt = salary * pvdPct
  const pvdCompanyAmt  = salary * pvdCompanyPct

  return (
    <div className="card space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">ข้อมูลรายได้ / Income</h2>
        <p className="text-xs text-slate-400 mt-0.5">พิมพ์หรือเลื่อนแถบเพื่อปรับค่า</p>
      </div>

      {/* Salary */}
      <NumericField
        label="เงินเดือนรวม / Monthly Gross Salary"
        value={salary}
        min={SALARY_MIN}
        max={SALARY_MAX}
        step={1000}
        unit="฿/เดือน"
        displayValue={formatTHB(salary)}
        displayColor="text-blue-400"
        onChange={(e) => {
          const v = Number(e.target.value)
          if (!isNaN(v) && v > 0) onSalaryChange(v)
        }}
        onBlur={() => onSalaryChange(Math.max(SALARY_MIN, Math.min(SALARY_MAX, salary)))}
        sliderMin={SALARY_MIN}
        sliderMax={SALARY_MAX}
      />

      {/* PVD Employee */}
      <div className="space-y-2">
        <label className="label-th">PVD ลูกจ้าง / Employee Provident Fund</label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={Math.round(pvdPct * 100)}
            min={3}
            max={15}
            step={1}
            onChange={(e) => {
              const v = Number(e.target.value)
              if (!isNaN(v) && v > 0 && v <= 15) onPvdChange(v / 100)
            }}
            onBlur={() => onPvdChange(Math.max(0.03, Math.min(0.15, pvdPct)))}
            className="w-20 bg-slate-800 border border-slate-600 focus:border-blue-500 focus:outline-none text-white px-3 py-1.5 rounded-lg text-sm font-mono"
          />
          <span className="text-slate-400 text-xs">%</span>
          <span className="text-amber-400 text-sm font-semibold ml-auto">{formatTHB(pvdEmployeeAmt)}</span>
        </div>
        <input
          type="range"
          min={3}
          max={15}
          step={1}
          value={Math.round(pvdPct * 100)}
          onChange={(e) => onPvdChange(Number(e.target.value) / 100)}
          className="w-full h-2 rounded-full cursor-pointer"
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>3% (ขั้นต่ำ)</span>
          <span>15% (สูงสุด)</span>
        </div>
      </div>

      {/* PVD Company */}
      <div className="space-y-2">
        <label className="label-th">PVD นายจ้าง / Employer Provident Fund</label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={Math.round(pvdCompanyPct * 100)}
            min={0}
            max={15}
            step={1}
            onChange={(e) => {
              const v = Number(e.target.value)
              if (!isNaN(v) && v >= 0 && v <= 15) onPvdCompanyChange(v / 100)
            }}
            onBlur={() => onPvdCompanyChange(Math.max(0, Math.min(0.15, pvdCompanyPct)))}
            className="w-20 bg-slate-800 border border-slate-600 focus:border-blue-500 focus:outline-none text-white px-3 py-1.5 rounded-lg text-sm font-mono"
          />
          <span className="text-slate-400 text-xs">%</span>
          <span className="text-emerald-400 text-sm font-semibold ml-auto">{formatTHB(pvdCompanyAmt)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={15}
          step={1}
          value={Math.round(pvdCompanyPct * 100)}
          onChange={(e) => onPvdCompanyChange(Number(e.target.value) / 100)}
          className="w-full h-2 rounded-full cursor-pointer"
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>0%</span>
          <span>15% (สูงสุด)</span>
        </div>
      </div>

      {/* PVD Summary */}
      <div className="bg-slate-700/50 rounded-xl p-3 text-sm space-y-1.5">
        <div className="flex justify-between">
          <span className="text-slate-400">รวม PVD / เดือน (ลูกจ้าง + นายจ้าง)</span>
          <span className="text-amber-400 font-semibold">{formatTHB(pvdEmployeeAmt + pvdCompanyAmt)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">รวม PVD / ปี</span>
          <span className="text-amber-400 font-semibold">{formatTHB((pvdEmployeeAmt + pvdCompanyAmt) * 12)}</span>
        </div>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-700 pt-4">
        * คำนวณตามอัตราภาษีเงินได้บุคคลธรรมดาปี 2568 และเพดาน SSO 750 บาท/เดือน
        ไม่รวมค่าลดหย่อนพิเศษอื่นๆ (ประกันชีวิต, RMF, SSF)
      </p>
    </div>
  )
}
