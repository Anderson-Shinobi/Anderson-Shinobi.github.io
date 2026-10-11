/* Independent AVR laboratory links and design-content regression.
 * Protocol qualification and raw waveforms live in each lab's own repository.
 */
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const start = html.indexOf('id="interactive-lab"');
const end = html.indexOf('class="section approach-section"', start);
assert.ok(start >= 0 && end > start, "Missing AVR labs section");
const section = html.slice(start, end);
const labs = [
  ["477357756254868481", "SHINOBI-AVR-Bare-Metal-PWM-Lab"],
  ["477544744412189697", "SHINOBI-AVR-Bare-Metal-SPI-Lab"],
  ["477548989078745089", "SHINOBI-AVR-Bare-Metal-I2C-Lab"]
];

assert.equal((section.match(/class="avr-lab-card avr-lab-/g) || []).length, 3);
for (const [wokwiId, name] of labs) {
  const live = 'href="https://wokwi.com/projects/' + wokwiId + '"';
  const repo = 'href="https://github.com/Anderson-Shinobi/' + name + '"';
  assert.equal(section.split(live).length - 1, 1, "Missing/duplicate Wokwi URL: " + wokwiId);
  assert.equal(section.split(repo).length - 1, 1, "Missing/duplicate GitHub repo: " + name);
}
assert.ok(section.includes("assets/icons/shinobi-raven-shield.svg"));
assert.ok(fs.existsSync(path.join(root, "assets/icons/shinobi-raven-shield.svg")));
assert.doesNotMatch(section, /href="[^"]*\/evidence\//);
assert.doesNotMatch(section, /CPOL|47[,.](?:77|87)|anomal(?:y|ia)/i);
assert.doesNotMatch(html, /Anderson-Shinobi\.github\.io\/(?:tree|blob)\/main\/labs\/wokwi\/uno-baremetal-pwm/);

// Lab source must never be duplicated within the portfolio repository.
for (const file of [
  "sketch.ino", "diagram.json", "LICENSE",
  "evidence/measurements.csv", "evidence/VCD_VALIDATION.md"
]) {
  assert.equal(fs.existsSync(path.join(root, "labs/wokwi/uno-baremetal-pwm", file)), false,
    "Source unexpectedly duplicated in website repo: " + file);
}
console.log("PASS: three independent AVR labs, original crest, curated CTAs and no duplicated firmware");
