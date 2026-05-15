# Prompt: Thai Retirement Planner Multi-Agent Team

This prompt is designed for **Claude Code** or similar LLM-based coding agents to architect and execute a full-stack web application tailored for the Thai market.

## The Prompt

> **Role:** You are a Lead Software Architect.
>
> **Objective:** Initialize a multi-agent development team to build a "Thai Retirement Planner" web application. The tool must help Thai users calculate their net take-home pay and project long-term wealth across different asset classes over a 30-year horizon.
>
> **Agent Requirements:**
> 1. **Tax & Compliance Agent:** Responsible for the logic regarding Thai Personal Income Tax (progressive rates), Social Security (SSO) caps, and Provident Fund (PVD) deduction rules.
> 2. **Financial Engine Agent:** Responsible for compound interest calculations and projection logic for SET50, Gold, and S&P500.
> 3. **Frontend/UX Agent:** Responsible for a clean, professional React/Tailwind interface featuring interactive charts.
>
> **Technical Specifications:**
> * **Inputs:** Monthly Gross Salary, PVD Contribution % (3–15%).
> * **Immediate Calculations (Monthly):**
>     * Deduct SSO (750 THB cap based on current mandate).
>     * Deduct PVD.
>     * Deduct estimated Thai Personal Income Tax (Progressive brackets: 0% to 35%).
>     * **Output:** Final Monthly Spending Power.
> * **Projection Logic (30 Years):** Compare four scenarios starting from 0 THB:
>     1. **Cash/Savings:** (Estimated 1.5% CAGR).
>     2. **SET50:** (Historical Thai Market average).
>     3. **Gold:** (Global historical average).
>     4. **S&P500:** (Global Equity average).
> * **Stack:** React, Vite, Tailwind CSS, and Recharts for visualization.
>
> **Execution Steps:**
> 1. Create the directory structure.
> 2. Write `taxEngine.js` with current Thai tax brackets.
> 3. Develop the calculation hooks for the 30-year projections using the Future Value formula.
> 4. Build the UI with a slider for income and a multi-line chart for comparison.
>
> **Output:** Ensure the code is production-ready, modular, and includes clear Thai/English labels.

---

## Implementation Details

### 1. Architectural Options
Depending on the desired complexity, consider these two paths:

| Feature | Option A: Single-Page Tool | Option B: Modular Micro-App |
| :--- | :--- | :--- |
| **Logic Placement** | All calculations in a custom React hook. | Separate 'Service' files for Tax and Finance. |
| **Data Handling** | State-based (no database). | LocalStorage to save user progress. |
| **UI Focus** | High-density dashboard. | Step-by-step "Wizard" flow. |

### 2. Core Financial Logic
The agents will implement the Future Value (FV) formula for monthly contributions:

$$FV = PMT 	imes rac{(1 + r)^n - 1}{r}$$

**Variables:**
* **PMT:** Monthly investment amount.
* **r:** Monthly interest rate (Annual Rate / 12).
* **n:** Total number of months (360).
