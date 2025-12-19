import { Release } from '../models/Api';
import { DBMovieDetail } from '../utils/db';
import { useAppSelector } from '../state/store';
import { ModalContext } from '../contexts/ModalContext';
import { useContext } from 'react';
import { useTranslate } from '../hooks/useTranslate';

type ReleasesProps = {
  original_release: string | null;
  status: DBMovieDetail['status'];
  releases: Release[];
};

const formatDate = (date: string, language: string) => {
  return new Date(date).toLocaleDateString(language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
export const Releases: React.FC<ReleasesProps> = ({
  original_release,
  status,
  releases,
}) => {
  const language = useAppSelector((state) => state.config.language);
  const { t } = useTranslate();

  const { toggle } = useContext(ModalContext);
  return (
    <p
      onClick={() =>
        releases.length &&
        toggle({
          custom: (
            <>
              <h1 className="text-xl pb-2">{t('in_spain')}:</h1>
              <ul>
                {releases.map((release) => {
                  return (
                    <li key={release.release_date + release.country}>
                      • {formatDate(release.release_date, language)} -{' '}
                      <span className="capitalize">
                        {release.release_type}{' '}
                        {release.note ? ` - ${release.note}` : ''}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </>
          ),
        })
      }
    >
      {original_release ? formatDate(original_release, language) : status}
    </p>
  );
};
