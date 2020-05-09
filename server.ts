import express from 'express';
import path from 'path';
import fs from 'fs';
const app = express();
import { getApi, getImgsApi } from './src/utils/api';
import { findFirstValid } from './src/utils/findFirstValidImage';
import { SearchMovie, SearchShow, SearchPerson } from './src/models';
const port = 80;

const ROUTES = ['/', '/search', '/movies', '/shows', '/profile'];

app.get(ROUTES, (req, res) => {
  fs.readFile(
    path.join(__dirname + '/build/index.html'),
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
          '',
        )
        .replace('__OG_URL__', `https://twiso.now.sh${req.path}`);

      res.send(data);
    },
  );
});

app.get('/movie/:id', (req, res) => {
  fs.readFile(
    path.join(__dirname + '/build/index.html'),
    'utf8',
    async (err, data) => {
      if (err) {
        console.log(err);
        res.status(404).send('There was a problem 😿');
        return;
      }

      const searchResponses = await getApi<SearchMovie>(
        +req.params.id,
        'movie',
      );

      const initialItem = searchResponses.data[0].movie;

      const imgResponse = await getImgsApi(initialItem.ids.tmdb, 'movie');
      const poster = findFirstValid(
        (imgResponse.data.posters || imgResponse.data.profiles)!,
        'es',
      );

      let initialImgUrl = 'https://via.placeholder.com/185x330';
      if (poster) {
        initialImgUrl = `https://image.tmdb.org/t/p/w185${poster.file_path}`;
      }

      data = data
        .replace('__OG_TYPE__', 'video.movie')
        .replace('__OG_TITLE__', initialItem?.title)
        .replace('__OG_IMAGE__', initialImgUrl)
        .replace(/__OG_URL__/, `https://twiso.now.sh${req.path}`)
        .replace('__OG_DESCRIPTION__', initialItem?.overview);

      res.send(data);
    },
  );
});

app.get('/show/:id', (req, res) => {
  fs.readFile(
    path.join(__dirname + '/build/index.html'),
    'utf8',
    async (err, data) => {
      if (err) {
        console.log(err);
        res.status(404).send('There was a problem 😿');
        return;
      }

      const searchResponses = await getApi<SearchShow>(+req.params.id, 'show');

      const initialItem = searchResponses.data[0].show;

      const imgResponse = await getImgsApi(initialItem.ids.tmdb, 'show');
      const poster = findFirstValid(
        (imgResponse.data.posters || imgResponse.data.profiles)!,
        'es',
      );

      let initialImgUrl = 'https://via.placeholder.com/185x330';
      if (poster) {
        initialImgUrl = `https://image.tmdb.org/t/p/w185${poster.file_path}`;
      }

      data = data
        .replace('__OG_TYPE__', 'video.tv_show')
        .replace('__OG_TITLE__', initialItem?.title)
        .replace('__OG_IMAGE__', initialImgUrl)
        .replace(/__OG_URL__/, `https://twiso.now.sh${req.path}`)
        .replace('__OG_DESCRIPTION__', initialItem?.overview);

      res.send(data);
    },
  );
});

app.get('/person/:id', (req, res) => {
  fs.readFile(
    path.join(__dirname + '/build/index.html'),
    'utf8',
    async (err, data) => {
      if (err) {
        console.log(err);
        res.status(404).send('There was a problem 😿');
        return;
      }

      const searchResponses = await getApi<SearchPerson>(
        +req.params.id,
        'person',
      );

      const initialItem = searchResponses.data[0].person;

      const imgResponse = await getImgsApi(initialItem.ids.tmdb, 'person');
      const poster = findFirstValid(
        (imgResponse.data.posters || imgResponse.data.profiles)!,
        'en',
      );

      let initialImgUrl = 'https://via.placeholder.com/185x330';
      if (poster) {
        initialImgUrl = `https://image.tmdb.org/t/p/w185${poster.file_path}`;
      }

      data = data
        .replace('__OG_TYPE__', 'profile')
        .replace('__OG_TITLE__', initialItem.name)
        .replace('__OG_IMAGE__', initialImgUrl)
        .replace('__OG_URL__', `https://twiso.now.sh${req.path}`)
        .replace('__OG_DESCRIPTION__', initialItem.biography);

      res.send(data);
    },
  );
});

app.use(express.static(path.join(__dirname, 'build')));

app.listen(port, () => console.log(`Running in http://localhost:${port}`));
