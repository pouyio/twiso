import { Link } from 'react-router';
import { Icon } from './Icon';

export const EmptyState = () => (
  <div className="bg-gray-100 max-w-80 m-auto mt-12 rounded-3xl p-5">
    <div className="text-center">
      <Icon name="ufo" />
      <h1 className="my-5 text-2xl font-bold">Nothing to see here yet</h1>
      <p className="my-5 font-thin">
        Start following a show or add a movie to your watchlist
      </p>
      <Link
        to="/search"
        className="bg-gray-200 py-2 px-6 rounded-full text-gray-700 inline-block"
      >
        Go for it!
      </Link>
    </div>
  </div>
);
