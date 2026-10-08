/**
 * Deployment artifact verifier: detects broken relative links, anchors,
 * source files and optimized image references before GitHub Pages deployment.
 * External websites are beyond this local integrity test.
 */
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
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
const webp = readFileSync(resolve(dist, "assets/images/profile.webp"));
assert.equal(webp.toString("ascii", 0, 4), "RIFF");
assert.equal(webp.toString("ascii", 8, 12), "WEBP");
console.log("PASS: deploy artifact has valid local links, anchors, CSS/JS and WebP/JPEG picture.");
