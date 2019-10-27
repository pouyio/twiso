import { Ids } from './Ids';

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
