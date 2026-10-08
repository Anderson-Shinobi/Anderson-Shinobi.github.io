/**
 * Verify WCAG relative-luminance contrast for critical opaque UI surfaces.
 * This is a measurable baseline, not a substitute for axe/visual audits of
 * layered gradients, focus indicators, hover states and browser rendering.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../assets/css/refinements.css", import.meta.url), "utf8");
const token = name => {
  const match = css.match(new RegExp("--" + name + ":\\s*(#[0-9a-fA-F]{6})"));
  assert.ok(match, "Missing token " + name);
  return match[1];
};
const luminance = hex => {
  const channels = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  const linear = channels.map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4);
  return .2126 * linear[0] + .7152 * linear[1] + .0722 * linear[2];
};
const ratio = (a, b) => {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
};
const samples = [
  ["Body text on dark background", token("color-text"), "#090e18", 7],
  ["Secondary text on dark background", token("color-muted"), "#090e18", 7],
  ["Secondary text on project card", token("color-muted"), "#131d2b", 7],
  ["Body text on contact background", token("color-muted"), "#141a30", 7],
  ["Active filter/button text", "#f5f7ff", "#5e448f", 7],
  ["Hero caption", "#c7d8ed", "#090e18", 7],
  ["Contact caption", "#c7d8ed", "#111a2a", 7],
];
for (const [name, foreground, background, minimum] of samples) {
  const actual = ratio(foreground, background);
  console.log(name + ": " + actual.toFixed(2) + ":1");
  assert.ok(actual >= minimum, name + " falls below " + minimum + ":1");
}
console.log("PASS: critical sampled opaque text pairs meet the AAA 7:1 threshold.");
