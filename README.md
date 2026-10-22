# TG Wrapped (chat-recap)

A static, browser-only tool that turns a Telegram Desktop JSON export into shareable story cards.

**Live site:** https://chat-recap.pages.dev/

## Privacy

- The Telegram export is parsed and analyzed locally in the browser.
- The app does not upload chat content or call an analytics service.
- The app clears the parsed chat data from its analysis engine after generating results and disposes the worker when starting over.
- For extra privacy, export Telegram data as **Machine-readable JSON** without photos, videos, or other media.

## Deploy

The site is served directly from the repository root by Cloudflare Pages; no build command is required. Commits pushed to `main` are deployed automatically.

## Main files

- `index.html` — application, translations, analysis engine, and card renderer.
- `robots.txt` — crawler access rules.
- `sitemap.xml` — sitemap for the live site.

The project is not affiliated with Telegram.
