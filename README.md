# Anderson Shinobi GitHub Pages Portfolio

Professional personal portfolio website for Anderson Nogueira (Anderson Shinobi), focused on embedded firmware engineering, Linux workflows, certifications and AI-assisted engineering workflow documentation.

The portfolio includes projects, technical stack, education & technical background, certifications and AI-assisted engineering workflow.

Site URL:

[https://anderson-shinobi.github.io/](https://anderson-shinobi.github.io/)

GitHub profile:

[https://github.com/Anderson-Shinobi](https://github.com/Anderson-Shinobi)

## Project Structure

```text
.
├── index.html
├── certifications.html
├── style.css
├── script.js
├── assets/
│   ├── .gitkeep
│   └── images/
│       └── profile.jpg
└── README.md
```

## How to Preview Locally

1. Open the repository folder on your machine.
2. Open `index.html` directly in a browser.
3. Open `certifications.html` directly in a browser to view the full training catalog page.
4. Add your profile image at `assets/images/profile.jpg` if it is not present yet.

No build step and no external dependencies are required.

## How to Deploy on GitHub Pages

Repository name requirement:

`Anderson-Shinobi.github.io`

In GitHub, configure:

`Settings → Pages → Deploy from branch → main → /root`

Final URL:

[https://anderson-shinobi.github.io](https://anderson-shinobi.github.io)

## License

Personal portfolio project.


## Hybrid Lab V2 (in review)

V2 is developed on the \`feature/hybrid-lab-v2\` branch to avoid changes to the published \`main\` site before review.

### What's new

- New responsive homepage focused on validated engineering work.
- Featured evidence from \`cpp-embedded-telemetry-lab\`, Renode C# peripheral modeling, Qt/Linux applications and system tools.
- Dark graphite design, subtle engineering/HUD visual language, mobile navigation and accessible client-side project filters.
- Existing training catalog retained and visually aligned.
- Static smoke checks for local links, IDs, required assets, JS syntax and the absence of enabled visitor tracking.

### Review on a smartphone

The V2 source files can be reviewed on this branch in GitHub. A temporary external HTML preview may also be used; it is **not** the published GitHub Pages URL and is not a production hosting service.

### Local preview & validation

\`\`\`sh
python3 -m http.server 8000
# In another terminal:
python3 -m unittest discover -s tests -p 'test_site.py' -v
node --check script.js
\`\`\`

Open \`http://localhost:8000/\`.

### Publishing checklist

1. Review the V2 preview at mobile and desktop widths.
2. Confirm all project descriptions and public links.
3. Review the pull request and GitHub Actions checks.
4. Merge into \`main\` only after explicit approval.
5. Monitor Pages deployment before considering the release complete.

### Visitor telemetry

No analytics or Telegram bot requests are embedded in the site.
\`TELEMETRY_DESIGN.md\` documents a **future** privacy-aware integration; bot secrets must never enter this public repository.

## Bilingual interface — English / Português (Brasil)

Use the **EN** / **PT-BR** switch in the site header to change the interface language without reloading the page. The language choice persists across the homepage and training catalog using browser `localStorage`. English remains the original HTML and default language when no preference exists; browsing in private mode still permits switching without storage.

- `i18n.js`: Portuguese text dictionary and accessibility/metadata translations.
- `index.html` and `certifications.html`: accessible language toggle and shared localization script.
- `hybrid-v2.css`: responsive selector, including narrow-screen support.
- Official titles of third-party training courses and technical names remain in their source language for accuracy.
- There is **no** external translation API, visitor tracking or bot token in the frontend.

Run the bilingual regression checks with `node tests/test_i18n.js` and `node --check i18n.js`.
