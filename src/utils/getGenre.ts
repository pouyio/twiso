interface IGenre {
  name: string;
  emoji: string;
}
const genres: {
  [key: string]: IGenre;
} = {
  action: {
    name: 'acción',
    emoji: '👊',
  },
  adventure: {
    name: 'aventura',
    emoji: '🗺',
  },
  animation: {
    name: 'animación',
    emoji: '👾',
  },
  anime: {
    name: 'anime',
    emoji: '🇯🇵',
  },
  comedy: {
    name: 'comedia',
    emoji: '😆',
  },
  crime: {
    name: 'Crimen',
    emoji: '💣',
  },
  documentary: {
    name: 'documental',
    emoji: '🗃',
  },
  drama: {
    name: 'drama',
    emoji: '👥',
  },
  family: {
    name: 'familiar',
    emoji: '👨‍👩‍👧‍👦',
  },
  fantasy: {
    name: 'fanstasía',
    emoji: '🐲',
  },
  history: {
    name: 'histórica',
    emoji: '📜',
  },
  holiday: {
    name: 'vacaciones',
    emoji: '🏖',
  },
  horror: {
    name: 'terror',
    emoji: '👹',
  },
  music: {
    name: 'música',
    emoji: '🎤',
  },
  musical: {
    name: 'musical',
    emoji: '🎶',
  },
  mystery: {
    name: 'misterio',
    emoji: '🔍',
  },
  none: {
    name: 'ninguna',
    emoji: '❌',
  },
  romance: {
    name: 'romántica',
    emoji: '💕',
  },
  'science-fiction': {
    name: 'ciencia-ficción',
    emoji: '🚀',
  },
  short: {
    name: 'corto',
    emoji: '🎥',
  },
  'sporting-event': {
    name: 'deportes',
    emoji: '⚽️',
  },
  superhero: {
    name: 'superhéroes',
    emoji: '💪🏻',
  },
  suspense: {
    name: 'suspense',
    emoji: '⏸',
  },
  thriller: {
    name: 'thriller',
    emoji: '🔪',
  },
  war: {
    name: 'bélica',
    emoji: '⚔️',
  },
  western: {
    name: 'western',
    emoji: '🏜',
  },
};

export default function getGenre(genre: string) {
  return (
    genres[genre] || {
      name: genre,
      emoji: '❓',
    }
  );
}
