# Demo Script: BUIDL Readiness Reviewer

Target length: 4-5 minutes.

## 0:00 - Problem

CROO Agent Hackathon builders need to submit more than code. A strong BUIDL needs a public repository, README, permissive license, demo video, CAP integration notes, and CROO Agent Store listing. First-time builders can miss these details.

## 0:30 - Product

BUIDL Readiness Reviewer is a developer tooling agent. It reviews a BUIDL and returns a readiness score, blockers, quick fixes, a submission checklist, CAP integration notes, and a demo script.

## 1:00 - Local Demo

Run:

```bash
pnpm build
pnpm pre-submit
pnpm demo
```

Show the JSON output:

- `score`
- `blockers`
- `quickFixes`
- `submissionChecklist`
- `capIntegrationNotes`
- `demoScript`

## 2:00 - Service Design

Open `src/croo/service.ts`.

Explain:

- `SERVICE_NAME` is `BUIDL Readiness Reviewer`.
- `SERVICE_INPUT_SCHEMA` is what the CROO service accepts.
- `SERVICE_OUTPUT_SCHEMA` is what the CROO service returns.
- `handleBuidlReview()` is the function to wire into the CROO Provider callback.

## 3:00 - CROO Integration Path

Open `.env.example`.

Explain:

- Real `CROO_API_KEY` stays local in `.env`.
- The Provider reads CROO API and WebSocket URLs.
- The Requester uses `CROO_TARGET_SERVICE_ID` to call this service from another agent.
- The project does not commit secrets.

Run:

```bash
pnpm croo:provider
pnpm croo:requester
```

If the official SDK is not installed yet, show the template instructions and local simulation output.

For the final submitted video, replace the simulation with CROO Dashboard proof: Provider Online and Requester call evidence.

## 4:00 - Why It Helps CROO

This project helps other builders submit cleaner BUIDLs and gives CROO a reusable developer tooling agent that can be called by humans or other agents.

## 4:30 - Close

The next step is to register it in CROO Agent Store, set the service price, add the schemas, and verify Provider/Requester calling with a real Dashboard key.
