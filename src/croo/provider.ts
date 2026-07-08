import { readCrooConfig, validateProviderConfig } from "./config.js";
import {
  SERVICE_DESCRIPTION,
  SERVICE_INPUT_SCHEMA,
  SERVICE_NAME,
  SERVICE_OUTPUT_SCHEMA,
  SERVICE_PRICE_USDC,
  handleBuidlReview
} from "./service.js";
import { explainMissingSdk, loadCrooSdk } from "./sdk-loader.js";

async function main(): Promise<void> {
  const config = readCrooConfig();
  const errors = validateProviderConfig(config);

  if (errors.length > 0) {
    console.log("CROO runtime is not configured yet. This is expected before Dashboard setup.");
    console.log(errors.join("\n"));
    console.log("\nService metadata for CROO Dashboard:");
    console.log(JSON.stringify(serviceMetadata(), null, 2));
    return;
  }

  const sdk = await loadCrooSdk();
  if (!sdk) {
    console.log(explainMissingSdk());
    console.log("\nService metadata for CROO Dashboard:");
    console.log(JSON.stringify(serviceMetadata(), null, 2));
    return;
  }

  console.log("CROO SDK detected. Use the official provider example and call handleBuidlReview() when an order payload arrives.");
  console.log("Loaded SDK exports:", Object.keys(sdk).join(", "));
}

function serviceMetadata(): Record<string, unknown> {
  return {
    name: SERVICE_NAME,
    priceUsdc: SERVICE_PRICE_USDC,
    description: SERVICE_DESCRIPTION,
    inputSchema: SERVICE_INPUT_SCHEMA,
    outputSchema: SERVICE_OUTPUT_SCHEMA,
    handlerExample: {
      input: {
        repoUrl: "https://github.com/example/croo-buidl-readiness-reviewer",
        track: "developer_tooling",
        projectSummary: "A CROO developer tooling agent for BUIDL submission readiness.",
        demoVideoUrl: "https://youtu.be/demo-placeholder"
      }
    }
  };
}

export { handleBuidlReview, serviceMetadata };

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
