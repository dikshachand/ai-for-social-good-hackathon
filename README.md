# CivicPulse

CivicPulse is a local demo app for real-time civic engagement in NYC neighborhoods.

## Run locally

1. Create or activate the local virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

2. Install dependencies:

```bash
npm install
```

3. Start the dev server:

```bash
npm run dev
```

4. Open the local URL shown in your terminal, usually `http://localhost:5173`.

## Build for demo

```bash
npm run build
npm run preview
```

## Demo flow

1. Open the landing page.
2. Click into the onboarding flow.
3. Enter any NYC address.
4. Pick topics.
5. Explore the feed, map, representative panel, calendar, and AI testimony draft.

## Tech

- React 18
- Vite 5
- Plain CSS

## Notes

- This is a front-end prototype with static demo data.
- The current district is mocked to `District 14 - Bronx`.
- A Python virtual environment is included at `.venv` for local project tooling.
