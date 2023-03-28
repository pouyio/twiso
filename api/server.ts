import {
  SearchMovie,
  SearchShow,
  SearchPerson,
  ItemType,
  ImageResponse,
  BaseImage,
} from '../src/models';
import express from 'express';
import path from 'path';
import fs, { readFileSync } from 'fs';
import {
  BASE_URL,
  config,
  CONTENT_TYPE,
  IMG_URL,
  TRAKT_API_VERSION,
} from '../src/utils/apiConfig';
import axios from 'axios';
const app = express();

const ROUTES = {
  shows: '/shows',
  movies: '/movies',
  search: '/search',
  calendar: '/calendar',
  profile: '/profile',
};

const ROUTE = {
  movie: '/movie/:id',
  show: '/show/:id',
  person: '/person/:id',
};
const findFirstValid = (images: BaseImage[], language: string) => {
  const p = images.find((p) => p.iso_639_1 === language);
  return p || images.find((p) => p.iso_639_1 === 'en') || images[0];
};

const tracktClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'content-type': CONTENT_TYPE,
    'trakt-api-key': config.traktApiKey,
    'trakt-api-version': TRAKT_API_VERSION,
  },
});

export const getImgsApi = (id: number, type: ItemType) => {
  let newType: string = type;
  if (type === 'show') {
    newType = 'tv';
  }
  return axios.get<ImageResponse>(
    `${IMG_URL}/${newType}/${id}/images?api_key=${config.tmdbApiKey}`
  );
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

app.get(['/', ...Object.values(ROUTES)], (req, res) => {
  fs.readFile(
    path.join(__dirname + '/../build/index.html'),
    'utf8',
    async (err, data) => {
      if (err) {
        console.log(err);
        res.status(404).send();
        return;
      }
      data = data
        .replace('__OG_TYPE__', 'website')
        .replace('<meta property="og:title" content="__OG_TITLE__"/>', '')
        .replace('<meta property="og:image" content="__OG_IMAGE__"/>', '')
        .replace(
          '<meta property="og:description" content="__OG_DESCRIPTION__"/>',
          ''
        )
        .replace('__OG_URL__', `https://twiso.vercel.app${req.path}`);

      res.send(data);
    }
  );
});

app.get(ROUTE.movie, (req, res) => {
  // fs.readFile(
  //   path.join(__dirname + '/../build/index.html'),
  //   'utf8',
  //   async (err, data) => {
  //     if (err) {
  //       console.log(err);
  //       res.status(404).send('There was a problem 😿');
  //       return;
  //     }

  //     const { item, imgUrl } = await fetchData<SearchMovie>(
  //       'movie',
  //       +req.params.id
  //     );

  //     const finalData = data
  //       .replace('__OG_TYPE__', 'video.movie')
  //       .replace('__OG_TITLE__', item?.title)
  //       .replace('__OG_IMAGE__', imgUrl)
  //       .replace(/__OG_URL__/, `https://twiso.now.sh${req.path}`)
  //       .replace('__OG_DESCRIPTION__', item?.overview);

  //     res.send(finalData);
  //   }
  // );
  res.send('ok movie');
});

app.get(ROUTE.show, (req, res) => {
  fs.readFile(
    path.join(__dirname + '/../build/index.html'),
    'utf8',
    async (err, data) => {
      if (err) {
        console.log(err);
        res.status(404).send('There was a problem 😿');
        return;
      }

      const { item, imgUrl } = await fetchData<SearchShow>(
        'show',
        +req.params.id
      );

      const finalData = data
        .replace('__OG_TYPE__', 'video.tv_show')
        .replace('__OG_TITLE__', item?.title)
        .replace('__OG_IMAGE__', imgUrl)
        .replace(/__OG_URL__/, `https://twiso.now.sh${req.path}`)
        .replace('__OG_DESCRIPTION__', item?.overview);

      res.send(finalData);
    }
  );
});

app.get(ROUTE.person, (req, res) => {
  fs.readFile(
    path.join(__dirname + '/../build/index.html'),
    'utf8',
    async (err, data) => {
      if (err) {
        console.log(err);
        res.status(404).send('There was a problem 😿');
        return;
      }

      const { item, imgUrl } = await fetchData<SearchPerson>(
        'person',
        +req.params.id
      );

      const finalData = data
        .replace('__OG_TYPE__', 'profile')
        .replace('__OG_TITLE__', item.name)
        .replace('__OG_IMAGE__', imgUrl)
        .replace('__OG_URL__', `https://twiso.vercel.app${req.path}`)
        .replace('__OG_DESCRIPTION__', item.biography);

      res.send(finalData);
    }
  );
});

app.use(express.static(path.join(__dirname, '../build')));

// export default app;

export default function handler(req, res) {
  const file = path.join(__dirname + './../index.html');
  const stringified = readFileSync(file, 'utf8');

  res.setHeader('Content-Type', 'application/json');
  return res.end(stringified);
}
