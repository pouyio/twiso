import Emoji from '../components/Emoji';
import { useTranslate } from '../hooks/useTranslate';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { supabase } from '../utils/supabase';

export const VerifyMagicLink: React.FC<React.PropsWithChildren> = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token_hash = params.get('token_hash');
  const redirect = params.get('redirect');
  const { t } = useTranslate();

  useEffect(() => {
    if (token_hash) {
      supabase.auth
        .verifyOtp({
          token_hash,
          type: 'email',
        })
        .then(({ error }) => {
          if (error) {
            console.error(error);
            navigate('/profile');
          } else {
            if (redirect) {
              window.location.href = redirect;
            } else {
              navigate('/movies');
            }
          }
        });
    } else {
      navigate('/search');
    }
  }, [token_hash]);

  return (
    <div className="pt-40 flex flex-col justify-center text-3xl items-center mt-[env(safe-area-inset-top)]">
      <Emoji emoji="⏳" rotating={true} />
      <div className="text-center pt-10 ">{t('loading-session')}</div>
    </div>
  );
};
