# Book Publisher

A small writing studio for drafting, typesetting and exporting books — a zero-dependency
Node server plus a vanilla JS front end. No build step, no database: everything you write is
saved to `localStorage` in your browser.

![screenshot placeholder](https://img.shields.io/badge/status-running-brightgreen)

## Run it

```bash
npm start          # or: node server.js
# → http://localhost:3000
```

`PORT` and `HOST` can be overridden with environment variables (`HOST` defaults to `0.0.0.0`).

## What's inside

**Library sidebar** — every book you create, with its own cover colour, chapter count and word
count. Click a book to switch to it.

**Chapter list** — reorder chapters with the ↑ / ↓ arrows, delete with ✕, and add new ones with
**+ Add**.

**Editor** — a serif writing surface with a live word count, paragraph count, reading time and an
optional per-chapter target. The toolbar (or ⌘/Ctrl + B / I) inserts Markdown: `**bold**`,
`_italic_`, `## headings`, `> quotes` and `* * *` scene breaks.

**Live preview** — the right-hand panel typesets your manuscript as a paginated paper page,
using the same Markdown you typed, complete with a title page, chapter openings, drop caps and
page numbers. Step through pages with the arrows or ← / →.

**Book details** — title, subtitle, author, genre, blurb and cover colour, edited in a dialog.

## Export

| Format | Use |
| --- | --- |
| Markdown (`.md`) | manuscript for any editor |
| Print-ready HTML (`.html`) | open in a browser and print to PDF (A5 page setup included) |
| Plain text (`.txt`) | submission-safe text |
| Backup (`.json`) | all books, restorable via **Export → Import…** |

Import accepts `.md`, `.txt` and Book Publisher `.json` backups. A Markdown file is split into
chapters at each `# ` heading.

## Layout

```
server.js          static file server (no dependencies)
public/index.html  app shell
public/styles.css  dark/light theme, three-pane studio layout
public/app.js      state, persistence, pagination, export
```

## Shortcuts

| Keys | Action |
| --- | --- |
| ⌘/Ctrl + B | bold |
| ⌘/Ctrl + I | italic |
| ⌘/Ctrl + S | save now (saving is automatic anyway) |
| ← / → | previous / next preview page |

A sample book, *The Lantern Keeper*, is seeded on first load so the preview has something in it.
Delete it via **Details → Delete book** when you start your own.
