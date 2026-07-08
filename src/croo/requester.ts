import { readCrooConfig, validateRequesterConfig } from "./config.js";
import { handleBuidlReview } from "./service.js";
import { explainMissingSdk, loadCrooSdk } from "./sdk-loader.js";
import type { ReviewInput } from "../types.js";

async function main(): Promise<void> {
  const config = readCrooConfig();
  const errors = validateRequesterConfig(config);

  if (errors.length > 0) {
    console.log("CROO runtime is not configured yet. This is expected before Dashboard setup.");
    console.log(errors.join("\n"));
    console.log("\nLocal requester simulation output:");
    console.log(JSON.stringify(await handleBuidlReview(localRequesterInput()), null, 2));
    return;
  }

  const input = localRequesterInput();

  const sdk = await loadCrooSdk();
  if (!sdk) {
    console.log(explainMissingSdk());
    console.log("\nLocal requester simulation output:");
    console.log(JSON.stringify(await handleBuidlReview(input), null, 2));
    return;
  }

  console.log("CROO SDK detected. Use the official requester example with CROO_TARGET_SERVICE_ID.");
  console.log("Loaded SDK exports:", Object.keys(sdk).join(", "));
  console.log("\nLocal payload preview:");
  console.log(JSON.stringify(input, null, 2));
}

function localRequesterInput(): ReviewInput {
  return {
    repoUrl: process.env.CROO_REVIEW_REPO_URL ?? "https://github.com/sanyulin/croo-buidl-readiness-reviewer",
    track: "developer_tooling",
    projectSummary:
      process.env.CROO_REVIEW_PROJECT_SUMMARY ??
      "A CROO developer tooling agent that reviews whether hackathon BUIDLs are ready for DoraHacks submission, including repository, README, license, demo, CAP evidence, and Agent Store readiness.",
    demoVideoUrl: process.env.CROO_REVIEW_DEMO_VIDEO_URL ?? "https://youtu.be/2pDs31dVGZs",
    capIntegrationStatus: "requester_verified",
    listedOnCrooStore: true
  };
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
