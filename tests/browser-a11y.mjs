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
