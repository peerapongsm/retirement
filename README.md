# Planner — Thai Retirement Planner

วางแผนเกษียณ · คำนวณภาษี · เปรียบเทียบผลตอบแทน

A client-side retirement planning tool for Thai employees. Calculates take-home pay, tax, SSO, and PVD deductions under Thai tax law (2025), then projects 30-year wealth accumulation across multiple savings rates and asset classes.

## Features

- **Tax calculator** — Progressive PIT (2025 brackets), SSO (capped ฿750/mo), PVD deduction
- **PVD projection** — 30-year provident fund growth at low (2%), medium (5%), and high (10%) risk
- **Savings rate projection** — How much 10–30% of net income accumulates at 8% p.a.
- **Asset class comparison** — Invest n% in Cash/Savings (1.5%), Gold (7%), SET50 (8%), or S&P 500 (10%)

## Tech Stack

- React 18 + Vite
- Recharts
- Tailwind CSS

## Local Development

```bash
npm install
npm run dev
```

## Deploy

Push to `main` — GitHub Actions builds and deploys to the `gh-pages` branch automatically.

Enable GitHub Pages in repo **Settings → Pages → Source: Deploy from a branch → `gh-pages` / `/ (root)`**.

## Disclaimer

เพื่อการศึกษาเท่านั้น — ไม่ใช่คำแนะนำทางการเงิน · For educational purposes only. Past returns do not guarantee future results.
