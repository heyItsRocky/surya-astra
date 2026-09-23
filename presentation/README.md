# Presentation Pack — Surya-Astra

ISRO BAH 2026 · Problem Statement 15

## Contents

| File | Purpose |
|------|---------|
| `deck-outline.md` | 10-slide outline (fill PPT/PPTX from this) |
| `architecture.svg` | 3-layer architecture diagram for slide 7 |
| `screenshots/` | UI captures for slide 6 / demo backup |
| `../PRESENTATION_SCRIPT.md` | Full talk track + Q&A |

## Generating screenshots

```bash
npm run build && NEXT_PUBLIC_USE_MOCK=true npm start
# open http://localhost:3000 and capture:
#   - hero (3D sun)
#   - dashboard section
#   - mobile nav (<768px)
```

Or use Playwright/headless Chrome against the running server and save PNGs here.

## Status

- [x] Talk track (`PRESENTATION_SCRIPT.md`)
- [x] Deck outline (10 slides)
- [x] Architecture diagram (SVG)
- [ ] Live screenshots (run local server and capture)
- [ ] Final PPTX export (user fills in Canva/PowerPoint)
