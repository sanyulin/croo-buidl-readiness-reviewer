import { reviewBuidlReadiness } from "../reviewer.js";
import type { ReviewInput, ReviewReport } from "../types.js";

export const SERVICE_NAME = "BUIDL Readiness Reviewer";
export const SERVICE_PRICE_USDC = "0.10";

export const SERVICE_DESCRIPTION =
  "Reviews whether a hackathon BUIDL is ready for CROO Agent Hackathon and DoraHacks submission.";

export const SERVICE_INPUT_SCHEMA = {
  type: "object",
  required: ["repoUrl"],
  properties: {
    repoUrl: {
      type: "string",
      description: "Public GitHub repository URL for the BUIDL."
    },
    track: {
      type: "string",
      description: "CROO hackathon track."
    },
    projectSummary: {
      type: "string",
      description: "Short explanation of what the agent does and why it matters."
    },
    demoVideoUrl: {
      type: "string",
      description: "Sub-5-minute demo video URL."
    }
  }
} as const;

export const SERVICE_OUTPUT_SCHEMA = {
  type: "object",
  required: ["score", "blockers", "quickFixes", "submissionChecklist", "capIntegrationNotes", "demoScript"],
  properties: {
    score: { type: "number" },
    blockers: { type: "array", items: { type: "string" } },
    quickFixes: { type: "array", items: { type: "string" } },
    submissionChecklist: { type: "array", items: { type: "string" } },
    capIntegrationNotes: { type: "array", items: { type: "string" } },
    demoScript: { type: "string" }
  }
} as const;

export async function handleBuidlReview(input: ReviewInput): Promise<ReviewReport> {
  return reviewBuidlReadiness(input, { fetchRepoSignals: false });
}
