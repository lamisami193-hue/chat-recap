# TG Wrapped (chat-recap)

A static, browser-only tool that turns a Telegram Desktop JSON export into shareable story cards.

**Live site:** https://tgwrapped.devs.surf/

## Languages and SEO

- English: `/`
- Arabic: `/ar/`
- Spanish: `/es/`
- French: `/fr/`
- Portuguese: `/pt/`

Each language page has a localized title and description, a canonical URL, alternate-language links, and the sitemap includes all language URLs. The site includes SoftwareApplication structured data and a visible FAQ section.

## Privacy

- The Telegram export is parsed and analyzed locally in the browser.
- The app does not upload chat content. Google Analytics 4 (measurement ID `G-N6T6E3DRT6`) measures visits and a few content-free events (`file_loaded`, `cards_generated`, `card_download`, `card_share`, `download_all`, `sample_used`, `guide_cta_click`); it never receives chat content.
- The analysis engine clears the parsed export data after generating results. The worker itself remains active until the user starts over, when it is terminated and its object URL is revoked.
- For extra privacy, export Telegram data as **Machine-readable JSON** without photos, videos, or other media.

## Deploy

The site is served directly from the repository root by Cloudflare Pages; no build command is required. Commits pushed to `main` are deployed automatically.

## Main files

- `index.html` — application, translations, analysis engine, and card renderer.
- `robots.txt` — crawler access rules.
- `sitemap.xml` — sitemap for the live site.
- `tests/stats.test.cjs` — regression tests for export dates, silence calculations, media cards, and invalid input.

Run the regression tests with `npm test` using Node.js 18 or newer.

The project is not affiliated with Telegram.

## Guides

Two short guides per language (`/guides/export-telegram-chat-json/` and `/guides/telegram-chat-stats/`, plus a `/guides/` index) help visitors export their Telegram data and understand the stats. They are listed in `sitemap.xml` with hreflang alternates and linked from every page footer.
