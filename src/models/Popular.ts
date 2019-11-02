import { Movie } from './Movie';
import { Show } from './Show';

export interface Popular {
  collected_count: number;
  play_count: number;
  watcher_count: number;
  collector_count?: number;
  movie?: Movie;
  show?: Show;
}
