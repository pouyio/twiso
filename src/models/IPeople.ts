import { Ids } from './Ids';
import { Movie } from './Item';
import { Show } from './Show';

interface IPerson {
  ids: Ids;
  name: string;
}

export interface IPeople {
  cast: Array<{ character: string; characters: string[]; person: IPerson }>;
  crew: {
    production: Array<{ job: string; jobs: string[]; person: IPerson }>;
    art: Array<{ job: string; jobs: string[]; person: IPerson }>;
    crew: Array<{ job: string; jobs: string[]; person: IPerson }>;
    costume: Array<{ job: string; jobs: string[]; person: IPerson }>;
    'costume & make-up': Array<{
      job: string;
      jobs: string[];
      person: IPerson;
    }>;
    directing: Array<{ job: string; jobs: string[]; person: IPerson }>;
    writing: Array<{ job: string; jobs: string[]; person: IPerson }>;
    sound: Array<{ job: string; jobs: string[]; person: IPerson }>;
    camera: Array<{ job: string; jobs: string[]; person: IPerson }>;
    'visual effects': Array<{ job: string; jobs: string[]; person: IPerson }>;
  };
}

export interface IPersonMovies {
  cast: Array<{ character: string; characters: string[]; movie: Movie }>;
  crew: {
    production: Array<{ job: string; jobs: string[]; movie: Movie }>;
    art: Array<{ job: string; jobs: string[]; movie: Movie }>;
    crew: Array<{ job: string; jobs: string[]; movie: Movie }>;
    costume: Array<{ job: string; jobs: string[]; movie: Movie }>;
    'costume & make-up': Array<{
      job: string;
      jobs: string[];
      movie: Movie;
    }>;
    directing: Array<{ job: string; jobs: string[]; movie: Movie }>;
    writing: Array<{ job: string; jobs: string[]; movie: Movie }>;
    sound: Array<{ job: string; jobs: string[]; movie: Movie }>;
    camera: Array<{ job: string; jobs: string[]; movie: Movie }>;
    'visual effects': Array<{ job: string; jobs: string[]; movie: Movie }>;
  };
}

export interface IPersonShows {
  cast: Array<{
    character: string;
    characters: string[];
    episode_count: number;
    series_regular: boolean;
    show: Show;
  }>;
  crew: {
    production: Array<{ job: string; jobs: string[]; show: Show }>;
    art: Array<{ job: string; jobs: string[]; show: Show }>;
    crew: Array<{ job: string; jobs: string[]; show: Show }>;
    costume: Array<{ job: string; jobs: string[]; show: Show }>;
    'costume & make-up': Array<{
      job: string;
      jobs: string[];
      show: Show;
    }>;
    directing: Array<{ job: string; jobs: string[]; show: Show }>;
    writing: Array<{ job: string; jobs: string[]; show: Show }>;
    sound: Array<{ job: string; jobs: string[]; show: Show }>;
    camera: Array<{ job: string; jobs: string[]; show: Show }>;
    'visual effects': Array<{ job: string; jobs: string[]; show: Show }>;
  };
}
