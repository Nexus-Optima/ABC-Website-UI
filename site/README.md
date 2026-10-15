# Applied Bell Curve — marketing site

A Next.js (App Router, TypeScript) build of the Claude Design prototype in `../project/Website Prototype.dc.html`.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static prerender of every route
```

## Routes

| Route | Source design |
|---|---|
| `/` | Website Prototype (home) + HeroProblemSheets |
| `/industries` (`#not-listed`) | Industries |
| `/products` | Products |
| `/products/[id]` (`flexible-packaging`, `terry-towel`) | ProductDetailSections + SavingsCalculator |
| `/about`, `/careers`, `/contact` | About, Careers, Contact |
| `/demo` (`?industry=<id>` prefill) | RequestDemo |

## Where things live

- `lib/data.ts` holds the industries, suites and modules (ported from `abc-data.js`). Edit content here.
- `lib/calc-models.ts` holds the savings calculator models. **The coefficients are samples.**
- `app/globals.css` holds the design tokens and shared blocks (cells, buttons, forms).
- `public/images/` holds the industry photos taken from the design's image slots.

Breakpoints: desktop ≥1100px matches the 1440 design. Tablet runs 768–1099px. Mobile (<768px) follows the 390 design.

## Still placeholder / TODO

- Forms (feasibility, contact, demo, careers) validate on the client and show a success state, but **don't submit anywhere yet**.
- Founder names, bios and photos, and the About facts (Year, City, 00).
- Contact phone, address and LinkedIn links.
- Product screenshots in the APS module explorer.
- Mobile proof-strip figures (18%, 31%, 6 WK), which the design marks as placeholders.
