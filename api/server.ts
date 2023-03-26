import { getApi, getImgsApi } from '../src/utils/api';
import { ROUTES, ROUTE } from '../src/utils/routes';
import { findFirstValid } from '../src/utils/findFirstValidImage';
import { SearchMovie, SearchShow, SearchPerson } from '../src/models';
import express from 'express';
import path from 'path';
import fs from 'fs';
const app = express();

const fetchData = async <T extends SearchMovie | SearchShow | SearchPerson>(
  type: 'movie' | 'show' | 'person',
  id: number
) => {
  const searchResponses = await getApi<T>(id, type);

  const item = searchResponses.data[0][type];

  const imgResponse = await getImgsApi(item.ids.tmdb, type);
  const poster = findFirstValid(
    (imgResponse.data.posters || imgResponse.data.profiles)!,
    'es'
  );

  let imgUrl = 'https://via.placeholder.com/185x330';
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
  fs.readFile(
    path.join(__dirname + '/../build/index.html'),
    'utf8',
    async (err, data) => {
      if (err) {
        console.log(err);
        res.status(404).send('There was a problem 😿');
        return;
      }

      const { item, imgUrl } = await fetchData<SearchMovie>(
        'movie',
        +req.params.id
      );

      const finalData = data
        .replace('__OG_TYPE__', 'video.movie')
        .replace('__OG_TITLE__', item?.title)
        .replace('__OG_IMAGE__', imgUrl)
        .replace(/__OG_URL__/, `https://twiso.now.sh${req.path}`)
        .replace('__OG_DESCRIPTION__', item?.overview);

      res.send(finalData);
    }
  );
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
        .replace('__OG_URL__', `https://twiso.now.sh${req.path}`)
        .replace('__OG_DESCRIPTION__', item.biography);

      res.send(finalData);
    }
  );
});

app.use(express.static(path.join(__dirname, '/..')));

export default app;
