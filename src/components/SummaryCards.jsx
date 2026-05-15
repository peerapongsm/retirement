import { formatTHB } from '../engines/financeEngine'

function Card({ labelTH, labelEN, value, color = 'text-white', subtext }) {
  return (
    <div className="card flex flex-col gap-1">
      <span className="label-th">{labelTH}</span>
      <span className="text-[10px] text-slate-500">{labelEN}</span>
      <span className={`value-primary ${color}`}>{formatTHB(value)}</span>
      {subtext && <span className="text-xs text-slate-500 mt-0.5">{subtext}</span>}
    </div>
  )
}

export default function SummaryCards({ deductions, pvdCompanyAmt }) {
  const {
    sso,
    pvdEmployee,
    monthlyTax,
    annualTax,
    taxableIncome,
    netMonthly,
    effectiveTaxRate,
  } = deductions

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
        รายละเอียดรายเดือน / Monthly Breakdown
      </h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Card
          labelTH="กองทุนสังคม (SSO)"
          labelEN="Social Security"
          value={sso}
          color="text-orange-400"
          subtext="หัก / deducted"
        />
        <Card
          labelTH="PVD ลูกจ้าง"
          labelEN="Employee PVD"
          value={pvdEmployee}
          color="text-amber-400"
          subtext="หัก / deducted"
        />
        <Card
          labelTH="PVD นายจ้าง"
          labelEN="Employer PVD"
          value={pvdCompanyAmt}
          color="text-emerald-400"
          subtext="นายจ้างสมทบ / employer match"
        />
        <Card
          labelTH="ภาษีเงินได้"
          labelEN="Income Tax"
          value={monthlyTax}
          color="text-red-400"
          subtext={`อัตราจริง ${(effectiveTaxRate * 100).toFixed(2)}%`}
        />
        <Card
          labelTH="รวม PVD / เดือน"
          labelEN="Total PVD"
          value={pvdEmployee + pvdCompanyAmt}
          color="text-yellow-400"
          subtext="ลูกจ้าง + นายจ้าง"
        />
        <Card
          labelTH="เงินใช้จ่ายสุทธิ"
          labelEN="Net Take-Home"
          value={netMonthly}
          color="text-blue-400"
          subtext="ต่อเดือน / month"
        />
      </div>

      {/* Tax detail strip */}
      <div className="card flex flex-wrap gap-4 text-sm">
        <div>
          <span className="text-slate-400">รายได้สุทธิ (ฐานภาษี): </span>
          <span className="text-white font-medium">{formatTHB(taxableIncome)}</span>
          <span className="text-slate-500 text-xs">/ปี</span>
        </div>
        <div>
          <span className="text-slate-400">ภาษีรายปี: </span>
          <span className="text-red-400 font-medium">{formatTHB(annualTax)}</span>
        </div>
        <div>
          <span className="text-slate-400">อัตราภาษีที่แท้จริง: </span>
          <span className="text-white font-medium">{(effectiveTaxRate * 100).toFixed(2)}%</span>
        </div>
      </div>
    </div>
  )
}
