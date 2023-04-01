import { Handler, HandlerEvent } from '@netlify/functions';
import axios from 'axios';
import fs from 'fs';
import {
  BaseImage,
  // ImageResponse,
  // ItemType,
  SearchMovie,
  SearchPerson,
  SearchShow,
} from 'models';
import path from 'path';
import { getImgsApi } from 'utils/api';
import {
  BASE_URL,
  CONTENT_TYPE,
  // IMG_URL,
  TRAKT_API_VERSION,
} from 'utils/apiConfig';
const findFirstValid = (images: BaseImage[], language: string) => {
  const p = images.find((p) => p.iso_639_1 === language);
  return p || images.find((p) => p.iso_639_1 === 'en') || images[0];
};

const tracktClient = {
  get: <T>(path: string) => {
    return axios.get(BASE_URL + path, {
      headers: {
        'content-type': CONTENT_TYPE,
        'trakt-api-key': process.env.VITE_TRAKT_API_KEY ?? '',
        'trakt-api-version': TRAKT_API_VERSION,
      },
    });
  },
};

const TYPE_MAP = {
  movie: 'video.movie',
  show: 'video.tv_show',
  person: 'video.profile',
};

// const getImgsApi = (id: number, type: ItemType) => {
//   let newType: string = type;
//   if (type === 'show') {
//     newType = 'tv';
//   }
//   return axios.get<ImageResponse>(
//     `${IMG_URL}/${newType}/${id}/images?api_key=${process.env.VITE_TMDB_API_KEY}`
//   );
// };

const fetchData = async <T extends SearchMovie | SearchShow | SearchPerson>(
  type: 'movie' | 'show' | 'person',
  id: number
) => {
  const searchResponses = await tracktClient.get<T>(
    `/search/trakt/${id}?type=${type}&extended=full`
  );
  let imgUrl = 'https://via.placeholder.com/185x330';

  if (!searchResponses.data[0]) {
    console.log(`Data no with id:${id} not found`);
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

const handler: Handler = async (req: HandlerEvent) => {
  const file = path.join(process.cwd(), '/build/index.html');
  const data = fs.readFileSync(file, 'utf8');
  const type = req.path.split('/')[1] as 'movie' | 'person' | 'show';
  const id = +req.path.split('/')[2];
  const { item, imgUrl } = await fetchData<SearchMovie>(type, id);

  const finalData = data.replace(
    '<!-- __META_OG__ -->',
    `<meta property="og:type" content="${TYPE_MAP[type]}" />
    <meta property="og:title" content="${item?.title}" />
    <meta property="og:image" content="${imgUrl}" />
    <meta property="og:url" content="https://twiso.netlify.app${req.path}}" />
    <meta property="og:description" content="${item?.overview}" />
    `
  );

  return {
    statusCode: 200,
    headers: {
      'Content-type': 'text/html; charset=UTF-8',
    },
    body: finalData,
  };
};

export { handler };
