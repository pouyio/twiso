import Movies from './movie/index';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AuthContext } from '../contexts';
import Login from '../components/Login';
const redirect_url = process.env.REACT_APP_REDIRECT_URL;

const IndexPage = () => {
  const {
    query: { code },
  } = useRouter();
  const { session } = useContext(AuthContext);

  return session ? (
    <Movies />
  ) : (
    <div className="text-center pt-20">
      {code ? (
        <Login code={(code as string) || ''} />
      ) : (
        <a
          className="bg-purple-700 py-3 px-12 rounded-full text-white"
          href={`https://trakt.tv/oauth/authorize?response_type=code&client_id=61afe7ed7ef7a2b6b2193254dd1cca580ba8dee91490df454d78fd68aed7e5f9&redirect_uri=${redirect_url}`}
        >
          Login
        </a>
      )}
    </div>
  );
};

export default IndexPage;
