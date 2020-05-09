import { BaseImage } from '../models';

export const findFirstValid = (images: BaseImage[], language: string) => {
  const p = images.find(p => p.iso_639_1 === language);
  return p || images.find(p => p.iso_639_1 === 'en') || images[0];
};
