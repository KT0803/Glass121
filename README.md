# AmalGus — India's First Smart Glass Marketplace

A complete B2B2C single-page React application for discovering, customising, and ordering glass & allied products across India.

## Features

- **Smart Glass Finder** — Rule-based AI matching engine (no backend needed). Describe your requirement in plain language and get instant recommendations. Gibberish/unrecognised queries show a helpful "no match" state.
- **Daily Rates Ticker** — Auto-scrolling live price bar (Clear Float, Toughened, Laminated, DGU, Low-E, etc.)
- **Role-Based Hero** — Headline adapts for Homeowner / Architect / Builder / Glass Dealer
- **Product Customizer** — 3-step flow: Glass Config → Vendor Compare → Quote Summary with live price calculator (width × height × qty × rate/sqft), GST breakdown, PDF download mock
- **Full Cart Page** — Itemised order summary, qty controls, subtotal + GST @18% + grand total, checkout flow
- **Allied Products** — Hardware, sealants & profiles with horizontal scroll and Add to Cart
- **Service Partners** — Verified glass installers with Request Visit flow
- **Fully Responsive** — Mobile-first design with smooth scroll navigation

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite 5 | Dev server & bundler |
| Tailwind CSS 3 | Styling |
| lucide-react | Icons |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
Glass121/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .gitignore
└── src/
    ├── main.jsx      ← React entry point
    ├── App.jsx       ← Complete SPA (all 5 sections)
    └── index.css     ← Global styles + animations
```

## Sections

1. **Hero** — Headline, role selector, "Find Your Glass →" CTA, ticker, How It Works, Use Case cards
2. **Smart Glass Finder** — Search input + quick chips, recommendations with specs & pricing
3. **Product Customizer** — Glass config form, vendor comparison table, quote summary
4. **Allied Products** — Hardware, sealants, frames & profiles
5. **Service Partners** — Installers, measurement experts, site supervisors

## Deployment

### Vercel (Frontend)
Connect this GitHub repo to Vercel — it auto-detects Vite. No extra config needed.

### Environment Variables
No environment variables required — all data is hardcoded mock data.

---

© 2025 AmalGus Technologies Pvt. Ltd. · Made in India 🇮🇳