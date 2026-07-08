# BUIDL Readiness Reviewer

> A CROO developer tooling agent that reviews whether a hackathon BUIDL is ready for DoraHacks and CROO Agent Hackathon submission.

## Why This Exists

CROO Agent Hackathon submissions need more than a good idea. A project should have a public repository, permissive license, README, demo video, CAP integration path, and CROO Agent Store listing. New builders often miss one of these details under deadline pressure.

BUIDL Readiness Reviewer turns those requirements into a callable agent service. It accepts a repository URL and short project details, then returns a readiness score, blockers, quick fixes, submission checklist, CAP integration notes, and a short demo script.

## Quick Start

Prerequisites:

- Node.js 18+
- pnpm 9+

Install and build:

```bash
pnpm install
pnpm build
```

If you are running inside a Codex Windows workspace where `node` is not in PATH, prepend the bundled runtime for the current terminal:

```powershell
$env:PATH="C:\Users\三雨林\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;" + $env:PATH
& "C:\Users\三雨林\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd" install
& "C:\Users\三雨林\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd" build
```

Run the local demo:

```bash
pnpm demo
```

Run the submission feasibility gate:

```bash
pnpm pre-submit
```

Run with your own input:

```bash
node dist/cli.js examples/sample-input.json
```

Optional public GitHub metadata check:

```bash
node dist/cli.js --fetch examples/sample-input.json
```

## Input

```json
{
  "repoUrl": "https://github.com/example/croo-buidl-readiness-reviewer",
  "track": "developer_tooling",
  "projectSummary": "A CROO developer tooling agent that checks whether a hackathon BUIDL has the core assets required for DoraHacks submission.",
  "demoVideoUrl": "https://youtu.be/demo-placeholder",
  "capIntegrationStatus": "template_ready",
  "listedOnCrooStore": false
}
```

## Output

```ts
type ReviewReport = {
  score: number;
  blockers: string[];
  quickFixes: string[];
  submissionChecklist: string[];
  capIntegrationNotes: string[];
  demoScript: string;
};
```

## CROO Agent Store Setup

Create an agent in the CROO Dashboard and configure this service:

| Field | Value |
|---|---|
| Service name | `BUIDL Readiness Reviewer` |
| Price | `0.10 USDC` or the minimum accepted by the Dashboard |
| Category | Developer Tooling Agents |
| Description | Reviews whether a hackathon BUIDL is ready for CROO and DoraHacks submission. |
| Input schema | Use `SERVICE_INPUT_SCHEMA` from `src/croo/service.ts` |
| Output schema | Use `SERVICE_OUTPUT_SCHEMA` from `src/croo/service.ts` |

Copy `.env.example` to `.env` locally and fill values from the Dashboard. Do not commit `.env`.

```bash
CROO_API_URL=https://api.croo.network
CROO_WS_URL=wss://api.croo.network/ws
CROO_SDK_KEY=croo_sk_replace_with_dashboard_key
CROO_TARGET_SERVICE_ID=replace_with_target_service_id
```

Provider template:

```bash
pnpm build
pnpm croo:provider
```

Requester template:

```bash
pnpm croo:requester
```

The repository includes a safe local provider/requester template. After you create the real CROO Agent and install the official SDK, wire `handleBuidlReview()` from `src/croo/service.ts` into the official provider delivery callback.

## Feasibility Status

Current status: conditionally feasible.

The local project is ready for GitHub packaging and demo preparation. Final prize eligibility still depends on human-controlled CROO steps:

- Register the agent in CROO Agent Store.
- Configure a paid callable service.
- Put the real `CROO_SDK_KEY` only in local `.env`.
- Verify Provider Online and Requester call evidence.
- Submit the final GitHub and demo video links to DoraHacks.

See `submission/feasibility.md` for the full feasibility review.

## Demo Flow

1. Show the project problem: hackathon builders miss submission requirements.
2. Run `pnpm demo`.
3. Explain the score, blockers, quick fixes, checklist, and CAP notes.
4. Show `src/croo/service.ts` as the reusable service handler.
5. Show `.env.example` and explain that real keys stay local.
6. Close with how this helps CROO builders submit cleaner BUIDLs.

## Security

- Do not put GitHub tokens, CROO SDK keys, wallet private keys, or seed phrases in chat, code, README, screenshots, or commits.
- `.env` is ignored by git.
- `.env.example` contains placeholders only.

## License

MIT
