import { Language } from 'state/slices/config';
import { useAppSelector } from 'state/store';

const en = {
  movies: 'Movies',
  search: 'Search',
  shows: 'Shows',
  calendar: 'Calendar',
  profile: 'Profile',
  to_show: 'Show {}',
  link_copied: 'Link to "{}" copied',
  mark_not_watched: 'Mark all as not watched',
  mark_watched: 'Mark all as watched',
  none_found: 'None',
  action: 'action',
  adventure: 'adventure',
  animation: 'animation',
  anime: 'anime',
  comedy: 'comedy',
  crime: 'crime',
  documentary: 'documentary',
  drama: 'drama',
  family: 'family',
  fantasy: 'fantasy',
  history: 'history',
  holiday: 'holiday',
  horror: 'horror',
  music: 'music',
  musical: 'musical',
  mystery: 'mystery',
  none: 'none',
  romance: 'romance',
  science: 'sci-fi',
  short: 'short',
  sporting: 'sporting',
  superhero: 'superhero',
  suspense: 'suspense',
  thriller: 'thriller',
  war: 'war',
  western: 'western',
  loading: 'Loading',
  new_version: 'New version available ,',
  update: 'Update',
  popular_show: 'Popular shows',
  popular_movie: 'Popular movies',
  add_watchlist: 'Add to watchlist',
  added_watchlist: 'Remove from watchlist',
  watched: 'Watched',
  watcheds: 'Watcheds',
  watchlist: 'Watchlist',
  watchlists: 'Watchlists',
  season: 'Season',
  specials: 'Specials',
  no_movies: 'There are no movies',
  no_shows: 'There are no shows',
  people: 'People',
  no_people: 'There are no people',
  search_placeholder: '🔍 Search for a movie, show or personn',
  all: 'All',
  my_collection: 'My collection',
  show_watcheds: 'Following',
  bio: 'Biography',
  episodes: 'Episodes',
  have_watched: 'Watched',
  have_watched_f: 'Watched',
  dark: 'Dark',
  light: 'Light',
  system: 'System',
  direction: 'Director',
  cast: 'Cast',
  'returning series': 'returning series',
  'in production': 'in production',
  planned: 'planned',
  canceled: 'canceled',
  ended: 'ended',
};

const es = {
  movies: 'Películas',
  search: 'Buscar',
  shows: 'Series',
  calendar: 'Calendario',
  profile: 'Perfil',
  to_show: 'Mostrar {}',
  link_copied: 'Enlace a "{}" copiado',
  mark_not_watched: 'Marcar todo como no vistos',
  mark_watched: 'Marcar todo como vistos',
  none_found: 'Ninguno',
  action: 'acción',
  adventure: 'aventura',
  animation: 'animación',
  anime: 'anime',
  comedy: 'comedia',
  crime: 'crimen',
  documentary: 'documental',
  drama: 'drama',
  family: 'familiar',
  fantasy: 'fanstasía',
  history: 'histórica',
  holiday: 'vacaciones',
  horror: 'terror',
  music: 'música',
  musical: 'musical',
  mystery: 'misterio',
  none: 'ninguna',
  romance: 'romántica',
  science: 'ciencia-ficción',
  short: 'corto',
  sporting: 'deportes',
  superhero: 'superhéroes',
  suspense: 'suspense',
  thriller: 'thriller',
  war: 'bélica',
  western: 'western',
  loading: 'Cargando',
  new_version: 'Nueva versión disponible ,',
  update: 'Actualizar',
  popular_show: 'Series populares',
  popular_movie: 'Películas populares',
  add_watchlist: 'Añadir a pendientes',
  added_watchlist: 'Eliminar de pendientes',
  watched: 'Vista',
  watcheds: 'Vistas',
  watchlist: 'Pendiente',
  watchlists: 'Pendientes',
  season: 'Temporada',
  specials: 'Especiales',
  no_movies: 'No hay películas',
  no_shows: 'No hay series',
  people: 'Personas',
  no_people: 'No hay personas',
  search_placeholder: '🔍 Busca una película, serie o persona',
  all: 'Todo',
  my_collection: 'Mi colección',
  show_watcheds: 'Siguiendo',
  bio: 'Biografía',
  episodes: 'Episodios',
  have_watched: 'Vistos',
  have_watched_f: 'Vistas',
  dark: 'Oscuro',
  light: 'Claro',
  system: 'Sistema',
  direction: 'Dirección',
  cast: 'Reparto',
  'returning series': 'en antena',
  'in production': 'en producción',
  planned: 'planeada',
  canceled: 'cancelada',
  ended: 'terminada',
};

const translations: Record<Language, Record<string, string>> = {
  en,
  es,
};

export const useTranslate = () => {
  const language = useAppSelector((state) => state.config.language);

  const t = (text: string, interpolation: string = '') => {
    const translation = translations[language][text] ?? text;
    return translation.replace('{}', interpolation);
  };

  return { t };
};
