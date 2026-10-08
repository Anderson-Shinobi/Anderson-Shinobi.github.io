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
        for name in (*PAGES, "style.css", "hybrid-v2.css", "script.js", "assets/images/profile.jpg"):
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

    def test_telemetry_not_enabled(self):
        for page in (*PAGES, "script.js"):
            code = (ROOT / page).read_text(encoding="utf-8").lower()
            for marker in ("api.telegram.org", "bot_token", "google-analytics.com", "gtag("):
                with self.subTest(page=page, marker=marker):
                    self.assertNotIn(marker, code)


if __name__ == "__main__":
    unittest.main()
