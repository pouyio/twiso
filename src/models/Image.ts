export interface BaseImage {
  aspect_ratio: number;
  file_path: string;
  height: number;
  iso_639_1: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface ImageResponse {
  id: number;
  backdrops?: BaseImage[];
  posters?: BaseImage[];
  profiles?: BaseImage[];
}
