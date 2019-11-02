import { Ids } from './Ids';
import { Movie } from './Movie';
import { Show } from './Show';

interface Person {
  ids: Ids;
  name: string;
}

export interface People {
  cast: Array<{ character: string; characters: string[]; person: Person }>;
  crew: {
    production: Array<{ job: string; jobs: string[]; person: Person }>;
    art: Array<{ job: string; jobs: string[]; person: Person }>;
    crew: Array<{ job: string; jobs: string[]; person: Person }>;
    costume: Array<{ job: string; jobs: string[]; person: Person }>;
    'costume & make-up': Array<{
      job: string;
      jobs: string[];
      person: Person;
    }>;
    directing: Array<{ job: string; jobs: string[]; person: Person }>;
    writing: Array<{ job: string; jobs: string[]; person: Person }>;
    sound: Array<{ job: string; jobs: string[]; person: Person }>;
    camera: Array<{ job: string; jobs: string[]; person: Person }>;
    'visual effects': Array<{ job: string; jobs: string[]; person: Person }>;
  };
}

export interface PersonMovies {
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

export interface PersonShows {
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
