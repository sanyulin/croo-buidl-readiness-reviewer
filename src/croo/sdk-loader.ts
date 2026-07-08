type CrooSdkModule = Record<string, unknown>;

export async function loadCrooSdk(): Promise<CrooSdkModule | undefined> {
  try {
    const dynamicImport = new Function("specifier", "return import(specifier)") as (
      specifier: string
    ) => Promise<CrooSdkModule>;

    return await dynamicImport("@croo-network/sdk");
  } catch {
    return undefined;
  }
}

export function explainMissingSdk(): string {
  return [
    "The local project is ready, but @croo-network/sdk is not installed yet.",
    "After you create the CROO Agent in the Dashboard, install the official SDK:",
    "  pnpm add @croo-network/sdk",
    "Then wire handleBuidlReview() into the provider delivery callback from the official CROO example."
  ].join("\n");
}
