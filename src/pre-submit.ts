import { access, readFile } from "node:fs/promises";
import { reviewBuidlReadiness } from "./reviewer.js";
import type { ReviewInput } from "./types.js";

type Check = {
  name: string;
  ok: boolean;
  detail: string;
};

const REQUIRED_FILES = [
  "README.md",
  "LICENSE",
  ".env.example",
  ".gitignore",
  "package.json",
  "src/reviewer.ts",
  "src/croo/service.ts",
  "submission/dorahacks.md",
  "submission/demo-script.md",
  "submission/feasibility.md",
  "examples/sample-input.json"
];

async function main(): Promise<void> {
  const checks: Check[] = [];

  for (const file of REQUIRED_FILES) {
    checks.push(await checkFileExists(file));
  }

  checks.push(await checkGitIgnore());
  checks.push(await checkNoCommittedSecretPatterns());
  checks.push(await checkSampleReview());

  const failed = checks.filter((check) => !check.ok);
  const verdict = failed.length === 0 ? "CONDITIONALLY_FEASIBLE" : "NEEDS_WORK";

  console.log(JSON.stringify({ verdict, checks, nextHumanActions: nextHumanActions() }, null, 2));

  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

async function checkFileExists(path: string): Promise<Check> {
  try {
    await access(path);
    return { name: `file:${path}`, ok: true, detail: "present" };
  } catch {
    return { name: `file:${path}`, ok: false, detail: "missing" };
  }
}

async function checkGitIgnore(): Promise<Check> {
  const gitignore = await readFile(".gitignore", "utf8");
  const required = [".env", "node_modules/", "dist/"];
  const missing = required.filter((entry) => !gitignore.includes(entry));

  return {
    name: "gitignore:sensitive-and-generated-files",
    ok: missing.length === 0,
    detail: missing.length === 0 ? "env, dependencies, and build output are ignored" : `missing ${missing.join(", ")}`
  };
}

async function checkNoCommittedSecretPatterns(): Promise<Check> {
  const files = [
    ".env.example",
    "README.md",
    "submission/dorahacks.md",
    "submission/demo-script.md",
    "examples/sample-input.json"
  ];

  const suspicious: string[] = [];
  for (const file of files) {
    const text = await readFile(file, "utf8");
    if (/github_pat_[A-Za-z0-9_]+/.test(text)) suspicious.push(`${file}:github_pat`);
    if (/croo_sk_(?!replace|\\.\\.\\.)[A-Za-z0-9_]+/.test(text)) suspicious.push(`${file}:croo_sk`);
    if (/0x[a-fA-F0-9]{64}/.test(text)) suspicious.push(`${file}:private-key-like`);
  }

  return {
    name: "secrets:public-files",
    ok: suspicious.length === 0,
    detail: suspicious.length === 0 ? "no obvious secret patterns in public files" : suspicious.join(", ")
  };
}

async function checkSampleReview(): Promise<Check> {
  const input = JSON.parse(await readFile("examples/sample-input.json", "utf8")) as ReviewInput;
  const report = await reviewBuidlReadiness(input);
  const expectedBlockers = [
    "CAP integration is template-ready only",
    "Agent is not marked as listed on CROO Agent Store yet"
  ];

  const missing = expectedBlockers.filter((part) => !report.blockers.some((blocker) => blocker.includes(part)));

  return {
    name: "reviewer:honest-final-submission-blockers",
    ok: missing.length === 0,
    detail:
      missing.length === 0
        ? "sample correctly flags missing live CAP and CROO Store evidence"
        : `missing blocker text: ${missing.join(", ")}`
  };
}

function nextHumanActions(): string[] {
  return [
    "Keep the public GitHub repository synchronized before final DoraHacks submission.",
    "Verify the YouTube demo link in a logged-out or private browser window.",
    "Register the agent and service in CROO Agent Store.",
    "Store CROO_API_KEY only in local .env, then verify Provider and Requester.",
    "Paste the final repository URL and demo video URL into DoraHacks before the deadline."
  ];
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
