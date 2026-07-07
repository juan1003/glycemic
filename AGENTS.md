# Glycemic — Agent Guide

Educational prototype that estimates post-meal blood sugar impact from a markdown meal plan using Glycemic Load (GL).

## Medical disclaimer

This is **not** a medical device. Calculations are rough estimates (1 GL ≈ 3 mg/dL rise) and vary by individual. Never use for insulin dosing or clinical decisions. Always defer to a healthcare professional.

## What it does

1. User enters current blood sugar (mg/dL) and uploads a `.md` meal plan.
2. Server parses each line as `- Food: GI, Carbs(g)`.
3. App computes per-item GL, totals, and a predicted post-meal blood sugar.
4. Results are labeled LOW, NORMAL, or HIGH based on predicted value vs. 70–180 mg/dL targets.

## Architecture

```
Browser (public/index.html, client/script.ts → public/script.js)
    │  POST /api/calculate  (multipart: mealPlan file + currentSugar)
    ▼
Express server (src/index.ts)
    └── MealController (src/controllers/mealController.ts)
            └── MealModel (src/models/mealModel.ts)
                    └── shared/meal.ts (types)
```

- **Server:** TypeScript, Express 5, Multer (in-memory uploads), Morgan logging.
- **Client:** Vanilla TypeScript compiled to ES modules (`public/script.js`). Loaded via `<script type="module">`.
- **Shared types:** [`shared/meal.ts`](shared/meal.ts) — `MealItem`, `MealSummary`, `CalculateResponse`, etc.

## Key formulas

- `GL = (GI × Carbs) / 100`
- `Estimated rise = Total GL × 3` (mg/dL)
- `Predicted sugar = Current sugar + Estimated rise`
- Status: HIGH if predicted > 180, LOW if predicted < 70, otherwise NORMAL

## Project layout

| Path | Purpose |
|------|---------|
| `src/index.ts` | Express app entry, static files, `/api/calculate` route |
| `src/controllers/mealController.ts` | Request validation and JSON responses |
| `src/models/mealModel.ts` | Markdown parsing and GL/prediction logic |
| `shared/meal.ts` | Shared TypeScript interfaces |
| `client/script.ts` | Browser UI logic (edit this, not `public/script.js`) |
| `public/` | Static assets (`index.html`, `style.css`, generated `script.js`) |
| `test_meal_plan.md` | Sample meal plan for manual testing |

## Commands

```bash
npm install
npm start          # builds via prestart, serves on PORT (default 3000)
npm run build      # compile server → dist/ and client → public/script.js
npm test           # node:test unit tests (model + controller)
PORT=8080 npm start
```

## API

**POST `/api/calculate`** — `multipart/form-data`

| Field | Type | Rules |
|-------|------|-------|
| `mealPlan` | file | Required; markdown with parseable food lines |
| `currentSugar` | string/number | Required; finite number 1–600 |

**Success (200):**

```json
{
  "success": true,
  "summary": {
    "mealData": [{ "food": "...", "gi": 51, "carbs": 12, "gl": 6.1 }],
    "totalGL": "6.1",
    "totalCarbs": 12,
    "prediction": {
      "initialSugar": 120,
      "estimatedRise": 18,
      "predictedSugar": 138,
      "status": "TARGET / NORMAL"
    }
  },
  "disclaimer": "This is a rough estimation and NOT medical advice."
}
```

**Errors (400):** `{ "error": "..." }` — missing file, invalid sugar, or no parseable food entries.

## Meal plan format

```markdown
- Scrambled Eggs: 0, 1g
- Whole Grain Bread: 51, 12g
- Avocado: 15, 2g
```

Regex accepts optional leading `-`, food name, `:`, GI, comma, carbs (optional `g` suffix).

## Build notes

- Server compiles with `tsconfig.json` → `dist/src/`.
- Client compiles with `tsconfig.client.json` → `public/client/script.js`, then postbuild moves to `public/script.js`.
- `dist/` and `public/script.js` are gitignored; run `npm run build` before serving if not using `npm start`.
- Client script **must** load as `type="module"` because the compiled output uses ES module syntax.

## Conventions for agents

- Keep changes minimal and match existing patterns (controller/model split, shared types).
- Edit `client/script.ts` for frontend logic; never hand-edit `public/script.js`.
- Add or update tests in `src/**/*.test.ts` when changing parsing, validation, or calculation logic.
- Do not weaken medical disclaimers or present output as clinical advice.
- UI uses a clinical white/silver theme in `public/style.css`.

## Tests

- `src/models/mealModel.test.ts` — parsing, GL math, status thresholds
- `src/controllers/mealController.test.ts` — HTTP validation (400/200 cases)

Run with `npm test`.
