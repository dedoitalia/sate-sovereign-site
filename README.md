# SATE Sovereign — Landing Page

Static landing page for **SATE Sovereign**, the EU-sovereign AI inference service from SATE S.r.l. (sate.eu).

## Stack
- Single-file HTML (no build step)
- Embedded CSS, no JS framework
- Google Fonts: Inter, JetBrains Mono

## Deploy
This repository is configured for [Render](https://render.com) static site hosting.
- Publish directory: `.` (repo root)
- Build command: _(none)_
- Auto-deploy: on push to `main`

## Local preview
```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Custom domain
Production target: `sate-sovereign.eu` or `ai.sate.eu`. Configure CNAME in Render dashboard.

---
© 2026 SATE S.r.l. — Serravalle Pistoiese (PT), Italia
