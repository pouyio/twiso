import axios, { AxiosRequestConfig } from 'axios';
import { findFirstValid } from '../src/utils/findFirstValidImage';
import { SearchMovie, SearchPerson, SearchShow } from '../src/models/Movie';
import {
  BASE_URL,
  CONTENT_TYPE,
  IMG_URL,
  TRAKT_API_VERSION,
} from '../src/utils/apiConsts';
import { EventContext } from '@cloudflare/workers-types';
import { ImageResponse } from 'models/Image';
import { ItemType } from 'models/ItemType';

type ENVs = {
  VITE_TRAKT_API_KEY: string;
  VITE_TMDB_API_KEY: string;
};

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

export const getImgsApi = (id: number, type: ItemType, tmdbApiKey: string) => {
  let newType: string = type;
  if (type === 'show') {
    newType = 'tv';
  }
  return axios.get<ImageResponse>(
    `${IMG_URL}/${newType}/${id}/images?api_key=${tmdbApiKey}`
  );
};

const traktClient = (apiKey: string) => axios.create(axiosConfig(apiKey));

const fetchData = async <T extends SearchMovie | SearchShow | SearchPerson>(
  type: 'movie' | 'show' | 'person',
  id: number,
  env: ENVs
) => {
  const searchResponses = await traktClient(env.VITE_TRAKT_API_KEY).get<T[]>(
    `/search/trakt/${id}?type=${type}&extended=full`
  );
  let imgUrl = 'https://via.placeholder.com/185x330';

  if (!searchResponses.data[0]) {
    console.log(`Data with id:${id} not found`);
    return { imgUrl };
  }

  const item = searchResponses.data[0][type];
  const imgResponse = await getImgsApi(
    item.ids.tmdb,
    type,
    env.VITE_TMDB_API_KEY
  );
  const poster = findFirstValid(
    (imgResponse.data.posters || imgResponse.data.profiles)!,
    'es'
  );

  if (poster) {
    imgUrl = `https://image.tmdb.org/t/p/w185${poster.file_path}`;
  }

  return { item, imgUrl };
};

export const onRequest = async (context: EventContext<ENVs, any, any>) => {
  console.log(context.params);
  return new Response('ok!');
  // const { request, env } = context;
  // const url = new URL(request.url);
  // const parts = url.pathname.split('/').filter(Boolean); // Remove empty parts

  // if (parts.length < 2) {
  //   return new Response('Invalid request', { status: 400 });
  // }

  // const type = parts[0] as 'movie' | 'person' | 'show';
  // const id = parseInt(parts[1]);

  // if (isNaN(id)) {
  //   return new Response('Invalid ID', { status: 400 });
  // }

  // const { item, imgUrl } = await fetchData<SearchMovie>(type, id, env);

  // // Load your index.html file (Cloudflare Workers does not support fs.readFileSync)
  // const indexHtml = await fetch(new Request(`${url.origin}/index.html`));
  // let data = await indexHtml.text();

  // // Replace meta tags
  // const finalData = data.replace(
  //   '<!-- __META_OG__ -->',
  //   `<meta property="og:type" content="${TYPE_MAP[type]}" />
  //   <meta property="og:title" content="${item?.title}" />
  //   <meta property="og:image" content="${imgUrl}" />
  //   <meta property="og:url" content="https://twiso.pages.dev${url.pathname}" />
  //   <meta property="og:description" content="${item?.overview}" />
  //   `
  // );

  // return new Response(finalData, {
  //   headers: {
  //     'Content-Type': 'text/html; charset=UTF-8',
  //   },
  // });
};
