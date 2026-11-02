# KV Freight Group: scroll hero + AI suite
**What this project is:** a fictional-brand freight company showcase that doubles as Nikhil Chary Sriramoju's full-stack AI portfolio piece. A scroll-scrubbed video hero (reach-stacker loads a truck), a services strip, an agentic RAG copilot, a demo CNN, credentials and projects sections, a contact form, a Vercel serverless backend, Docker and CI.

Fictional brand. Designed and built by Nikhil Chary Sriramoju.
Files: `index.html`, `style.css`, `app.js`, `Dockerfile`, `nginx.conf`, `.github/workflows/pages.yml`.

## Deploy on GitHub Pages
1. Create a repo (e.g. `kv-freight`) on github.com, public.
2. Unzip, then in the folder: `git init && git add -A && git commit -m "KV freight" && git branch -M main`
3. `git remote add origin https://github.com/Nikhil-creat/kv-freight.git && git push -u origin main`
4. Repo → Settings → Pages → Source: **GitHub Actions**. The workflow deploys on every push to `main`.
5. Site: `https://nikhil-creat.github.io/kv-freight/` (allow 1–2 minutes). Phone (Termux): same commands after `pkg install git`.

## Docker
`docker build -t kv-freight . && docker run -p 8080:8080 kv-freight` → http://localhost:8080 (non-root nginx, security headers).

## What is inside
- Scroll-scrubbed hero per the brief (sticky scene, `mix-blend-mode: darken` giant letters, blue-to-white card sweep, KM/H readout, `?rec=1` recorder mode).
- Copilot: planner → tools (quote, track) or TF-IDF RAG over a built-in knowledge base; LLM answers come from the serverless `/api/chat` (Groq key stays server-side).
- Demo CNN: conv(4 fixed kernels) → ReLU → maxpool → dense, in the browser.
- Security: strict CSP, no inline JS, textContent output, input caps, rate limit, injection/restricted-cargo guardrails.

## Limitations
- Quotes, tracking and the CNN are demos with fictional data; the CNN is untrained and not an inspection tool.
- Fonts load from Google Fonts. To self-host, download latin woff2 files for Anton, Archivo and JetBrains Mono, add `@font-face` in `style.css`, and remove the Google URLs from the CSP.
- Video is streamed from the provided CDN URLs; if they expire, replace them in `app.js` and the CSP.
- A browser-held API key is visible to anyone using that browser; for production put the LLM call behind your own server.

## Backend (Vercel serverless)
`api/chat.js` proxies Groq (validation, 10 req/min per IP best-effort, 15 s timeout). `api/contact.js` validates the form (honeypot, length caps) and forwards to `CONTACT_WEBHOOK_URL` (Discord/Slack/Formspree-style JSON webhook); without it, messages only appear in Vercel logs.
Env vars: `GROQ_API_KEY` (required for LLM answers), `GROQ_MODEL` (optional), `CONTACT_WEBHOOK_URL` (optional). Without them the copilot answers locally and the form shows an email fallback.
GitHub Pages serves only the static frontend, so `/api` works on Vercel, not on Pages. Rate limiting is per serverless instance; use Vercel WAF or Upstash for strict limits.

## Deploy on Vercel
1. Push to GitHub (steps above). 2. vercel.com → Add New → Project → import `kv-freight`. 3. Framework: Other; leave build/output blank. 4. Settings → Environment Variables: add `GROQ_API_KEY` (and optional ones), then Deploy. 5. Redeploy after changing env vars.

## Developer checklist
- `npm test` runs API tests (validation, honeypot, rate limit, no-key fallback). `npm run check` syntax-checks all JS. CI runs both on every push.
- Local full-stack: `npx vercel dev` (frontend + `/api`). Health: `/api/health`.
- Extras: SEO/OG/JSON-LD, PWA manifest, favicon, robots.txt, `.well-known/security.txt`, 404 page, skip link, focus styles, reduced-motion support.
- After deploy, add your real URL to `og:url`/sitemap if you want link previews with images (add a 1200x630 `og.png`).

## Free deploy path (GitHub then Vercel Hobby)
Vercel Hobby is free for personal, non-commercial use. GitHub Pages is a free static fallback (no `/api`).

## Architecture
Browser (static hero, RAG copilot, board) -> `/api/chat` -> `api/_llm.js` -> Groq (models auto-detected via `/models`) -> Gemini (`generateContent`, auto-detected) -> local RAG fallback in the browser.
Add `GROQ_API_KEY` and/or `GEMINI_API_KEY` in Vercel. Models are detected per provider, cached 10 minutes, and failover is automatic. Set `GROQ_MODEL` / `GEMINI_MODEL` only to force one. Check `/api/health?deep=1`.
