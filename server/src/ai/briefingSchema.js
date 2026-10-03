import { z } from 'zod';

export const briefingSchema = z.object({
  clientSummary: z.string(),

  portfolioHighlights: z.array(
    z.object({
      finding: z.string(),
      evidence: z.string(),
    }),
  ),

  attentionItems: z.array(
    z.object({
      priority: z.enum(['high', 'medium', 'low']),
      finding: z.string(),
      evidence: z.string(),
    }),
  ),

  onboarding: z.object({
    status: z.enum([
      'complete',
      'in_progress',
      'not_available',
    ]),
    missing: z.array(z.string()),
    pending: z.array(z.string()),
  }),

  questionsForClient: z.array(z.string()),
});