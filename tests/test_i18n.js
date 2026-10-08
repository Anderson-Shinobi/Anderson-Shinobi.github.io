/* Dependency-free language switch tests for the static site. */
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");

const source = fs.readFileSync(path.join(__dirname, "..", "i18n.js"), "utf8");
const original = "  Projects  ";
const paragraph = "  I build and validate embedded software where hardware behavior matters — from low-level C/C++ and peripherals to automated simulation, telemetry and Linux engineering tools.  ";

function setup(page, saved = new Map(), blockStorage = false) {
  const textNodes = [
    { nodeValue: original, parentElement: { closest: () => null } },
    { nodeValue: paragraph, parentElement: { closest: () => null } },
    { nodeValue: "  Engineering knowledge, applied.  ", parentElement: { closest: () => null } },
    { nodeValue: "  Official course title remains in English  ", parentElement: { closest: () => null } }
  ];

  const makeElement = (attrs = {}, dataset = {}) => {
    const handlers = new Map();
    return {
      dataset,
      attrs: { ...attrs },
      getAttribute(name) { return this.attrs[name] ?? null; },
      setAttribute(name, value) { this.attrs[name] = String(value); },
      closest() { return null; },
      addEventListener(event, cb) { handlers.set(event, cb); },
      click() { handlers.get("click")?.(); },
      classList: { active: false, toggle(name, value) { if (name === "active") this.active = value; } }
    };
  };

  const englishButton = makeElement({ "aria-pressed": "true" }, { language: "en" });
  const portugueseButton = makeElement({ "aria-pressed": "false" }, { language: "pt-BR" });
  const nav = makeElement({ "aria-expanded": "false", "aria-label": "Open navigation" });
  const alt = makeElement({ alt: "Portrait of Anderson Nogueira" });
  const metadata = {
    'meta[name="description"]': { content: "Original English description" },
    'meta[property="og:title"]': { content: "Original English OG title" },
    'meta[property="og:description"]': { content: "Original English OG description" }
  };

  const document = {
    body: {},
    documentElement: { lang: "en" },
    title: "Original English document title",
    querySelector(selector) {
      if (selector === ".nav-toggle") return nav;
      return metadata[selector] || null;
    },
    querySelectorAll(selector) {
      if (selector === ".language-switch [data-language]") return [englishButton, portugueseButton];
      if (selector === "[aria-label], [alt], [title]") return [alt];
      return [];
    },
    createTreeWalker() {
      let cursor = -1;
      return { nextNode: () => textNodes[++cursor] || null };
    }
  };

  const storage = {
    getItem(key) { if (blockStorage) throw Error("Unavailable"); return saved.get(key) || null; },
    setItem(key, value) { if (blockStorage) throw Error("Unavailable"); saved.set(key, value); }
  };

  const listeners = new Map();
  vm.runInNewContext(source, {
    document,
    location: { pathname: "/" + page },
    localStorage: storage,
    NodeFilter: { SHOW_TEXT: 4 },
    window: { addEventListener(event, fn) { listeners.set(event, fn); } }
  });
  return { document, textNodes, englishButton, portugueseButton, nav, alt, metadata, saved, listeners };
}

const sharedStorage = new Map();
const home = setup("index.html", sharedStorage);
assert.equal(home.document.documentElement.lang, "en");
assert.equal(home.textNodes[0].nodeValue, original);
home.portugueseButton.click();
assert.equal(home.document.documentElement.lang, "pt-BR");
assert.equal(home.textNodes[0].nodeValue, "  Projetos  ");
assert.match(home.textNodes[1].nodeValue, /Desenvolvo e valido software embarcado/);
assert.equal(home.alt.getAttribute("alt"), "Retrato de Anderson Nogueira");
assert.equal(home.nav.getAttribute("aria-label"), "Abrir menu");
assert.equal(home.portugueseButton.getAttribute("aria-pressed"), "true");
assert.equal(home.englishButton.getAttribute("aria-pressed"), "false");
assert.match(home.document.title, /Portfólio/);
assert.match(home.metadata['meta[name="description"]'].content, /Firmware Embarcado/);
assert.equal(sharedStorage.get("shinobi-portfolio-language"), "pt-BR");
home.nav.setAttribute("aria-expanded", "true");
home.nav.click();
assert.equal(home.nav.getAttribute("aria-label"), "Fechar menu");

home.englishButton.click();
assert.equal(home.document.documentElement.lang, "en");
assert.equal(home.textNodes[0].nodeValue, original);
assert.equal(home.textNodes[1].nodeValue, paragraph);
assert.equal(home.alt.getAttribute("alt"), "Portrait of Anderson Nogueira");
assert.equal(home.document.title, "Original English document title");

home.portugueseButton.click();
const catalog = setup("certifications.html", sharedStorage);
assert.equal(catalog.document.documentElement.lang, "pt-BR");
assert.equal(catalog.textNodes[2].nodeValue, "  Conhecimento em engenharia, aplicado.  ");
assert.equal(catalog.textNodes[3].nodeValue, "  Official course title remains in English  ");
assert.match(catalog.document.title, /Catálogo de Formação Técnica/);
catalog.englishButton.click();
assert.equal(catalog.document.documentElement.lang, "en");

const blocked = setup("index.html", new Map(), true);
blocked.portugueseButton.click();
assert.equal(blocked.document.documentElement.lang, "pt-BR");
assert.equal(blocked.textNodes[0].nodeValue, "  Projetos  ");
console.log("PASS: EN/PT-BR switch, persistence, restoration, attributes, metadata, original course names and storage fallback");
