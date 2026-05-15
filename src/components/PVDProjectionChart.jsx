import { useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { PVD_RISK_LEVELS, buildPVDProjection, formatTHB, formatMillions } from '../engines/financeEngine'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-900 border border-slate-600 rounded-xl p-3 shadow-xl text-sm min-w-[260px]">
      <p className="font-semibold text-slate-300 mb-2">ปีที่ {label} / Year {label}</p>
      {payload.map((entry) => {
        const rl = PVD_RISK_LEVELS.find((r) => r.id === entry.dataKey)
        return (
          <div key={entry.dataKey} className="flex justify-between gap-4">
            <span style={{ color: entry.color }}>
              {rl?.labelTH ?? entry.dataKey} ({((rl?.annualRate ?? 0) * 100).toFixed(0)}%)
            </span>
            <span className="font-bold text-white">{formatMillions(entry.value)}</span>
          </div>
        )
      })}
    </div>
  )
}

function yAxisFormatter(value) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000)     return `${(value / 1_000).toFixed(0)}K`
  return value
}

export default function PVDProjectionChart({ pvdMonthlyTotal, pvdEmployee, pvdCompanyAmt }) {
  const series = useMemo(
    () => buildPVDProjection(pvdMonthlyTotal, 30),
    [pvdMonthlyTotal]
  )
  const at30 = series[series.length - 1] ?? {}

  return (
    <div className="card space-y-4">
      <div className="flex flex-wrap gap-2 items-baseline justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            กองทุนสำรองเลี้ยงชีพ (PVD) / Provident Fund Projection
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            สมทบรวม {formatTHB(pvdMonthlyTotal)}/เดือน
            (ลูกจ้าง {formatTHB(pvdEmployee)} + นายจ้าง {formatTHB(pvdCompanyAmt)}) · 30 ปี
          </p>
        </div>
        <span className="text-xs bg-amber-900/40 text-amber-300 border border-amber-700 px-3 py-1 rounded-full">
          PVD Projection
        </span>
      </div>

      {/* Risk level callout cards at year 30 */}
      <div className="grid grid-cols-3 gap-3">
        {PVD_RISK_LEVELS.map((rl) => (
          <div
            key={rl.id}
            className="bg-slate-700/50 rounded-xl p-3 border border-slate-600"
          >
            <div className="text-xs font-semibold" style={{ color: rl.color }}>{rl.labelTH}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{rl.description}</div>
            <div className="font-bold text-lg mt-2" style={{ color: rl.color }}>
              {formatMillions(at30[rl.id] ?? 0)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">ใน 30 ปี</div>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={series} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="year"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickLine={false}
            label={{ value: 'ปี / Year', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 11 }}
          />
          <YAxis
            tickFormatter={yAxisFormatter}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => {
              const rl = PVD_RISK_LEVELS.find((r) => r.id === value)
              return (
                <span style={{ color: '#cbd5e1', fontSize: 12 }}>
                  {rl?.labelTH ?? value} ({((rl?.annualRate ?? 0) * 100).toFixed(0)}% p.a.)
                </span>
              )
            }}
          />
          {PVD_RISK_LEVELS.map((rl) => (
            <Line
              key={rl.id}
              type="monotone"
              dataKey={rl.id}
              stroke={rl.color}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <p className="text-xs text-slate-500">
        * เริ่มต้นจาก ฿0 · ไม่รวมภาษี/เงินเฟ้อ · ผลตอบแทนในอดีตไม่รับประกันอนาคต
      </p>
    </div>
  )
}
