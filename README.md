# SHINOBI Engineering — From Physics to Firmware

[![Quality Gate and GitHub Pages](https://github.com/Anderson-Shinobi/Anderson-Shinobi.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/Anderson-Shinobi/Anderson-Shinobi.github.io/actions/workflows/deploy.yml)
[![Static Checks](https://github.com/Anderson-Shinobi/Anderson-Shinobi.github.io/actions/workflows/site-checks.yml/badge.svg)](https://github.com/Anderson-Shinobi/Anderson-Shinobi.github.io/actions/workflows/site-checks.yml)

**Proof over promises.** An intentionally lightweight technical portfolio for Anderson Nogueira — embedded firmware, C/C++, bare-metal development, Linux engineering and reproducible hardware simulation.

**Public site:** https://anderson-shinobi.github.io/  
**Source repository:** https://github.com/Anderson-Shinobi/Anderson-Shinobi.github.io

## Engineering principles

- **Evidence first:** link real public repositories and explain their documented tests and limitations. The website does not display synthetic live metrics.
- **Static by design:** semantic HTML5, modern CSS, vanilla JavaScript; no client-side framework or paid API.
- **Accessibility by default:** keyboard navigation, visible focus, responsive layout, WCAG 2.1 AA automated audits and sampled 7:1 (AAA) contrast ratios.
- **Bilingual content:** EN/PT-BR without external translation APIs. Language preference is stored locally, with an English fallback when browser storage is unavailable.
- **Privacy:** no analytics, tracking pixels or Telegram BotFather token. Future aggregate visitor telemetry is only specified in \`TELEMETRY_DESIGN.md\`.

## SHINOBI Interactive Lab — Wokwi starter

The homepage now includes an **Interactive Lab** section with a real, reviewable Arduino Uno (ATmega328P) bare-metal GPIO/Timer1 PWM project. The laboratory source lives at [`labs/wokwi/uno-baremetal-pwm/`](labs/wokwi/uno-baremetal-pwm/), with `sketch.ino`, `diagram.json`, and [setup/validation instructions](labs/wokwi/uno-baremetal-pwm/README.md). The circuit includes a 220 Ω LED path and a two-channel logic-analyzer hookup (PWM on D9, GPIO on D13).

**Current evidence:** static circuit checks and AVR cross-compiler verification are required by CI. The author provided a [public Wokwi project URL](https://wokwi.com/projects/477357756254868481), now linked via the portfolio's **Run Simulation / Executar simulação** button. The author's downloaded Wokwi logic-analyzer VCD has now been analyzed: **976.5625 Hz / 1.024 ms**, with measured duty cycles **10.15625%, 50.00000%, 89.84375%**. See the [timing evidence](labs/wokwi/uno-baremetal-pwm/evidence/VCD_VALIDATION.md) and [CSV](labs/wokwi/uno-baremetal-pwm/evidence/measurements.csv). The original VCD is identified by SHA-256 but is not committed; physical hardware performance and matching of the live Wokwi editor to the repository are not independently established.

### Validate the lab locally

```bash
node tests/test_wokwi_lab.cjs
sudo apt-get install -y gcc-avr avr-libc
avr-g++ -std=gnu++11 -Os -Wall -Wextra -Werror -mmcu=atmega328p -DF_CPU=16000000UL -x c++ \
  -c labs/wokwi/uno-baremetal-pwm/sketch.ino -o /tmp/shinobi-pwm.o
```

These checks do not prove simulator output. Open the [author-supplied Wokwi project](https://wokwi.com/projects/477357756254868481), compare its source to GitHub, run it, and capture an independent VCD if you want to reproduce the [simulator measurements](labs/wokwi/uno-baremetal-pwm/evidence/VCD_VALIDATION.md).

## Architecture

\`\`\`text
.
├── index.html                 # Homepage / project evidence
├── certifications.html        # Training catalog
├── style.css                  # Legacy baseline layer
├── hybrid-v2.css              # Hybrid Lab design system
├── script.js                  # Navigation and project filters
├── i18n.js                    # EN/PT-BR translation dictionary
├── assets/
│   ├── css/refinements.css    # WCAG contrast and interaction layer
│   └── images/profile.jpg     # Canonical original; not overwritten
├── scripts/
│   ├── build.mjs              # Static bundling/minification and cwebp conversion
│   ├── check-links.mjs        # Internal links and optimized asset integrity
│   └── check-contrast.mjs     # Sampled WCAG ratio assertions
├── tests/
│   ├── test_site.py           # Original static-site smoke tests
│   ├── test_i18n.js           # Bilingual state tests
│   └── browser-a11y.mjs       # Chromium + axe 2-page/2-language/2-viewport audit
├── .github/workflows/
│   ├── site-checks.yml        # Lightweight checks
│   ├── lighthouse.yml         # Informational lab performance audit
│   └── deploy.yml             # Quality gate → artifact → Pages
├── .htmlhintrc
├── .stylelintrc.json
├── package.json
├── package-lock.json         # Locked dependency resolution (npm ci)
└── TELEMETRY_DESIGN.md
\`\`\`

The built \`dist/\` folder contains two HTML pages, minified CSS/JS, original JPEG assets and an optimized WebP profile image. \`dist/\` and \`node_modules/\` are generated and ignored by Git. Source HTML remains usable from a basic local server, falling back to the JPEG without requiring an asset compilation step.

### Photo delivery

The source uses a semantic \`<picture>\` wrapper and a JPEG \`<img>\` with \`width\`, \`height\`, \`loading="lazy"\` and \`decoding="async"\`. CI generates \`profile.webp\` with \`cwebp -q 82\` and inserts its \`<source type="image/webp">\` only into the verified deployment artifact. This avoids broken WebP paths when the unbuilt source branch is previewed. The JPEG remains as the browser fallback.

## Run locally (Linux Mint / Ubuntu)

Prerequisites: Node.js 22+, npm, Python 3, and \`webp\` (\`cwebp\`). Chromium is needed for the optional browser audit.

\`\`\`bash
sudo apt-get install -y webp
npm ci
npm run verify
python3 -m http.server 8000 --directory dist
# Open http://localhost:8000
\`\`\`

For a quick edit without build dependencies:

\`\`\`bash
python3 -m http.server 8000
# Open http://localhost:8000 (JPEG fallback, original CSS and JS)
\`\`\`

Browser accessibility audit:

\`\`\`bash
npx playwright install chromium
npm run test:browser
\`\`\`

## Continuous Integration / Delivery

\`.github/workflows/deploy.yml\` executes for PRs, for pushes to \`main\` and manually:

1. HTMLHint and Stylelint checks.
2. JavaScript syntax, bilingual tests and original Python smoke tests.
3. Contrast checks for representative opaque backgrounds (7:1 threshold).
4. WebP conversion, CSS/JS minification, static artifact generation.
5. Internal path/fragment verification (prevents local asset and anchor 404s).
6. axe-powered WCAG 2.1 AA checks on homepage and catalog, each in English and Portuguese, at desktop and mobile widths.
7. **Only after success and only on \`main\`**, upload and deploy the validated \`dist/\` artifact.

**One-time publishing-source migration:** if Pages is configured as *Deploy from a branch*, a repository administrator must visit **Settings → Pages → Build and deployment → Source → GitHub Actions** before the custom deploy job can become the site's active publisher. Do not delete the original source files. See [GitHub documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

The repository integration used to prepare this change cannot modify that settings page, so this migration is **not** claimed as completed.

## Validation evidence

| Gate | Command / evidence | Acceptance |
|---|---|---|
| HTML validity lint | \`npm run lint:html\` | No reported lint violations |
| CSS lint | \`npm run lint:css\` | No reported lint violations |
| Bilingual behavior | \`npm run test:i18n\` | EN ⇄ PT-BR reversible, choice persists |
| Static integrity | \`npm run test:smoke\` | Required files, IDs, anchors exist |
| Contrast samples | \`npm run test:contrast\` | Selected surfaces ≥ 7:1 |
| Asset generation | \`npm run build\` | Minified bundles, valid WebP + JPEG |
| Internal links | \`npm run test:links\` | No missing local resources or anchors |
| Browser accessibility | \`npm run test:browser\` | Zero automated WCAG 2.1 AA violations in tested views |
| Deployment | GitHub Actions \`deploy.yml\` | Success after all required gates |

### Verified Lighthouse baseline (2026-10-08)

The [lab run](https://github.com/Anderson-Shinobi/Anderson-Shinobi.github.io/actions/runs/37857433459) measured the built `dist/` site with simulated Lighthouse conditions (not field data):

| Scenario | Performance | Accessibility | LCP | CLS |
|---|---:|---:|---:|---:|
| Homepage mobile | 99 | 100 | 1,802 ms | 0.00 |
| Homepage desktop | 100 | 100 | 401 ms | 0.00 |
| Certifications mobile | 100 | 98 | 1,651 ms | 0.00 |

The catalog has a Lighthouse accessibility score of **98** even though the separate axe WCAG 2.1 AA check reported zero detected violations for its tested viewport and language combinations. A passing automated test is not a conformance certificate; investigate the remaining Lighthouse recommendations during the next design review. Scores vary by runner, browser, device and network.

**Measured results:** individual validation results appear in the GitHub Actions run. Per-build JPEG/WebP bytes, compression percentage and minified payload sizes are emitted to \`dist/assets/dist/build-metrics.json\`. No Lighthouse, PageSpeed, TBT, LCP or CLS score is asserted without a real measured run. Automated axe audits do not prove comprehensive WCAG conformance; manual keyboard, zoom, screen-reader and contrast-over-gradient checks remain part of acceptance.

## Release checklist

- [ ] All Pull Request checks pass
- [ ] Run manual smartphone and desktop visual review
- [ ] Confirm exact project content and links
- [ ] Configure GitHub Actions as the Pages publishing source
- [ ] Merge after approving the release
- [ ] Confirm \`deploy.yml\` and the published website on the new commit

**License:** Personal portfolio. All trademarks and third-party project names belong to their respective owners.
