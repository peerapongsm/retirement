/**
 * Thai Tax & Compliance Engine
 * References: Revenue Code, Social Security Act B.E. 2533
 * Rates current as of 2025 tax year
 */

const PIT_BRACKETS = [
  { min: 0,         max: 150_000,   rate: 0.00 },
  { min: 150_000,   max: 300_000,   rate: 0.05 },
  { min: 300_000,   max: 500_000,   rate: 0.10 },
  { min: 500_000,   max: 750_000,   rate: 0.15 },
  { min: 750_000,   max: 1_000_000, rate: 0.20 },
  { min: 1_000_000, max: 2_000_000, rate: 0.25 },
  { min: 2_000_000, max: 5_000_000, rate: 0.30 },
  { min: 5_000_000, max: Infinity,  rate: 0.35 },
]

const SSO_RATE        = 0.05
const SSO_SALARY_CAP  = 15_000   // THB/month — contribution caps at this salary
const SSO_MONTHLY_MAX = 750      // THB/month

const EMPLOYMENT_DEDUCTION_RATE = 0.50
const EMPLOYMENT_DEDUCTION_MAX  = 100_000  // THB/year
const PERSONAL_ALLOWANCE        = 60_000   // THB/year
const PVD_DEDUCTION_MAX         = 500_000  // THB/year (combined LTF/RMF/PVD ceiling)

/** Progressive tax on taxable income */
function calcProgressiveTax(taxableIncome) {
  if (taxableIncome <= 0) return 0
  let tax = 0
  for (const bracket of PIT_BRACKETS) {
    if (taxableIncome <= bracket.min) break
    const portion = Math.min(taxableIncome, bracket.max) - bracket.min
    tax += portion * bracket.rate
  }
  return tax
}

/**
 * Full monthly deduction breakdown for a given gross salary and PVD %.
 *
 * @param {number} monthlyGross  THB/month
 * @param {number} pvdPct        Employee PVD contribution rate (0.03–0.15)
 * @returns {{
 *   sso: number,
 *   pvdEmployee: number,
 *   monthlyTax: number,
 *   annualTax: number,
 *   taxableIncome: number,
 *   netMonthly: number,
 *   effectiveTaxRate: number
 * }}
 */
export function calcMonthlyDeductions(monthlyGross, pvdPct) {
  // SSO: 5% of salary capped at 750 THB/month
  const sso = Math.min(monthlyGross * SSO_RATE, SSO_MONTHLY_MAX)

  // PVD employee contribution
  const pvdEmployee = monthlyGross * pvdPct

  // Annualise for PIT calculation
  const annualGross = monthlyGross * 12

  // PIT deductions
  const employmentDeduction = Math.min(annualGross * EMPLOYMENT_DEDUCTION_RATE, EMPLOYMENT_DEDUCTION_MAX)
  const annualSSO           = sso * 12
  const annualPVD           = Math.min(pvdEmployee * 12, PVD_DEDUCTION_MAX)

  const taxableIncome = Math.max(
    0,
    annualGross - employmentDeduction - PERSONAL_ALLOWANCE - annualSSO - annualPVD
  )

  const annualTax  = calcProgressiveTax(taxableIncome)
  const monthlyTax = annualTax / 12

  const netMonthly = monthlyGross - sso - pvdEmployee - monthlyTax
  const effectiveTaxRate = annualGross > 0 ? annualTax / annualGross : 0

  return {
    sso,
    pvdEmployee,
    monthlyTax,
    annualTax,
    taxableIncome,
    netMonthly,
    effectiveTaxRate,
  }
}

export { SSO_MONTHLY_MAX, SSO_SALARY_CAP, PVD_DEDUCTION_MAX, PERSONAL_ALLOWANCE }
