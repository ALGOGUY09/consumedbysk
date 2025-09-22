# Consumed — daily log of media I consumed

A minimal static site inspired by consumed.today to log daily items and media (text, audio, video) consumed.

- No database. Content is plain JSON files per day in `data/entries`.
- Built locally to a static site in `public/`.
- Deployed to Cloudflare Pages.

## Content model
Each day is a JSON file named `YYYY-MM-DD.json` with shape:

```
{
  "date": "2025-09-22",
  "items": [
    {
      "type": "text|audio|video|image|link|note",
      "title": "string",
      "by": "creator/author (optional)",
      "url": "https://... (optional)",
      "notes": "free-form notes (optional)",
      "duration": "e.g. 1h23m (optional)",
      "tags": ["optional", "tags"]
    }
  ]
}
```

## Local development
- Put new day entries into `data/entries/`.
- Open `public/index.html` to view. Client-side JS renders the feed from JSON files listed in `data/index.json`.

## Build and deploy
- This is a static site: Cloudflare Pages can serve `public/` directly.
- Add a Pages project pointing to this repo, set Build command: `bash scripts/build.sh` and Output dir: `public`.
- Or commit changes and let Pages auto-build.

