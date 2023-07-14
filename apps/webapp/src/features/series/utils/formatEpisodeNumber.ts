export const formatEpisodeNumber = (
  seasonNumber: number,
  episodeNumber: number,
) => {
  return `S${String(seasonNumber).padStart(2, '0')}E${String(
    episodeNumber,
  ).padStart(2, '0')}`
}
