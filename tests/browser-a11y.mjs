/**
 * Browser-level WCAG 2.1 AA regression checks at desktop/mobile widths.
 * Automated axe checks augment (not replace) manual screen-reader testing.
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, relative } from "node:path";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const root = resolve("dist");
const contentType = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".json": "application/json; charset=utf-8",
};
const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://localhost");
  const file = resolve(root, "." + (url.pathname === "/" ? "/index.html" : url.pathname));
  if (relative(root, file).startsWith("..")) { res.writeHead(403); res.end(); return; }
  try {
    const data = await readFile(file);
    res.writeHead(200, { "Content-Type": contentType[extname(file)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise(resolveListen => server.listen(0, "127.0.0.1", resolveListen));
const url = "http://127.0.0.1:" + server.address().port;

const browser = await chromium.launch({ headless: true });
let violationsCount = 0;
try {
  for (const width of [390, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 850 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    for (const pageName of ["index.html", "certifications.html"]) {
      await page.goto(url + "/" + pageName, { waitUntil: "load" });
      for (const language of ["en", "pt-BR"]) {
        await page.locator('.language-switch [data-language="' + language + '"]').click();
        assert.equal(await page.locator("html").getAttribute("lang"), language);

        if (pageName === "index.html") {
          // Decorative arrows sit in separate aria-hidden spans: only the adjacent
          // text node should be translated, without changing the arrow itself.
          const localizedLinks = [
            ['#approach a.text-link', 'See a documented validation pipeline', 'Veja um pipeline de validação documentado', '↗'],
            ['.about-actions a[href="certifications.html"]', 'Explore technical training', 'Conheça minha formação complementar', '↗'],
            ['.learning-card a[href="certifications.html"]', 'View training catalog', 'Ver catálogo de formação', '↗'],
            ['.site-footer a[href="#home"]', 'BACK TO TOP', 'VOLTAR AO TOPO', '↑']
          ];
          for (const [selector, en, pt, arrow] of localizedLinks) {
            const link = page.locator(selector);
            assert.equal(await link.count(), 1, "Unique localized link: " + selector);
            const expected = language === "pt-BR" ? pt : en;
            assert.equal((await link.innerText()).replace(arrow, "").trim(), expected,
              "Localized link text: " + selector);
            const icon = link.locator('span[aria-hidden="true"]');
            assert.equal((await icon.textContent()).trim(), arrow, "Preserved decorative arrow: " + selector);
          }
          // Wokwi link regression: correct saved project, localized label and safe external behavior.
          const wokwi = page.locator('#interactive-lab a[href="https://wokwi.com/projects/477357756254868481"]');
          assert.equal(await wokwi.count(), 1, "Exactly one public Wokwi project action");
          assert.equal(await wokwi.getAttribute("target"), "_blank");
          assert.match(await wokwi.getAttribute("rel"), /noopener/);
          assert.match(await wokwi.getAttribute("rel"), /noreferrer/);
          const expectedLabel = language === "pt-BR" ? "Executar simulação" : "Run Simulation";
          assert.equal((await wokwi.innerText()).replace("↗", "").trim(), expectedLabel, "Localized simulation action");
          assert.equal(await wokwi.getAttribute("aria-label"),
            language === "pt-BR"
              ? "Executar simulação SHINOBI AVR PWM no Wokwi (abre em nova aba)"
              : "Run SHINOBI AVR PWM simulation on Wokwi (opens in new tab)");
          const evidence = page.locator('#interactive-lab a[href="https://github.com/Anderson-Shinobi/SHINOBI-AVR-Bare-Metal-PWM-Lab/blob/main/evidence/VCD_VALIDATION.md"]');
          assert.equal(await evidence.count(), 1, "Measured PWM evidence link");
          const evidenceLabel = language === "pt-BR" ? "Evidência de PWM medido" : "Measured PWM evidence";
          assert.equal((await evidence.innerText()).replace("↗", "").trim(), evidenceLabel, "Evidence link translated");
          const independent = page.locator('#interactive-lab a[href="https://github.com/Anderson-Shinobi/SHINOBI-AVR-Bare-Metal-PWM-Lab"]');
          assert.equal(await independent.count(), 1, "Standalone laboratory repository action");
          assert.equal(await independent.getAttribute("target"), "_blank");
          assert.match(await independent.getAttribute("rel"), /noopener/);
          const repoLabel = language === "pt-BR" ? "Ver firmware e circuito" : "View firmware and circuit";
          assert.equal((await independent.innerText()).replace("↗", "").trim(), repoLabel, "Standalone repository link translated");
          // Browser tests verify website navigation; physical hardware remains untested.

        }

        if (pageName === "index.html") {
          // End-to-end regression: pointer and keyboard must both filter real cards.
          const expected = {
            all: ["C++ Embedded Telemetry Lab", "Renode C# Peripheral Lab", "qKAGE Home Supply", "Linux Mint USB Prep"],
            firmware: ["C++ Embedded Telemetry Lab"],
            simulation: ["C++ Embedded Telemetry Lab", "Renode C# Peripheral Lab"],
            tools: ["qKAGE Home Supply", "Linux Mint USB Prep"]
          };
          for (const [category, titles] of Object.entries(expected)) {
            const button = page.locator('.filter-button[data-filter="' + category + '"]');
            await button.click();
            assert.equal(await button.getAttribute("aria-pressed"), "true", category + " pressed state");
            assert.equal(await button.getAttribute("aria-controls"), "project-grid");
            assert.deepEqual(await page.locator(".project-card:not([hidden]) h3").allTextContents(), titles, category + " visible cards");
            assert.equal(await page.locator(".project-card[hidden]").count(), 4 - titles.length, category + " hidden cards");
            assert.equal((await page.locator("#project-count").textContent()).trim(), String(titles.length));
          }
          const firmware = page.locator('.filter-button[data-filter="firmware"]');
          await firmware.focus();
          await page.keyboard.press("Enter");
          assert.equal(await firmware.getAttribute("aria-pressed"), "true", "Keyboard activation");
          assert.equal(await page.locator(".project-card:not([hidden])").count(), 1);
          await page.locator('.filter-button[data-filter="all"]').click();
          assert.equal(await page.locator(".project-card:not([hidden])").count(), 4);
          assert.equal(await page.locator(".filter-summary-en").isVisible(), language === "en");
          assert.equal(await page.locator(".filter-summary-pt").isVisible(), language === "pt-BR");
        }

        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();
        if (results.violations.length) {
          violationsCount += results.violations.length;
          console.error(width + "px / " + pageName + " / " + language + ":");
          for (const issue of results.violations) {
            console.error(issue.id + ": " + issue.help + " => " + issue.nodes.map(n => n.target.join(" ")).join(", "));
          }
        }
      }
    }
    assert.deepEqual(errors, [], "Browser JavaScript errors at " + width + "px");
    if (width === 390) {
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      if (scrollWidth > width) {
        const offenders = await page.evaluate(() => [...document.querySelectorAll("body *")]
          .map(el => ({ el, rect: el.getBoundingClientRect() }))
          .filter(({ rect }) => rect.right > innerWidth + 1 || rect.left < -1)
          .slice(0, 12)
          .map(({ el, rect }) => ({
            element: el.tagName.toLowerCase(),
            className: typeof el.className === "string" ? el.className : "",
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            scrollWidth: el.scrollWidth
          })));
        console.error("MOBILE_OVERFLOW_ELEMENTS=" + JSON.stringify(offenders));
      }
      assert.ok(scrollWidth <= width, "Mobile horizontal overflow " + scrollWidth + "px");
    }
    await context.close();
  }
} finally {
  await browser.close();
  await new Promise(resolveClose => server.close(resolveClose));
}
assert.equal(violationsCount, 0, "Automated WCAG 2.1 A/AA violations");
console.log("PASS: axe WCAG 2.1 AA across 2 pages x 2 languages x 2 viewports.");
