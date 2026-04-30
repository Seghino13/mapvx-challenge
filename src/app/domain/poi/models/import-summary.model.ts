export interface ImportSummary {
  imported: number;
  discarded: number;
  reasons: Record<string, number>;
}
