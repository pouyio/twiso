import { useNavigate } from 'react-router';
import { Icon } from '../components/Icon';
import { useTranslate } from '../hooks/useTranslate';

interface ErrorProps {
  onRetry: () => void;
  subtitle: string;
}

export const Error: React.FC<ErrorProps> = ({ onRetry, subtitle }) => {
  const navigate = useNavigate();
  const { t } = useTranslate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <Icon name="incognito" className="size-60" />
      <p className="text-xl px-3 text-center">{t('no-info-title')}</p>
      <p className="text-gray-600 px-3 text-center">{subtitle}</p>
      <div className="flex gap-4">
        <button
          className="bg-gray-200 py-3 px-5 rounded-full text-gray-700 font-light"
          onClick={() => navigate(-1)}
        >
          <Icon
            name="arrow-left"
            className="inline-block w-6 h-6 mr-2 align-middle"
          />
          {t('go-back')}
        </button>
        <button
          className="bg-gray-400 py-3 px-5 rounded-full text-white font-bold"
          onClick={onRetry}
        >
          <Icon
            name="refresh"
            className="inline-block w-6 h-6 mr-2 align-middle"
          />
          {t('retry')}
        </button>
      </div>
    </div>
  );
};
