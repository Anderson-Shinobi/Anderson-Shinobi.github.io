/* Regression checks for the independently maintained AVR PWM laboratory.
 * Hardware validation and firmware compilation run in the lab's own CI.
 */
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const repo = "https://github.com/Anderson-Shinobi/SHINOBI-AVR-Bare-Metal-PWM-Lab";
const wokwi = "https://wokwi.com/projects/477357756254868481";

for (const href of [
  repo,
  repo + "/blob/main/README.md",
  repo + "/blob/main/evidence/VCD_VALIDATION.md",
  wokwi
]) {
  assert.ok(html.includes('href="' + href + '"'), "Missing linked lab resource: " + href);
}
assert.doesNotMatch(html, /Anderson-Shinobi\.github\.io\/(?:tree|blob)\/main\/labs\/wokwi\/uno-baremetal-pwm/);
for (const f of [
  "sketch.ino", "diagram.json", "LICENSE",
  "evidence/measurements.csv", "evidence/VCD_VALIDATION.md"
]) {
  assert.equal(fs.existsSync(path.join(root, "labs/wokwi/uno-baremetal-pwm", f)), false,
    "Source file unexpectedly duplicated in website repo: " + f);
}
assert.match(html, /WOKWI DIGITAL TIMING VERIFIED/);
console.log("PASS: independent AVR repository and simulator links; no duplicated lab source");
