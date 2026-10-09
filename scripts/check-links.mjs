/**
 * Deployment artifact verifier: detects broken relative links, anchors,
 * source files and optimized image references before GitHub Pages deployment.
 * External websites are beyond this local integrity test.
 */
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, relative, extname } from "node:path";
const dist = resolve("dist");
const pages = ["index.html", "certifications.html"];
const attr = /\b(?:href|src|srcset)="([^"]+)"/g;

for (const page of pages) {
  const html = readFileSync(resolve(dist, page), "utf8");
  const matches = [...html.matchAll(attr)].map(x => x[1]);
  for (const value of matches) {
    const href = value.split(/\s*,\s*/)[0].trim().split(/\s+\d+[wx]$/)[0];
    if (/^(?:https?:|mailto:|tel:|data:|\/\/)/i.test(href)) continue;
    const [path, hash] = href.split("#", 2);
    const clean = decodeURIComponent(path.split("?")[0]);
    const target = resolve(dist, clean || page);
    const rel = relative(dist, target);
    assert.ok(!rel.startsWith("..") && !rel.startsWith("/"), "Out of root link: " + value);
    assert.ok(existsSync(target), page + ": missing " + href);
    if (hash && extname(target).toLowerCase() === ".html") {
      const targetHtml = readFileSync(target, "utf8");
      const anchors = [...targetHtml.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
      assert.ok(anchors.includes(decodeURIComponent(hash)), page + ": missing anchor " + href);
    }
  }
}
const homepage = readFileSync(resolve(dist, "index.html"), "utf8");
assert.match(homepage, /<picture class="profile-picture">[\s\S]*?<source type="image\/webp" srcset="assets\/images\/profile\.webp">/);
assert.match(homepage, /assets\/dist\/site\.min\.css/);
const catalog = readFileSync(resolve(dist, "certifications.html"), "utf8");
const fingerprintedI18n = /<script src="(assets\/dist\/i18n\.([0-9a-f]{12})\.min\.js)" defer><\/script>/g;
const homeScript = [...homepage.matchAll(fingerprintedI18n)];
const catalogScript = [...catalog.matchAll(fingerprintedI18n)];
assert.equal(homeScript.length, 1, "Homepage must load exactly one versioned translation bundle");
assert.equal(catalogScript.length, 1, "Catalog must load exactly one versioned translation bundle");
assert.equal(homeScript[0][1], catalogScript[0][1], "Both pages must load the same i18n version");
const i18nBytes = readFileSync(resolve(dist, homeScript[0][1]));
const expectedHash = createHash("sha256").update(i18nBytes).digest("hex").slice(0, 12);
assert.equal(homeScript[0][2], expectedHash, "i18n filename must match its content SHA-256");
assert.match(i18nBytes.toString("utf8"), /Conheça minha formação complementar/);
assert.match(i18nBytes.toString("utf8"), /Ver catálogo de formação/);

const webp = readFileSync(resolve(dist, "assets/images/profile.webp"));
assert.equal(webp.toString("ascii", 0, 4), "RIFF");
assert.equal(webp.toString("ascii", 8, 12), "WEBP");
console.log("PASS: deploy artifact has valid local links, anchors, CSS/JS and WebP/JPEG picture.");
