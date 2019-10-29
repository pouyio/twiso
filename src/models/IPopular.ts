import { Movie } from './Item';
import { Show } from './Show';

export interface IPopular {
  collected_count: number;
  play_count: number;
  watcher_count: number;
  collector_count?: number;
  movie?: Movie;
  show?: Show;
}
