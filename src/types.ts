export type CrooTrack =
  | "developer_tooling"
  | "research"
  | "data_verification"
  | "creator_ops"
  | "defi_ops"
  | "open";

export type CapIntegrationStatus =
  | "not_started"
  | "template_ready"
  | "provider_online"
  | "requester_verified"
  | "store_listed";

export type ReviewInput = {
  repoUrl: string;
  track?: CrooTrack;
  projectSummary?: string;
  demoVideoUrl?: string;
  capIntegrationStatus?: CapIntegrationStatus;
  listedOnCrooStore?: boolean;
};

export type ReviewReport = {
  score: number;
  blockers: string[];
  quickFixes: string[];
  submissionChecklist: string[];
  capIntegrationNotes: string[];
  demoScript: string;
};

export type ReviewOptions = {
  fetchRepoSignals?: boolean;
};

export type RepoSignals = {
  isGithubUrl: boolean;
  isPublicRepoLikely: boolean;
  hasReadme?: boolean;
  hasLicense?: boolean;
  description?: string;
  defaultBranch?: string;
  fetchError?: string;
};

export type CrooRuntimeConfig = {
  apiUrl: string;
  wsUrl: string;
  sdkKey: string;
  targetServiceId?: string;
};
