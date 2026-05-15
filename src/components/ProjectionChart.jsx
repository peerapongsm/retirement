import { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  SAVINGS_RATES,
  ASSET_CLASSES,
  PROJECTION_ANNUAL_RATE,
  buildAssetClassProjection,
  formatTHB,
  formatMillions,
} from '../engines/financeEngine'

function SavingsTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-900 border border-slate-600 rounded-xl p-3 shadow-xl text-sm min-w-[220px]">
      <p className="font-semibold text-slate-300 mb-2">ปีที่ {label} / Year {label}</p>
      {payload.map((entry) => {
        const sr = SAVINGS_RATES.find((s) => s.id === entry.dataKey)
        return (
          <div key={entry.dataKey} className="flex justify-between gap-4">
            <span style={{ color: entry.color }}>ออม {sr?.label ?? entry.dataKey}</span>
            <span className="font-bold text-white">{formatMillions(entry.value)}</span>
          </div>
        )
      })}
    </div>
  )
}

function AssetTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-900 border border-slate-600 rounded-xl p-3 shadow-xl text-sm min-w-[240px]">
      <p className="font-semibold text-slate-300 mb-2">ปีที่ {label} / Year {label}</p>
      {payload.map((entry) => {
        const ac = ASSET_CLASSES.find((a) => a.id === entry.dataKey)
        return (
          <div key={entry.dataKey} className="flex justify-between gap-4">
            <span style={{ color: entry.color }}>{ac?.labelTH ?? entry.dataKey}</span>
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

export default function ProjectionChart({ series, netMonthly }) {
  const [mode, setMode] = useState('savings')
  const [selectedSrId, setSelectedSrId] = useState('rate20')

  const selectedSr = SAVINGS_RATES.find((sr) => sr.id === selectedSrId) ?? SAVINGS_RATES[2]
  const monthlyAmt = netMonthly * selectedSr.pct

  const assetSeries = useMemo(
    () => buildAssetClassProjection(monthlyAmt, 30),
    [monthlyAmt]
  )

  const at30 = series[series.length - 1] ?? {}
  const at30Asset = assetSeries[assetSeries.length - 1] ?? {}

  return (
    <div className="card space-y-4">
      {/* Header + mode tabs */}
      <div className="flex flex-wrap gap-2 items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            คาดการณ์ 30 ปี / 30-Year Projection
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {mode === 'savings'
              ? `ออมจาก net income ${formatTHB(netMonthly)}/เดือน · อัตราผลตอบแทน ${(PROJECTION_ANNUAL_RATE * 100).toFixed(0)}% p.a.`
              : `ออม ${selectedSr.label} = ${formatTHB(monthlyAmt)}/เดือน · เปรียบเทียบตามประเภทสินทรัพย์`
            }
          </p>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setMode('savings')}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              mode === 'savings'
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
            }`}
          >
            อัตราการออม
          </button>
          <button
            onClick={() => setMode('asset')}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              mode === 'asset'
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
            }`}
          >
            เปรียบเทียบสินทรัพย์
          </button>
        </div>
      </div>

      {mode === 'savings' ? (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {SAVINGS_RATES.map((sr) => (
              <div
                key={sr.id}
                className="bg-slate-700/50 rounded-xl p-3 border border-slate-600"
              >
                <div className="text-xs text-slate-400">ออม {sr.label}</div>
                <div className="font-bold text-base mt-1" style={{ color: sr.color }}>
                  {formatMillions(at30[sr.id] ?? 0)}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {formatTHB(netMonthly * sr.pct)}/เดือน
                </div>
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
              <Tooltip content={<SavingsTooltip />} />
              <Legend
                formatter={(value) => {
                  const sr = SAVINGS_RATES.find((s) => s.id === value)
                  return (
                    <span style={{ color: '#cbd5e1', fontSize: 12 }}>
                      ออม {sr?.label ?? value}
                    </span>
                  )
                }}
              />
              {SAVINGS_RATES.map((sr) => (
                <Line
                  key={sr.id}
                  type="monotone"
                  dataKey={sr.id}
                  stroke={sr.color}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>

          <p className="text-xs text-slate-500">
            * สมมติผลตอบแทน {(PROJECTION_ANNUAL_RATE * 100).toFixed(0)}% ต่อปี (balanced portfolio) ·
            เริ่มต้นจาก ฿0 · ไม่รวมภาษี/เงินเฟ้อ
          </p>
        </>
      ) : (
        <>
          {/* Savings rate selector */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-slate-400">ออมกี่ % ของ net income:</span>
            {SAVINGS_RATES.map((sr) => (
              <button
                key={sr.id}
                onClick={() => setSelectedSrId(sr.id)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  selectedSrId === sr.id
                    ? 'border-blue-500 text-blue-300 bg-blue-900/40'
                    : 'border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                }`}
              >
                {sr.label}
              </button>
            ))}
            <span className="text-xs text-slate-500 ml-1">= {formatTHB(monthlyAmt)}/เดือน</span>
          </div>

          {/* Asset class callout cards at year 30 */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {ASSET_CLASSES.map((ac) => (
              <div
                key={ac.id}
                className="bg-slate-700/50 rounded-xl p-3 border border-slate-600"
              >
                <div className="text-xs font-semibold" style={{ color: ac.color }}>{ac.labelTH}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{ac.description}</div>
                <div className="font-bold text-base mt-2" style={{ color: ac.color }}>
                  {formatMillions(at30Asset[ac.id] ?? 0)}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">ใน 30 ปี</div>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={assetSeries} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
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
              <Tooltip content={<AssetTooltip />} />
              <Legend
                formatter={(value) => {
                  const ac = ASSET_CLASSES.find((a) => a.id === value)
                  return (
                    <span style={{ color: '#cbd5e1', fontSize: 12 }}>
                      {ac?.labelTH ?? value}
                    </span>
                  )
                }}
              />
              {ASSET_CLASSES.map((ac) => (
                <Line
                  key={ac.id}
                  type="monotone"
                  dataKey={ac.id}
                  stroke={ac.color}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>

          <p className="text-xs text-slate-500">
            * เริ่มต้นจาก ฿0 · ไม่รวมภาษี/เงินเฟ้อ · ผลตอบแทนอิงข้อมูลในอดีต ไม่รับประกันอนาคต
          </p>
        </>
      )}
    </div>
  )
}
