/**
 * Deterministic static build. Dependencies run ONLY in CI/local development:
 * GitHub Pages receives self-contained HTML/CSS/JS and an optimized WebP.
 * Source HTML still works when served directly (JPEG fallback).
 */
import { readFile, writeFile, mkdir, cp, rm, stat } from "node:fs/promises";
import { join, resolve, dirname } from "node:path";
import { execFileSync } from "node:child_process";
import { transform } from "esbuild";

const root = resolve(import.meta.dirname, "..");
const dist = join(root, "dist");
const read = (name) => readFile(join(root, name), "utf8");
const put = async (name, content) => {
  const pathname = join(dist, name);
  await mkdir(dirname(pathname), { recursive: true });
  await writeFile(pathname, content);
};

await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, "assets", "dist"), { recursive: true });
await cp(join(root, "assets"), join(dist, "assets"), { recursive: true });

const cssSources = ["style.css", "hybrid-v2.css", "assets/css/refinements.css"];
const css = (await Promise.all(cssSources.map(read))).join("\n");
const minifiedCSS = await transform(css, { loader: "css", minify: true, target: "safari15" });
await put("assets/dist/site.min.css", minifiedCSS.code);

for (const name of ["script.js", "i18n.js"]) {
  const output = await transform(await read(name), {
    loader: "js",
    target: "es2020",
    minify: true,
    legalComments: "none",
  });
  await put("assets/dist/" + name.replace(".js", ".min.js"), output.code);
}

const jpg = join(root, "assets", "images", "profile.jpg");
const webp = join(dist, "assets", "images", "profile.webp");
try {
  execFileSync("cwebp", ["-quiet", "-q", "82", "-m", "6", jpg, "-o", webp], { stdio: "pipe" });
} catch (error) {
  throw new Error("WebP conversion requires cwebp (install the webp package). " + error.message);
}

const cssLinks = /<link rel="stylesheet" href="(?:style\.css|hybrid-v2\.css|assets\/css\/refinements\.css)"\s*\/?>\s*/g;
for (const page of ["index.html", "certifications.html"]) {
  let html = await read(page);
  const count = [...html.matchAll(cssLinks)].length;
  if (count !== 3) throw new Error(page + ": expected 3 source CSS references, found " + count);
  html = html.replace(cssLinks, "");
  html = html.replace("</head>", '  <link rel="stylesheet" href="assets/dist/site.min.css">\n</head>');
  for (const name of ["script", "i18n"]) {
    const original = '<script src="' + name + '.js" defer></script>';
    if (!html.includes(original)) throw new Error(page + ": missing " + original);
    html = html.replace(original, '<script src="assets/dist/' + name + '.min.js" defer></script>');
  }
  if (page === "index.html") {
    const tag = '<picture class="profile-picture">';
    if (!html.includes(tag)) throw new Error("Source picture markup missing");
    html = html.replace(tag, tag + '\n          <source type="image/webp" srcset="assets/images/profile.webp">');
  }
  await put(page, html);
}
await put(".nojekyll", "");

const bytes = async (name) => (await stat(join(dist, name))).size;
const photo = {
  jpeg_bytes: (await stat(jpg)).size,
  webp_bytes: await bytes("assets/images/profile.webp"),
};
photo.savings_percent = Number(((1 - photo.webp_bytes / photo.jpeg_bytes) * 100).toFixed(1));
await put("assets/dist/build-metrics.json", JSON.stringify({
  generated: true,
  css_bytes: await bytes("assets/dist/site.min.css"),
  js_bytes: (await bytes("assets/dist/script.min.js")) + (await bytes("assets/dist/i18n.min.js")),
  photo,
}, null, 2) + "\n");

console.log("PASS: static build created in dist/");
console.log(JSON.stringify(photo));
