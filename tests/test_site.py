"""Static-site smoke checks using only Python's standard library."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import unittest

ROOT = Path(__file__).resolve().parents[1]
PAGES = ("index.html", "certifications.html")


class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.links = []
        self.sources = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get("id"):
            self.ids.append(values["id"])
        if tag in {"a", "link"} and values.get("href"):
            self.links.append(values["href"])
        if tag in {"img", "script"} and values.get("src"):
            self.sources.append(values["src"])


def parse(page):
    doc = SiteParser()
    doc.feed((ROOT / page).read_text(encoding="utf-8"))
    doc.close()
    return doc


class PortfolioSmokeTests(unittest.TestCase):
    def test_required_files(self):
        for name in (*PAGES, "style.css", "hybrid-v2.css", "script.js", "i18n.js", "assets/images/profile.jpg", "assets/icons/shinobi-raven-shield.svg"):
            with self.subTest(path=name):
                self.assertTrue((ROOT / name).is_file(), f"Missing {name}")

    def test_no_duplicate_ids(self):
        for page in PAGES:
            with self.subTest(page=page):
                parsed = parse(page)
                self.assertEqual(len(parsed.ids), len(set(parsed.ids)))

    def test_local_links_and_anchors(self):
        for page in PAGES:
            doc = parse(page)
            for link in doc.links + doc.sources:
                with self.subTest(page=page, link=link):
                    parts = urlsplit(link)
                    if parts.scheme or parts.netloc or link.startswith("//"):
                        continue
                    target = (ROOT / (parts.path or page))
                    self.assertTrue(target.is_file(), f"Broken relative path: {link} in {page}")
                    if parts.fragment and target.suffix == ".html":
                        target_ids = parse(target.relative_to(ROOT)).ids
                        self.assertIn(parts.fragment, target_ids, f"Missing target: {link}")

    def test_project_filter_markup(self):
        home = (ROOT / "index.html").read_text(encoding="utf-8")
        self.assertEqual(home.count('class="filter-button'), 4)
        self.assertEqual(home.count('class="project-card card'), 4)
        self.assertIn('data-filter="all"', home)
        self.assertNotIn('onerror="', home.lower())

    def test_three_independent_avr_labs(self):
        home = (ROOT / "index.html").read_text(encoding="utf-8")
        lab_start = home.index('id="interactive-lab"')
        lab_end = home.index('class="section approach-section"', lab_start)
        lab_section = home[lab_start:lab_end]
        self.assertEqual(lab_section.count('class="avr-lab-card avr-lab-'), 3)
        self.assertEqual(lab_section.count('class="avr-lab-waveform"'), 3)
        self.assertIn('assets/icons/shinobi-raven-shield.svg', lab_section)
        self.assertTrue((ROOT / "assets/icons/shinobi-raven-shield.svg").is_file())
        for project in ("477357756254868481", "477544744412189697",
                        "477548989078745089"):
            self.assertEqual(lab_section.count("wokwi.com/projects/" + project), 1)
        for name in ("PWM-Lab", "SPI-Lab", "I2C-Lab"):
            self.assertEqual(lab_section.count("SHINOBI-AVR-Bare-Metal-" + name), 1)
        self.assertNotIn("/evidence/", lab_section)
        self.assertNotIn("CPOL", lab_section)
        self.assertNotIn("47.77", lab_section)
        self.assertNotIn("47.87", lab_section)

    def test_telemetry_not_enabled(self):
        for page in (*PAGES, "script.js"):
            code = (ROOT / page).read_text(encoding="utf-8").lower()
            for marker in ("api.telegram.org", "bot_token", "google-analytics.com", "gtag("):
                with self.subTest(page=page, marker=marker):
                    self.assertNotIn(marker, code)


if __name__ == "__main__":
    unittest.main()
