# Launching on GitHub Pages

Two features need a server and will NOT work on GitHub Pages alone:
the contact form delivering leads, and live Google reviews. Everything
else works fully. See "The two server bits" at the bottom.

---

## Step 1 — cut the last cord to the old site (on your machine)

```bash
npm install
npm run media:vendor     # downloads the ~34 images + hero video, rewrites refs
npm run build
```

Then edit `_headers` and `vercel.json` and remove `https://dcmdlaw.com`
from the `img-src` line. Now nothing resolves to the old WordPress site.

Confirm it's clean:
```bash
grep -r dcmdlaw.com site/    # should print nothing
```

---

## Step 2 — pick a deploy method

### A) Simplest: publish the built folder

```bash
cd site
git init && git add -A && git commit -m "Launch"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/REPO.git
git push -u origin main
```
GitHub → **Settings → Pages → Source: Deploy from a branch → main / (root)**.
Live at `https://YOUR-USERNAME.github.io/REPO/` in ~1 min.

### B) Recommended: push the project, let CI build

Push the whole project (the folder with `package.json`):
```bash
git init && git add -A && git commit -m "Launch"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/REPO.git
git push -u origin main
```
GitHub → **Settings → Pages → Source: GitHub Actions**.
The included `.github/workflows/deploy.yml` builds and deploys on every push.

---

## Step 3 — custom domain (dcmdlaw.com)

To serve this at your real domain instead of the github.io URL:

1. GitHub → **Settings → Pages → Custom domain** → enter `dcmdlaw.com` → Save.
   (This creates a `CNAME` file in the repo — keep it.)
2. At your DNS provider, point the domain at GitHub Pages:
   - Four `A` records for the apex `dcmdlaw.com`:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - One `CNAME` for `www` → `YOUR-USERNAME.github.io`
3. Back in Settings → Pages, tick **Enforce HTTPS** (after DNS propagates,
   usually under an hour).

Only cut DNS over once you've confirmed the github.io version looks right.
That's your zero-downtime switch: the new site is fully live and tested
before the domain ever points at it.

---

## The two server bits (contact form + live reviews)

GitHub Pages can't run the `/api/` functions. Options:

- **Easiest — deploy to Netlify or Vercel instead of Pages.** Both run the
  `/api/` functions as-is; `netlify.toml` and `vercel.json` are already in
  the repo. Connect the repo, set the env vars from `.env.example`, done.
  You still get a free static host, plus the form and reviews work.
- **Stay on Pages, offload the two functions.** Point the contact form at a
  form service (Formspree, Basin) and reviews at a tiny serverless function
  elsewhere. More setup; see TECHNICAL-MANUAL §5 and §6.
- **Launch without them for now.** The form shows its success state but
  emails nobody; reviews show the bundled sample set. Wire them up later.

For a law firm that lives on intake calls and reviews, I'd deploy to
Netlify or Vercel rather than Pages — same free tier, but the lead form
actually delivers. The steps are nearly identical; the difference is those
two features work on day one.
