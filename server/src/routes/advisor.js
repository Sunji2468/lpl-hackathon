import { Router } from 'express';
import { z } from 'zod';

import { generateClientBriefing } from '../ai/briefing.js';
import { requireAuth } from '../middleware/requireAuth.js';

const requestSchema = z.object({
  client: z.object({
    id: z.string().min(1),
    name: z.string().min(1),

    portfolio: z.object({
      cash: z.number().nonnegative(),

      holdings: z.array(
        z.object({
          symbol: z.string().min(1),
          sector: z.string().min(1),
          assetClass: z.string().min(1),
          value: z.number().nonnegative(),
        }),
      ),
    }),

    onboarding: z
      .record(
        z.string(),
        z.enum(['complete', 'missing', 'pending']),
      )
      .optional(),
  }),
});
router.post('/briefing/:clientId', async (req, res, next) => {
  try {
    const rawClient = await getClientById(req.params.clientId)

    if (!rawClient) {
      return res.status(404).json({
        error: 'Client not found',
      })
    }

    const client = adaptClientForBriefing(rawClient)

    const result = await generateClientBriefing(client)

    return res.json({
      clientId: rawClient.id,
      generatedAt: new Date().toISOString(),
      ...result,
    })
  } catch (err) {
    next(err)
  }
})

export function advisorRouter({ jwtSecret }) {
  const router = Router();

  router.use(requireAuth(jwtSecret));

  router.post('/briefing', async (req, res, next) => {
    try {
      const parsed = requestSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          error: 'Invalid client briefing request',
        });
      }

      const result = await generateClientBriefing(
        parsed.data.client,
      );

      return res.json({
        generatedAt: new Date().toISOString(),
        ...result,
      });
    } catch (err) {
      next(err);
    }
  });

  return router;
}