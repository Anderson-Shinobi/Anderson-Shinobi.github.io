/**
 * Summarize repeatable lab Lighthouse measurements.
 * These do not represent real-user CrUX/Core Web Vitals field data.
 */
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";
const files = process.argv.slice(2);
if (!files.length) throw new Error("Pass report JSON files");
const rows = files.map(file => {
  const result = JSON.parse(readFileSync(file, "utf8"));
  if (result.runtimeError) throw new Error(file + ": " + result.runtimeError.message);
  const audit = id => result.audits?.[id]?.numericValue ?? null;
  const score = id => result.categories?.[id]?.score ?? null;
  return {
    report: file,
    requestedUrl: result.requestedUrl,
    finalUrl: result.finalUrl,
    formFactor: result.configSettings?.formFactor || "unknown",
    performance: score("performance"),
    accessibility: score("accessibility"),
    lcp_ms: audit("largest-contentful-paint"),
    cls: audit("cumulative-layout-shift"),
    tbt_ms: audit("total-blocking-time"),
    fcp_ms: audit("first-contentful-paint")
  };
});
const fmt = (n,scale=1) => n == null ? "n/a" : (n*scale).toFixed(scale===100?0:1);
const header = [
"### Lighthouse laboratory audit (not field Core Web Vitals)",
"",
"| Scenario | Performance | Accessibility | LCP (ms) | CLS | TBT (ms) | FCP (ms) |",
"|---|---:|---:|---:|---:|---:|---:|"
];
for(const row of rows) {
  header.push("| "+row.report+" ("+row.formFactor+") | "+fmt(row.performance,100)+" | "+fmt(row.accessibility,100)+" | "+fmt(row.lcp_ms)+" | "+fmt(row.cls)+" | "+fmt(row.tbt_ms)+" | "+fmt(row.fcp_ms)+" |");
}
header.push("", "**Interpretation:** Lighthouse measurements use simulated laboratory conditions. INP cannot be inferred from this run; real-user measurement needs field data.", "");
const markdown = header.join("\n");
console.log(markdown);
writeFileSync("lighthouse/summary.md", markdown);
writeFileSync("lighthouse/metrics.json", JSON.stringify(rows,null,2)+"\n");
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY,markdown);
