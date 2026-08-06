export const genres: Record<number, string> = {
  28: '👊',
  12: '🗺',
  16: '👾',
  35: '😆',
  80: '💣',
  99: '🗃',
  18: '👥',
  10751: '👨‍👩‍👧‍👦',
  14: '🐲',
  36: '📜',
  27: '👹',
  10402: '🎤',
  9648: '🔍',
  10749: '💕',
  878: '🚀',
  53: '🔪',
  10770: '🎬',
  10752: '⚔️',
  37: '🏜',
};

export const GENRE_IDS = Object.keys(genres).map(Number);

export default function getGenre(genre: number) {
  return genres[genre] || '❓';
}
