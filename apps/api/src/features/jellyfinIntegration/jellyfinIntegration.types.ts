import { z } from 'zod/v4'

export const jellyfinWebhookBodySchema = z.object({
  notificationType: z.literal('PlaybackStop'),
  playedToCompletion: z.union([z.literal('True'), z.literal('False')]),
  episodeImdbId: z.string(),
})
export type JellyfinWebhookBody = z.infer<typeof jellyfinWebhookBodySchema>
