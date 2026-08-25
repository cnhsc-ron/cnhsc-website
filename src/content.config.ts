import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const trailReports = defineCollection({
  loader: glob({ base: './src/content/trail-reports', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.literal('trail-conditions').default('trail-conditions'),
    status: z.enum(['open', 'closed', 'limited']).optional(),
    sponsor: z.string().optional(),
    trails: z
      .array(
        z.object({
          name: z.string(),
          condition: z.string(),
          notes: z.string().optional(),
        })
      )
      .optional(),
  }),
});

export const collections = { 'trail-reports': trailReports };
