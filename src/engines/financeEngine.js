/**
 * Financial Projection Engine
 * FV of annuity: FV = PMT × ((1+r)^n − 1) / r
 */

export const ASSET_CLASSES = [
  {
    id:       'cash',
    labelEN:  'Cash / Savings',
    labelTH:  'เงินฝาก',
    annualRate: 0.015,
    color:    '#64748b',
    description: '1.5% p.a. — Thai savings account',
  },
  {
    id:       'set50',
    labelEN:  'SET50',
    labelTH:  'หุ้นไทย SET50',
    annualRate: 0.08,
    color:    '#f59e0b',
    description: '8% p.a. — Thai equity historical avg.',
  },
  {
    id:       'gold',
    labelEN:  'Gold',
    labelTH:  'ทองคำ',
    annualRate: 0.07,
    color:    '#eab308',
    description: '7% p.a. — global gold historical avg.',
  },
  {
    id:       's&p500',
    labelEN:  'S&P 500',
    labelTH:  'หุ้นสหรัฐ S&P500',
    annualRate: 0.10,
    color:    '#22c55e',
    description: '10% p.a. — US equity historical avg.',
  },
]

export const SAVINGS_RATES = [
  { id: 'rate10', pct: 0.10, label: '10%', color: '#94a3b8' },
  { id: 'rate15', pct: 0.15, label: '15%', color: '#60a5fa' },
  { id: 'rate20', pct: 0.20, label: '20%', color: '#c084fc' },
  { id: 'rate25', pct: 0.25, label: '25%', color: '#fb923c' },
  { id: 'rate30', pct: 0.30, label: '30%', color: '#34d399' },
]

export const PROJECTION_ANNUAL_RATE = 0.08

export const PVD_RISK_LEVELS = [
  {
    id: 'low',
    labelEN: 'Low Risk',
    labelTH: 'ความเสี่ยงต่ำ',
    annualRate: 0.02,
    color: '#60a5fa',
    description: '2% p.a. — ตลาดเงิน / เงินฝากประจำ',
  },
  {
    id: 'medium',
    labelEN: 'Medium Risk',
    labelTH: 'ความเสี่ยงปานกลาง',
    annualRate: 0.05,
    color: '#fb923c',
    description: '5% p.a. — กองทุนผสม',
  },
  {
    id: 'high',
    labelEN: 'High Risk',
    labelTH: 'ความเสี่ยงสูง',
    annualRate: 0.10,
    color: '#f43f5e',
    description: '10% p.a. — กองทุนหุ้น',
  },
]

export function futureValue(pmt, annualRate, years) {
  if (pmt <= 0) return 0
  const r = annualRate / 12
  const n = years * 12
  if (r === 0) return pmt * n
  return pmt * ((Math.pow(1 + r, n) - 1) / r)
}

export function buildPVDProjection(pvdMonthly, horizonYears = 30) {
  const series = []
  for (let y = 1; y <= horizonYears; y++) {
    const row = { year: y }
    for (const rl of PVD_RISK_LEVELS) {
      row[rl.id] = Math.round(futureValue(pvdMonthly, rl.annualRate, y))
    }
    series.push(row)
  }
  return series
}

export function buildAssetClassProjection(monthlyAmt, horizonYears = 30) {
  const series = []
  for (let y = 1; y <= horizonYears; y++) {
    const row = { year: y }
    for (const ac of ASSET_CLASSES) {
      row[ac.id] = Math.round(futureValue(monthlyAmt, ac.annualRate, y))
    }
    series.push(row)
  }
  return series
}

export function buildSavingsRateProjection(netMonthly, horizonYears = 30) {
  const series = []
  for (let y = 1; y <= horizonYears; y++) {
    const row = { year: y }
    for (const sr of SAVINGS_RATES) {
      row[sr.id] = Math.round(futureValue(netMonthly * sr.pct, PROJECTION_ANNUAL_RATE, y))
    }
    series.push(row)
  }
  return series
}

/** Format THB with appropriate suffix (ล้าน / แสน) */
export function formatTHB(value, compact = false) {
  if (compact) {
    if (value >= 1_000_000) return `฿${(value / 1_000_000).toFixed(2)}M`
    if (value >= 100_000)   return `฿${(value / 1_000).toFixed(0)}K`
    return `฿${value.toFixed(0)}`
  }
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatMillions(value) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)} ล้าน`
  }
  return formatTHB(value)
}
