import type { ReviewInput, ReviewOptions, ReviewReport, RepoSignals } from "./types.js";

const CROO_REQUIREMENTS = [
  "Listed on CROO Agent Store",
  "Integrated with CAP so the agent is callable and can settle on-chain",
  "Open-source public repository with MIT, Apache 2.0, or similar permissive license",
  "README with setup instructions, SDK methods used, and integration notes",
  "Demo video under five minutes",
  "DoraHacks BUIDL form completed before the deadline"
];

const TRACK_LABELS: Record<string, string> = {
  developer_tooling: "Developer Tooling Agents",
  research: "Research & Intelligence Agents",
  data_verification: "Data & Verification Agents",
  creator_ops: "Creator & Content Ops Agents",
  defi_ops: "DeFi / On-chain Ops Agents",
  open: "Open - Any A2A Agents"
};

export async function reviewBuidlReadiness(
  input: ReviewInput,
  options: ReviewOptions = {}
): Promise<ReviewReport> {
  const normalizedInput = normalizeInput(input);
  const repoSignals = options.fetchRepoSignals
    ? await fetchRepositorySignals(normalizedInput.repoUrl)
    : inferRepositorySignals(normalizedInput.repoUrl);

  const blockers = collectBlockers(normalizedInput, repoSignals);
  const quickFixes = collectQuickFixes(normalizedInput, repoSignals);
  const score = calculateScore(normalizedInput, repoSignals, blockers);

  return {
    score,
    blockers,
    quickFixes,
    submissionChecklist: buildSubmissionChecklist(normalizedInput, repoSignals),
    capIntegrationNotes: buildCapIntegrationNotes(normalizedInput),
    demoScript: buildDemoScript(normalizedInput, score)
  };
}

export function normalizeInput(input: ReviewInput): ReviewInput {
  return {
    repoUrl: input.repoUrl?.trim() ?? "",
    track: input.track ?? "developer_tooling",
    projectSummary: input.projectSummary?.trim(),
    demoVideoUrl: input.demoVideoUrl?.trim(),
    capIntegrationStatus: input.capIntegrationStatus ?? "not_started",
    listedOnCrooStore: input.listedOnCrooStore ?? false
  };
}

function inferRepositorySignals(repoUrl: string): RepoSignals {
  const isGithubUrl = /^https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/?$/i.test(repoUrl);

  return {
    isGithubUrl,
    isPublicRepoLikely: isGithubUrl
  };
}

async function fetchRepositorySignals(repoUrl: string): Promise<RepoSignals> {
  const inferred = inferRepositorySignals(repoUrl);
  if (!inferred.isGithubUrl) {
    return inferred;
  }

  const match = repoUrl.match(/^https:\/\/github\.com\/([^/\s]+)\/([^/\s]+)\/?$/i);
  if (!match) {
    return inferred;
  }

  const [, owner, rawRepo] = match;
  const repo = rawRepo.replace(/\.git$/i, "");
  const apiBase = `https://api.github.com/repos/${owner}/${repo}`;

  try {
    const repoResponse = await fetch(apiBase, {
      headers: { Accept: "application/vnd.github+json" }
    });

    if (!repoResponse.ok) {
      return {
        ...inferred,
        isPublicRepoLikely: false,
        fetchError: `GitHub repository check failed with HTTP ${repoResponse.status}`
      };
    }

    const repoJson = (await repoResponse.json()) as {
      private?: boolean;
      description?: string | null;
      default_branch?: string;
      license?: { key?: string } | null;
    };

    const readmeResponse = await fetch(`${apiBase}/readme`, {
      headers: { Accept: "application/vnd.github+json" }
    });

    return {
      isGithubUrl: true,
      isPublicRepoLikely: repoJson.private === false,
      hasReadme: readmeResponse.ok,
      hasLicense: Boolean(repoJson.license?.key),
      description: repoJson.description ?? undefined,
      defaultBranch: repoJson.default_branch
    };
  } catch (error) {
    return {
      ...inferred,
      fetchError: error instanceof Error ? error.message : "Unknown repository fetch error"
    };
  }
}

function collectBlockers(input: ReviewInput, repoSignals: RepoSignals): string[] {
  const blockers: string[] = [];

  if (!input.repoUrl) {
    blockers.push("Missing public repository URL.");
  } else if (!repoSignals.isGithubUrl) {
    blockers.push("Repository URL should be a clean public GitHub URL for easiest judging.");
  }

  if (repoSignals.isPublicRepoLikely === false) {
    blockers.push("Repository does not appear to be public or accessible.");
  }

  if (repoSignals.hasReadme === false) {
    blockers.push("GitHub repository does not expose a README.");
  }

  if (repoSignals.hasLicense === false) {
    blockers.push("GitHub repository does not expose a license.");
  }

  if (!input.demoVideoUrl) {
    blockers.push("Missing demo video URL.");
  }

  if (!input.projectSummary || input.projectSummary.length < 80) {
    blockers.push("Project summary is too short for judges to understand the agent and its CROO value.");
  }

  if (input.capIntegrationStatus === "not_started") {
    blockers.push("CAP integration has not started. At minimum, include the provider/requester template and integration notes.");
  }

  if (input.capIntegrationStatus === "template_ready") {
    blockers.push("CAP integration is template-ready only. Final submission still needs Provider online or Requester verification evidence.");
  }

  if (input.capIntegrationStatus === "provider_online") {
    blockers.push("Provider is online, but Requester verification evidence is still missing.");
  }

  if (!input.listedOnCrooStore) {
    blockers.push("Agent is not marked as listed on CROO Agent Store yet.");
  }

  return blockers;
}

function collectQuickFixes(input: ReviewInput, repoSignals: RepoSignals): string[] {
  const fixes: string[] = [];

  if (!repoSignals.isGithubUrl) {
    fixes.push("Create a public GitHub repository and use its HTTPS URL in the DoraHacks BUIDL form.");
  }

  if (repoSignals.hasReadme === false) {
    fixes.push("Add a README with quick start, service input/output, CROO setup, and demo steps.");
  }

  if (repoSignals.hasLicense === false) {
    fixes.push("Add an MIT or Apache 2.0 license file at the repository root.");
  }

  if (repoSignals.hasReadme === undefined || repoSignals.hasLicense === undefined) {
    fixes.push("After the repository is public, run the CLI with --fetch to verify README and license metadata through GitHub.");
  }

  if (!input.demoVideoUrl) {
    fixes.push("Record a sub-5-minute demo: CLI review, sample output, and CROO Provider/Requester integration path.");
  }

  if (input.capIntegrationStatus !== "requester_verified" && input.capIntegrationStatus !== "store_listed") {
    fixes.push("After creating the Agent in CROO Dashboard, put CROO_SDK_KEY in local .env and run Provider/Requester verification.");
    fixes.push("Capture evidence that the Provider is Online and that a Requester can call the service.");
  }

  if (!input.listedOnCrooStore) {
    fixes.push("Register the agent in CROO Agent Store and add its service name, price, description, input schema, and output schema.");
  }

  if (repoSignals.fetchError) {
    fixes.push(`Repository signal check was inconclusive: ${repoSignals.fetchError}`);
  }

  return fixes;
}

function calculateScore(input: ReviewInput, repoSignals: RepoSignals, blockers: string[]): number {
  let score = 100;

  score -= blockers.length * 12;

  if (repoSignals.isGithubUrl) score += 4;
  if (repoSignals.hasReadme) score += 6;
  if (repoSignals.hasLicense) score += 6;
  if (input.demoVideoUrl) score += 8;
  if (input.capIntegrationStatus === "template_ready") score += 8;
  if (input.capIntegrationStatus === "provider_online") score += 14;
  if (input.capIntegrationStatus === "requester_verified") score += 20;
  if (input.capIntegrationStatus === "store_listed" || input.listedOnCrooStore) score += 24;

  if (repoSignals.hasReadme === undefined || repoSignals.hasLicense === undefined) {
    score = Math.min(score, 94);
  }

  if (blockers.length > 0) {
    score = Math.min(score, 92 - blockers.length * 6);
  }

  return Math.max(0, Math.min(100, score));
}

function buildSubmissionChecklist(input: ReviewInput, repoSignals: RepoSignals): string[] {
  const track = TRACK_LABELS[input.track ?? "developer_tooling"] ?? TRACK_LABELS.developer_tooling;

  return [
    `Track selected: ${track}.`,
    `Repository: ${input.repoUrl || "TODO: add public repository URL"}.`,
    `Repository appears public: ${repoSignals.isPublicRepoLikely ? "yes" : "needs confirmation"}.`,
    `README present: ${repoSignals.hasReadme === undefined ? "not checked locally" : repoSignals.hasReadme ? "yes" : "no"}.`,
    `License present: ${repoSignals.hasLicense === undefined ? "not checked locally" : repoSignals.hasLicense ? "yes" : "no"}.`,
    `Demo video: ${input.demoVideoUrl || "TODO: record and add demo URL"}.`,
    `CAP status: ${input.capIntegrationStatus}.`,
    `CROO Agent Store listed: ${input.listedOnCrooStore ? "yes" : "not yet"}.`,
    ...CROO_REQUIREMENTS.map((item) => `CROO requirement: ${item}.`)
  ];
}

function buildCapIntegrationNotes(input: ReviewInput): string[] {
  return [
    "Create a CROO account at agent.croo.network.",
    "Register this agent and copy the CROO SDK key once; store it only in local .env.",
    "Configure one paid service named BUIDL Readiness Reviewer.",
    "Use input fields: repoUrl, projectSummary, demoVideoUrl, track.",
    "Use output fields: score, blockers, quickFixes, submissionChecklist, capIntegrationNotes, demoScript.",
    "Run pnpm build, then run pnpm croo:provider after .env is configured.",
    "Use a second requester agent and CROO_TARGET_SERVICE_ID to verify agent-to-agent calling.",
    "For final DoraHacks submission, include proof that the service is callable through CROO, not only a local template.",
    `Current local CAP status is ${input.capIntegrationStatus}.`
  ];
}

function buildDemoScript(input: ReviewInput, score: number): string {
  const summary = input.projectSummary ?? "This agent reviews whether a CROO hackathon BUIDL is ready for submission.";

  return [
    "0:00 - Problem: CROO builders can miss submission requirements such as public repo, README, license, CAP notes, demo video, and Agent Store listing.",
    `0:30 - Solution: BUIDL Readiness Reviewer checks a project and returns a readiness score. Current sample score: ${score}.`,
    `1:15 - Input: repoUrl=${input.repoUrl || "<repo-url>"}, track=${input.track ?? "developer_tooling"}, demoVideoUrl=${input.demoVideoUrl ?? "<demo-url>"}.`,
    `2:00 - Agent output: blockers, quick fixes, submission checklist, CAP integration notes, and a generated demo script. Project summary: ${summary}`,
    "3:00 - CROO path: register agent, configure service, set CROO_SDK_KEY in .env, run provider, then verify with requester.",
    "4:15 - Closing: the agent helps teams ship cleaner BUIDLs and gives CROO a reusable developer tooling service for hackathon participants."
  ].join("\n");
}
