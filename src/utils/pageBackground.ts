type LibraryStatus = 'watchlist' | 'watched';

export const DEFAULT_PAGE_BACKGROUND = 'var(--color-white)';

export const getMovieBackground = (status?: LibraryStatus) => {
  if (status === 'watched') {
    return 'var(--color-green-400)';
  }
  if (status === 'watchlist') {
    return 'var(--color-blue-400)';
  }
  return 'var(--color-gray-300)';
};

export const getShowBackground = (
  show?: { status?: LibraryStatus; hidden?: boolean } | null
) => {
  if (show?.hidden) {
    return 'var(--color-green-800)';
  }
  if (show?.status === 'watched') {
    return 'var(--color-green-400)';
  }
  if (show?.status === 'watchlist') {
    return 'var(--color-blue-400)';
  }
  return 'var(--color-gray-300)';
};
