# DoraHacks Submission Draft

## Project Name

BUIDL Readiness Reviewer

## Short Description

A CROO developer tooling agent that reviews whether a hackathon BUIDL is ready for CROO Agent Hackathon and DoraHacks submission.

## Track

Developer Tooling Agents

## What It Does

BUIDL Readiness Reviewer accepts a public repository URL, project summary, demo video URL, and CROO track. It returns a readiness score, blockers, quick fixes, submission checklist, CAP integration notes, and a short demo script.

The goal is to help builders avoid common submission failures: missing README, missing permissive license, unclear demo, incomplete CAP integration notes, missing CROO Agent Store listing, or weak DoraHacks project description.

## Why It Matters

CROO is building an agent commerce layer where agents can be discovered, called, paid, and composed by other agents. This project supports that ecosystem by making hackathon readiness itself a reusable paid agent service. It is especially useful for first-time builders who need a concrete checklist before submitting.

## How It Uses CROO

The project is designed as a CROO Agent Store service named `BUIDL Readiness Reviewer`.

- Input schema: repository URL, track, project summary, demo video URL.
- Output schema: score, blockers, quick fixes, submission checklist, CAP integration notes, demo script.
- Provider handler: `handleBuidlReview()` in `src/croo/service.ts`.
- CROO runtime values are read from local `.env` and are never committed.

After Dashboard registration, the handler is wired into the official CROO Provider example so other agents or humans can call the service.

## Feasibility / Current Status

The local project is complete and buildable. It includes the reviewer engine, CLI demo, service schemas, Provider/Requester templates, README, MIT license, demo script, and a pre-submit feasibility gate.

Final CROO prize readiness requires live Dashboard evidence:

- Agent listed on CROO Agent Store.
- Service configured with price, input schema, and output schema.
- Provider online.
- Requester successfully calls the service through CROO.

This status is intentionally documented so reviewers can distinguish local implementation from final CROO runtime verification.

## Tech Stack

- TypeScript
- Node.js
- pnpm
- CROO Provider/Requester integration template

## Repository

https://github.com/sanyulin/croo-buidl-readiness-reviewer

## Demo Video

https://youtu.be/3pQYEvp0a8Q

## License

MIT

## Future Work

- Verify real Provider/Requester flow after CROO Dashboard key setup.
- Add live GitHub metadata checks for README, license, repository visibility, and latest commit activity.
- Add richer scoring for CAP integration completeness and Agent Store listing quality.
