import { readFile } from "node:fs/promises";
import { reviewBuidlReadiness } from "./reviewer.js";
import type { ReviewInput } from "./types.js";

const HELP = `BUIDL Readiness Reviewer

Usage:
  node dist/cli.js examples/sample-input.json
  node dist/cli.js --fetch examples/sample-input.json

Options:
  --fetch    Check public GitHub repository metadata through the GitHub API.
  --help    Show this help text.
`;

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.length === 0) {
    console.log(HELP);
    return;
  }

  const fetchRepoSignals = args.includes("--fetch");
  const inputPath = args.find((arg) => !arg.startsWith("--"));

  if (!inputPath) {
    throw new Error("Missing input JSON path. Run with --help for usage.");
  }

  const input = await readJsonInput(inputPath);
  const report = await reviewBuidlReadiness(input, { fetchRepoSignals });

  console.log(JSON.stringify(report, null, 2));
}

async function readJsonInput(path: string): Promise<ReviewInput> {
  const raw = await readFile(path, "utf8");
  const parsed = JSON.parse(raw) as Partial<ReviewInput>;

  if (typeof parsed.repoUrl !== "string") {
    throw new Error("Input JSON must include repoUrl as a string.");
  }

  return parsed as ReviewInput;
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
