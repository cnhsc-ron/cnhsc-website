# Decap CMS (content admin)

Club editors can publish **news** and **trail reports** at **`/admin`** without editing Markdown by hand. Decap commits files into this repo; the site rebuilds on push.

## What lives where

| Path | Purpose |
|------|---------|
| `public/admin/index.html` | Loads Decap CMS in the browser |
| `public/admin/config.yml` | Form definitions for news + trail reports |
| `functions/api/auth.js` | GitHub OAuth (Cloudflare Pages only) |
| `src/content/news/` | News Markdown files |
| `src/content/trail-reports/` | Trail report Markdown files |

## One-time setup (maintainer)

### 1. Deploy on Cloudflare Pages

Connect the GitHub repo with:

- **Build command:** `npm run build`
- **Build output directory:** `dist`

Note the Pages URL (e.g. `https://cnhsc-website.pages.dev`).

### 2. Update Decap URLs

Edit `public/admin/config.yml` and set these to your **production/staging origin** (same host):

- `site_url`
- `display_url`
- `backend.base_url`

Commit and push so `/admin` and OAuth use the correct domain.

### 3. Create a GitHub OAuth App

GitHub → **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**

| Field | Value |
|-------|--------|
| Application name | CNHSC Website CMS (or similar) |
| Homepage URL | `https://YOUR-PAGES-URL.pages.dev/admin` |
| Authorization callback URL | `https://YOUR-PAGES-URL.pages.dev/api/auth` |

Save the **Client ID** and generate a **Client secret**.

### 4. Add secrets in Cloudflare Pages

Pages project → **Settings** → **Environment variables** (Production and Preview):

| Name | Value |
|------|--------|
| `GITHUB_CLIENT_ID` | From the OAuth app |
| `GITHUB_CLIENT_SECRET` | From the OAuth app |

Redeploy after adding variables.

### 5. GitHub repo access

Anyone who publishes must have **write access** to `cnhsc-ron/cnhsc-website` (collaborator or org member). They log in to `/admin` with that GitHub account.

## Editor workflow

1. Open `https://YOUR-SITE/admin`
2. **Login with GitHub**
3. Choose **News** or **Trail reports**
4. **New** → fill in the form → **Publish**
5. Wait for the site build to finish (~1–2 minutes)

Filename is generated from the date and title slug (e.g. `2026-09-30-club-meeting.md`).

## Local development (optional)

Cloudflare OAuth functions do **not** run under `npm run dev`. Options:

**A. Test on staging (recommended)** — use your Pages preview URL and `/admin` there.

**B. Local proxy** — in one terminal:

```bash
npm run cms:proxy
```

Temporarily set `local_backend: true` in `public/admin/config.yml` (do **not** leave this enabled for production deploys). In another terminal, run `npm run dev` and open `http://localhost:4321/admin`.

## Troubleshooting

| Problem | Check |
|---------|--------|
| Login window errors | Callback URL matches `https://YOUR-SITE/api/auth` exactly |
| 500 on login | Cloudflare env vars set; redeploy after adding them |
| Publish fails | GitHub user has write access to the repo |
| Build fails after publish | Frontmatter must match `src/content.config.ts` (Decap forms are aligned; avoid hand-editing YAML into invalid shapes) |

## Production (later)

- Move repo to a **cnhsc** GitHub Organization and update `backend.repo` in `config.yml`
- **Private repo:** same OAuth flow; keep `scope: repo` on the OAuth app
- Consider `publish_mode: editorial_workflow` + branch protection on `master` so publishes open PRs for review
