import type { CrooRuntimeConfig } from "../types.js";

export function readCrooConfig(env: NodeJS.ProcessEnv = process.env): CrooRuntimeConfig {
  return {
    apiUrl: env.CROO_API_URL ?? "https://api.croo.network",
    wsUrl: env.CROO_WS_URL ?? "wss://api.croo.network/ws",
    sdkKey: env.CROO_API_KEY ?? env.CROO_SDK_KEY ?? "",
    targetServiceId: env.CROO_TARGET_SERVICE_ID
  };
}

export function validateProviderConfig(config: CrooRuntimeConfig): string[] {
  const errors: string[] = [];

  if (!config.sdkKey || config.sdkKey.includes("replace")) {
    errors.push("CROO_API_KEY is missing. Create an Agent in CROO Dashboard and store its key in local .env.");
  }

  if (!config.apiUrl.startsWith("https://")) {
    errors.push("CROO_API_URL should be an HTTPS URL.");
  }

  if (!config.wsUrl.startsWith("wss://")) {
    errors.push("CROO_WS_URL should be a WSS URL.");
  }

  return errors;
}

export function validateRequesterConfig(config: CrooRuntimeConfig): string[] {
  const errors = validateProviderConfig(config);

  if (!config.targetServiceId || config.targetServiceId.includes("replace")) {
    errors.push("CROO_TARGET_SERVICE_ID is missing. Copy the target service id from CROO Agent Store.");
  }

  return errors;
}
