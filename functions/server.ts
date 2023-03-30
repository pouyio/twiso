type SearchMovie = any;
type SearchShow = any;
type SearchPerson = any;
type ItemType = any;
type ImageResponse = any;
type BaseImage = any;
// import { ROUTES, ROUTE } from '../src/utils/routes';
// import express from 'express';
import axios from 'axios';
const path = require('path');
const fs = require('fs');
// const app = express();
export const CONTENT_TYPE = 'application/json';
export const TRAKT_API_VERSION = '2';
export const BASE_URL = 'https://api.trakt.tv';
export const LOGIN_URL = 'https://trakt.tv/oauth/token';
export const IMG_URL = 'https://api.themoviedb.org/3';
const findFirstValid = (images: BaseImage[], language: string) => {
  const p = images.find((p) => p.iso_639_1 === language);
  return p || images.find((p) => p.iso_639_1 === 'en') || images[0];
};
import { Handler, HandlerEvent } from '@netlify/functions';
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

export const getImgsApi = (id: number, type: ItemType) => {
  let newType: string = type;
  if (type === 'show') {
    newType = 'tv';
  }
  return axios.get(
    `${IMG_URL}/${newType}/${id}/images?api_key=${process.env.VITE_TMDB_API_KEY}`
  );
};

// app.get(['/', ...Object.values(ROUTES)], (req, res) => {
//   fs.readFile(
//     path.join(__dirname + '/../build/index.html'),
//     'utf8',
//     async (err, data) => {
//       if (err) {
//         console.log(err);
//         res.status(404).send();
//         return;
//       }
//       data = data
//         .replace('__OG_TYPE__', 'website')
//         .replace('<meta property="og:title" content="__OG_TITLE__"/>', '')
//         .replace('<meta property="og:image" content="__OG_IMAGE__"/>', '')
//         .replace(
//           '<meta property="og:description" content="__OG_DESCRIPTION__"/>',
//           ''
//         )
//         .replace('__OG_URL__', `https://twiso.vercel.app${req.path}`);

//       res.send(data);
//     }
//   );
// });

// app.get(ROUTE.movie, (req, res) => {
//   fs.readFile(
//     path.join(__dirname + '/../build/index.html'),
//     'utf8',
//     async (err, data) => {
//       if (err) {
//         console.log(err);
//         res.status(404).send('There was a problem 😿');
//         return;
//       }

//       const { item, imgUrl } = await fetchData<SearchMovie>(
//         'movie',
//         +req.params.id
//       );

//       const finalData = data
//         .replace('__OG_TYPE__', 'video.movie')
//         .replace('__OG_TITLE__', item?.title)
//         .replace('__OG_IMAGE__', imgUrl)
//         .replace(/__OG_URL__/, `https://twiso.now.sh${req.path}`)
//         .replace('__OG_DESCRIPTION__', item?.overview);

//       res.send(finalData);
//     }
//   );
// });

// app.get(ROUTE.show, (req, res) => {
//   fs.readFile(
//     path.join(__dirname + '/../build/index.html'),
//     'utf8',
//     async (err, data) => {
//       if (err) {
//         console.log(err);
//         res.status(404).send('There was a problem 😿');
//         return;
//       }

//       const { item, imgUrl } = await fetchData<SearchShow>(
//         'show',
//         +req.params.id
//       );

//       const finalData = data
//         .replace('__OG_TYPE__', 'video.tv_show')
//         .replace('__OG_TITLE__', item?.title)
//         .replace('__OG_IMAGE__', imgUrl)
//         .replace(/__OG_URL__/, `https://twiso.now.sh${req.path}`)
//         .replace('__OG_DESCRIPTION__', item?.overview);

//       res.send(finalData);
//     }
//   );
// });

// app.get(ROUTE.person, (req, res) => {
//   fs.readFile(
//     path.join(__dirname + '/../build/index.html'),
//     'utf8',
//     async (err, data) => {
//       if (err) {
//         console.log(err);
//         res.status(404).send('There was a problem 😿');
//         return;
//       }

//       const { item, imgUrl } = await fetchData<SearchPerson>(
//         'person',
//         +req.params.id
//       );

//       const finalData = data
//         .replace('__OG_TYPE__', 'profile')
//         .replace('__OG_TITLE__', item.name)
//         .replace('__OG_IMAGE__', imgUrl)
//         .replace('__OG_URL__', `https://twiso.now.sh${req.path}`)
//         .replace('__OG_DESCRIPTION__', item.biography);

//       res.send(finalData);
//     }
//   );
// });

// app.use(express.static(path.join(__dirname, '../build')));
const TYPE_MAP = {
  movie: 'video.movie',
  show: 'video.tv_show',
  person: 'video.profile',
};

const handler: Handler = async (req: HandlerEvent) => {
  const file = path.join(process.cwd(), '/build/index.html');
  const data = fs.readFileSync(file, 'utf8');
  const type = req.path.split('/')[1] as 'movie' | 'person' | 'show';
  const id = +req.path.split('/')[2];
  const { item, imgUrl } = await fetchData<SearchMovie>(type, id);

  const finalData = data
    .replace('__OG_TYPE__', TYPE_MAP[type])
    .replace('__OG_TITLE__', item?.title)
    .replace('__OG_IMAGE__', imgUrl)
    .replace('__OG_URL__', `https://twiso.netlify.app${req.path}`)
    .replace('__OG_DESCRIPTION__', item?.overview);

  return {
    statusCode: 200,
    headers: {
      'Content-type': 'text/html; charset=UTF-8',
    },
    body: finalData,
  };
};

export { handler };
