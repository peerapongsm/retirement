import { useState, useMemo } from 'react'
import { calcMonthlyDeductions } from './engines/taxEngine'
import { buildSavingsRateProjection } from './engines/financeEngine'
import InputPanel from './components/InputPanel'
import SummaryCards from './components/SummaryCards'
import ProjectionChart from './components/ProjectionChart'
import PVDProjectionChart from './components/PVDProjectionChart'

const DEFAULT_SALARY         = 50_000
const DEFAULT_PVD_PCT        = 0.05
const DEFAULT_PVD_COMPANY_PCT = 0.05

export default function App() {
  const [salary,         setSalary]         = useState(DEFAULT_SALARY)
  const [pvdPct,         setPvdPct]         = useState(DEFAULT_PVD_PCT)
  const [pvdCompanyPct,  setPvdCompanyPct]  = useState(DEFAULT_PVD_COMPANY_PCT)

  const deductions = useMemo(
    () => calcMonthlyDeductions(salary, pvdPct),
    [salary, pvdPct]
  )

  const pvdCompanyAmt = salary * pvdCompanyPct

  const projectionSeries = useMemo(
    () => buildSavingsRateProjection(deductions.netMonthly, 30),
    [deductions.netMonthly]
  )

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Planner
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              วางแผนเกษียณ · คำนวณภาษี · เปรียบเทียบผลตอบแทน
            </p>
          </div>
          <span className="text-xs bg-blue-900/50 text-blue-300 border border-blue-700 px-3 py-1 rounded-full">
            ภาษีปี 2568 / Tax Year 2025
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <InputPanel
              salary={salary}
              pvdPct={pvdPct}
              pvdCompanyPct={pvdCompanyPct}
              onSalaryChange={setSalary}
              onPvdChange={setPvdPct}
              onPvdCompanyChange={setPvdCompanyPct}
            />
          </div>
          <div className="lg:col-span-2">
            <SummaryCards deductions={deductions} pvdCompanyAmt={pvdCompanyAmt} />
          </div>
        </div>

        <ProjectionChart series={projectionSeries} netMonthly={deductions.netMonthly} />

        <PVDProjectionChart
          pvdMonthlyTotal={deductions.pvdEmployee + pvdCompanyAmt}
          pvdEmployee={deductions.pvdEmployee}
          pvdCompanyAmt={pvdCompanyAmt}
        />

        <footer className="text-center text-xs text-slate-600 pb-4">
          เพื่อการศึกษาเท่านั้น — ไม่ใช่คำแนะนำทางการเงิน · For educational purposes only.
          อัตราผลตอบแทนในอดีตไม่รับประกันอนาคต.
        </footer>
      </main>
    </div>
  )
}
