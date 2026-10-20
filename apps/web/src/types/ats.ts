/** ATS scoring result returned by POST /documents/ats-score (apps/api `scoreAtsDocument`). */
export interface AtsBaseScoreResult {
  overallScore: number;
  categoryScores: {
    formatting: number;
    keywords: number;
    structure: number;
    readability: number;
    impact: number;
  };
  strengths: string[];
  criticalIssues: string[];
  improvements: string[];
  improvedHeadline: string;
  improvedSummary: string;
  promptVersion: string;
}
