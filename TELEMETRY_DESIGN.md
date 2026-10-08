# Hybrid Lab V2 — visitor telemetry design (not deployed)

## Objective
Send aggregate website visit statistics to a Telegram bot created later using BotFather.

## Security requirements
- NEVER embed the Telegram bot token or chat ID in HTML, CSS, JavaScript or any public GitHub Pages file.
- Use a backend endpoint (for example a secured Google Apps Script Web App or Cloudflare Worker) for Telegram Bot API calls.
- Store tokens and chat IDs in server-side secrets/properties only.
- Rate-limit and validate telemetry events. Avoid IP addresses, fingerprints, exact location and query strings.
- Display an appropriate privacy notice. Avoid sending visit-by-visit personally identifying information to Telegram.

## Suggested event (illustrative)
```json
{"event":"page_view","page":"/","time_bucket":"2026-10-07T21:00:00-03:00"}
```

## Suggested data flow
GitHub Pages -> restricted ingestion endpoint -> aggregate counters -> scheduled Telegram summary.

## Possible report
SHINOBI // SITE TELEMETRY
Today: [aggregate page views]
Pages: [aggregated top pages]
Last 7 days: [aggregated unique visits if consent and privacy-compatible measurement allow]

## Status
Design only. No visitor tracking or Telegram notifications have been enabled.
Requires bot token, destination chat and selected secure ingestion platform before activation.
