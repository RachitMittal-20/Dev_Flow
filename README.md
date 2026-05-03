# DevFlow - Developer Productivity MVP

DevFlow turns a small set of engineering delivery metrics into a more usable story for both individual contributors and managers. The app pairs raw numbers with interpretation, signals, and suggested next steps so the dashboard feels actionable instead of purely descriptive.

## How to Run

1. Run `npm run install:all`
2. Run `npm run dev`
3. Open `http://localhost:3000`

## Metrics Overview

- Lead Time: Average days from PR opened to successful production deployment.
- Cycle Time: Average days from issue moved to In Progress until marked Done.
- PR Throughput: Count of merged pull requests in the selected month.
- Deployment Frequency: Count of successful production deployments in the selected month.
- Bug Rate: Escaped production bugs found divided by issues completed in the selected month.

The backend uses the pre-computed values embedded in `backend/data/seed.js`, which were derived from the formulas described in the build specification.

## Architecture

- Frontend: React 18 + Vite + React Router, styled with Tailwind CSS and CSS variables.
- Backend: Node.js + Express with JSON endpoints for developers, IC metrics, manager summaries, and months.
- Data layer: Embedded JavaScript objects with no external database.

## Trade-offs

- Mock data instead of a real database keeps the MVP fast to run and easy to review, but it does not model live ingestion or persistence.
- Pre-computed metrics keep the backend simple and deterministic, but they avoid the complexity of calculating trends from raw source records at request time.
