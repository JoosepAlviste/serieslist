import { type Context } from '@/types/context'

import * as episodeRepository from './episode.repository'

export const findOne = ({
  ctx,
  episodeId,
}: {
  ctx: Context
  episodeId: number
}) => {
  return episodeRepository.findOne({ ctx, episodeId })
}
