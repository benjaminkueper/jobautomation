// ─── Job Pipeline Statuses ─────────────────────────────────────────────────────

export const JOB_STATUSES = [
  "New",
  "Research",
  "Drafting",
  "Ready to Apply",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
  "Archived",
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export const JOB_STATUS_COLORS: Record<JobStatus, string> = {
  New:            "bg-slate-100 text-slate-700",
  Research:       "bg-blue-100 text-blue-700",
  Drafting:       "bg-yellow-100 text-yellow-700",
  "Ready to Apply": "bg-[rgba(253,162,1,0.16)] text-[#8A5A00]",
  Applied:        "bg-[rgba(1,59,42,0.1)] text-[#013B2A]",
  Interview:      "bg-orange-100 text-orange-700",
  Offer:          "bg-green-100 text-green-700",
  Rejected:       "bg-red-100 text-red-700",
  Archived:       "bg-gray-100 text-gray-500",
};

// ─── Application Statuses ─────────────────────────────────────────────────────

export const APPLICATION_STATUSES = [
  "Pending",
  "Submitted",
  "Under Review",
  "Phone Screen",
  "Technical Interview",
  "Final Interview",
  "Offer Received",
  "Accepted",
  "Declined",
  "Withdrawn",
  "Rejected",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

// ─── Automation Module Statuses ───────────────────────────────────────────────

export const AUTOMATION_STATUSES = [
  "Active",
  "Paused",
  "Failed",
  "Needs Setup",
] as const;

export type AutomationStatus = (typeof AUTOMATION_STATUSES)[number];

export const AUTOMATION_STATUS_COLORS: Record<AutomationStatus, string> = {
  Active:        "bg-green-100 text-green-700",
  Paused:        "bg-yellow-100 text-yellow-700",
  Failed:        "bg-red-100 text-red-700",
  "Needs Setup": "bg-slate-100 text-slate-600",
};

// ─── Contact Statuses ─────────────────────────────────────────────────────────

export const CONTACT_TYPES = [
  "Recruiter",
  "Hiring Manager",
  "Referral",
  "Networking",
  "Other",
] as const;

export type ContactType = (typeof CONTACT_TYPES)[number];

// ─── Document Statuses ────────────────────────────────────────────────────────

export const DOCUMENT_STATUSES = [
  "Draft",
  "Ready",
  "Sent",
  "Archived",
] as const;

export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number];

export const DOCUMENT_TYPES = [
  "CV",
  "Cover Letter",
  "Research",
  "Follow-Up Email",
  "Thank You Note",
  "Other",
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];
