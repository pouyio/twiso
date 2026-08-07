export function getMedianRuntime(
  seasons: Array<{
    number: number;
    episodes: Array<{ runtime: number }>;
  }>,
): number | null {
  const runtimes = seasons
    .filter((s) => s.number > 0)
    .flatMap((s) => s.episodes.map((e) => e.runtime))
    .filter((r) => r > 0)
    .sort((a, b) => a - b);

  if (!runtimes.length) {
    return null;
  }

  const mid = Math.floor(runtimes.length / 2);
  return runtimes.length % 2
    ? runtimes[mid]
    : Math.round((runtimes[mid - 1] + runtimes[mid]) / 2);
}
