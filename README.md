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

**Measured results:** individual validation results appear in the GitHub Actions run. Per-build JPEG/WebP bytes, compression percentage and minified payload sizes are emitted to \`dist/assets/dist/build-metrics.json\`. No Lighthouse, PageSpeed, TBT, LCP or CLS score is asserted without a real measured run. Automated axe audits do not prove comprehensive WCAG conformance; manual keyboard, zoom, screen-reader and contrast-over-gradient checks remain part of acceptance.

## Release checklist

- [ ] All Pull Request checks pass
- [ ] Run manual smartphone and desktop visual review
- [ ] Confirm exact project content and links
- [ ] Configure GitHub Actions as the Pages publishing source
- [ ] Merge after approving the release
- [ ] Confirm \`deploy.yml\` and the published website on the new commit

**License:** Personal portfolio. All trademarks and third-party project names belong to their respective owners.
