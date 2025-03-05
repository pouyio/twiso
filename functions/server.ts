import axios, { AxiosRequestConfig } from 'axios';
import { getImgsApi } from '../src/utils/api';
import { findFirstValid } from '../src/utils/findFirstValidImage';
import { SearchMovie, SearchPerson, SearchShow } from '../src/models/Movie';
import {
  BASE_URL,
  CONTENT_TYPE,
  TRAKT_API_VERSION,
} from '../src/utils/apiConfig';
import { EventContext } from '@cloudflare/workers-types';

const TYPE_MAP = {
  movie: 'video.movie',
  show: 'video.tv_show',
  person: 'video.profile',
};

const axiosConfig = (traktApiKey: string): AxiosRequestConfig => ({
  baseURL: BASE_URL,
  headers: {
    'content-type': CONTENT_TYPE,
    'trakt-api-key': traktApiKey,
    'trakt-api-version': TRAKT_API_VERSION,
  },
});

const traktClient = (traktApiKey: string) =>
  axios.create(axiosConfig(traktApiKey));

const fetchData = async <T extends SearchMovie | SearchShow | SearchPerson>(
  type: 'movie' | 'show' | 'person',
  id: number,
  context: EventContext<{ VITE_TRAKT_API_KEY: string }, any, any>
) => {
  const searchResponses = await traktClient(context.env.VITE_TRAKT_API_KEY).get<
    T[]
  >(`/search/trakt/${id}?type=${type}&extended=full`);
  let imgUrl = 'https://via.placeholder.com/185x330';

  if (!searchResponses.data[0]) {
    console.log(`Data with id:${id} not found`);
    return { imgUrl };
  }

  const item = searchResponses.data[0][type];
  const imgResponse = await getImgsApi(item.ids.tmdb, type);
  const poster = findFirstValid(
    (imgResponse.data.posters || imgResponse.data.profiles)!,
    'es'
  );

  if (poster) {
    imgUrl = `https://image.tmdb.org/t/p/w185${poster.file_path}`;
  }

  return { item, imgUrl };
};

export const onRequest = async (
  context: EventContext<{ VITE_TRAKT_API_KEY: string }, any, any>
) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const parts = url.pathname.split('/').filter(Boolean); // Remove empty parts

  if (parts.length < 2) {
    return new Response('Invalid request', { status: 400 });
  }

  const type = parts[0] as 'movie' | 'person' | 'show';
  const id = parseInt(parts[1]);

  if (isNaN(id)) {
    return new Response('Invalid ID', { status: 400 });
  }

  const { item, imgUrl } = await fetchData<SearchMovie>(type, id, context);

  // Load your index.html file (Cloudflare Workers does not support fs.readFileSync)
  const indexHtml = await env.ASSETS.fetch(
    new Request(`${url.origin}/index.html`)
  );
  let data = await indexHtml.text();

  // Replace meta tags
  const finalData = data.replace(
    '<!-- __META_OG__ -->',
    `<meta property="og:type" content="${TYPE_MAP[type]}" />
    <meta property="og:title" content="${item?.title}" />
    <meta property="og:image" content="${imgUrl}" />
    <meta property="og:url" content="https://twiso.pages.dev${url.pathname}" />
    <meta property="og:description" content="${item?.overview}" />
    `
  );

  return new Response(finalData, {
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
    },
  });
};
