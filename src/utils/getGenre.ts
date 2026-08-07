export const movieGenres: Record<number, string> = {
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
  10770: '🎬',
  53: '🔪',
  10752: '⚔️',
  37: '🏜',
};

export const tvGenres: Record<number, string> = {
  10759: '⚡',
  16: '👾',
  35: '😆',
  80: '💣',
  99: '🗃',
  18: '👥',
  10751: '👨‍👩‍👧‍👦',
  10762: '🧒',
  9648: '🔍',
  10763: '📰',
  10764: '📺',
  10765: '🌌',
  10766: '🧼',
  10767: '🎙️',
  10768: '🏛️',
  37: '🏜',
};

export const genres: Record<number, string> = { ...movieGenres, ...tvGenres };

export const MOVIE_GENRE_IDS = Object.keys(movieGenres).map(Number);
export const TV_GENRE_IDS = Object.keys(tvGenres).map(Number);
export const GENRE_IDS = [...new Set([...MOVIE_GENRE_IDS, ...TV_GENRE_IDS])];

export default function getGenre(genre: number) {
  return genres[genre] || '❓';
}
