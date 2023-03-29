#!/usr/bin/env deno run --allow-read --allow-env --allow-net
type SearchMovie = any;
type SearchShow = any;
type SearchPerson = any;
type ItemType = any;
type ImageResponse = any;
type BaseImage = any;
import { config } from 'https://deno.land/x/dotenv@v3.2.2/mod.ts';
// import express from 'npm:express@4.17.1';
// import path from 'node:path';
// import fs from 'node:fs';
// const __dirname = new URL('.', import.meta.url).pathname;

export const CONTENT_TYPE = 'application/json';
export const TRAKT_API_VERSION = '2';
export const BASE_URL = 'https://api.trakt.tv';
export const LOGIN_URL = 'https://trakt.tv/oauth/token';
export const IMG_URL = 'https://api.themoviedb.org/3';

// const app = express();

// const ROUTES = {
//   shows: '/shows',
//   movies: '/movies',
//   search: '/search',
//   calendar: '/calendar',
//   profile: '/profile',
// };

// const ROUTE = {
//   movie: '/movie/:id',
//   show: '/show/:id',
//   person: '/person/:id',
// };
const findFirstValid = (images: BaseImage[], language: string) => {
  const p = images.find((p) => p.iso_639_1 === language);
  return p || images.find((p) => p.iso_639_1 === 'en') || images[0];
};

const tracktClient = {
  get: <T>(path: string) => {
    return fetch(BASE_URL + path, {
      headers: {
        'content-type': CONTENT_TYPE,
        'trakt-api-key': config().VITE_TRAKT_API_KEY,
        'trakt-api-version': TRAKT_API_VERSION,
      },
    })
      .then((r) => r.json())
      .then<{ data: T[] }>((r) => ({ data: r }));
  },
};
// const tracktClient = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     'content-type': CONTENT_TYPE,
//     'trakt-api-key': config().VITE_TRAKT_API_KEY,
//     'trakt-api-version': TRAKT_API_VERSION,
//   },
// });

export const getImgsApi = (id: number, type: ItemType) => {
  let newType: string = type;
  if (type === 'show') {
    newType = 'tv';
  }
  return fetch(
    `${IMG_URL}/${newType}/${id}/images?api_key=${config().VITE_TMDB_API_KEY}`
  )
    .then((r) => r.json())
    .then<ImageResponse>((r) => ({ data: r }));
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

const app = async (req: Request) => {
  	
  console.log(".vercel directory:");
  for await (const dirEntry of Deno.readDir('./.vercel')) {
    console.log(dirEntry);
  }
  console.log("local directory");
  for await (const dirEntry of Deno.readDir('.')) {
    console.log(dirEntry);
  }
  console.log("up directory");
  for await (const dirEntry of Deno.readDir('../')) {
    console.log(dirEntry);
  }
  // const data = Deno.readTextFileSync('./index.html');
  // const id = new URL(req.url).searchParams.get('id') ?? '';
  // const { item, imgUrl } = await fetchData<SearchMovie>('movie', +id);

  // const finalData = data
  //   .replace('__OG_TYPE__', 'video.movie')
  //   .replace('__OG_TITLE__', item?.title)
  //   .replace('__OG_IMAGE__', imgUrl)
  //   .replace('__OG_URL__', `https://twiso.now.sh${req.path}`)
  //   .replace('__OG_DESCRIPTION__', item?.overview);

  return new Response("finalData", {
    headers: {
      'content-type': 'text/html',
    },
  });
};

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
//         .replace('__OG_URL__', `https://twiso.vercel.app${req.path}`)
//         .replace('__OG_DESCRIPTION__', item.biography);

//       res.send(finalData);
//     }
//   );
// });

// app.use(express.static(path.join(__dirname, '../build')));

export default app;
// app.listen(8000, () => console.log('Listening on http://localhost:8000'));
