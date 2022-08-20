export const genres: {
  [key: string]: string;
} = {
  action: '👊',
  adventure: '🗺',
  animation: '👾',
  anime: '🇯🇵',
  comedy: '😆',
  crime: '💣',
  documentary: '🗃',
  drama: '👥',
  family: '👨‍👩‍👧‍👦',
  fantasy: '🐲',
  history: '📜',
  holiday: '🏖',
  horror: '👹',
  music: '🎤',
  musical: '🎶',
  mystery: '🔍',
  none: '❌',
  romance: '💕',
  'science-fiction': '🚀',
  short: '🎥',
  'sporting-event': '⚽️',
  superhero: '💪🏻',
  suspense: '⏸',
  thriller: '🔪',
  war: '⚔️',
  western: '🏜',
};

export default function getGenre(genre: string) {
  return genres[genre] || '❓';
}
