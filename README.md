# CNHSC Website

Prototype site for [Central New Hampshire Snowmobile Club](https://www.cnhsc.org) — built with [Astro](https://astro.build) as a static, git-backed replacement for the legacy WordPress site.

## Quick start

```bash
npm install
npm run dev      # local preview at http://localhost:4321
npm run build    # production build to ./dist
npm run preview  # preview production build
```

## Project structure

```
src/
  data/
    site.json           # Club info, contact, announcements, external links
    sponsors.json       # Sponsor tiers and sponsor list
  content/
    trail-reports/      # One Markdown file per trail report
  components/           # Reusable UI pieces
  layouts/              # Page shell (header, footer)
  pages/                # Routes
```

## Updating content (no code required)

### Trail report

1. Copy an existing file in `src/content/trail-reports/` (e.g. `2026-03-06.md`)
2. Rename it with the report date (e.g. `2026-03-13.md`)
3. Edit the frontmatter (`title`, `date`, `status`, `trails`, etc.) and body text
4. Commit and push — the site rebuilds automatically once deployed

### Sponsors

Edit `src/data/sponsors.json` — add or update entries in the `sponsors` array.

### Announcements & contact info

Edit `src/data/site.json`.

## Deployment (planned)

Connect this repo to **Cloudflare Pages** or **Netlify** for free static hosting. DNS cutover for `cnhsc.org` happens separately when ready.

## Status

**Prototype** — Home, Trail Reports, Sponsors, and About pages with sample content migrated from the current site.
