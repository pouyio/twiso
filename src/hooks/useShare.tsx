export const useShare = () => {
  const share = async (text: string): Promise<'shared' | 'copied'> => {
    let navigator: any = window.navigator;
    if (navigator.share) {
      navigator.share({
        text,
        title: 'Twiso',
        url: window.location.href,
      });
      return 'shared';
    }

    await navigator.clipboard.writeText(window.location.href);
    return 'copied';
  };

  return {
    share,
  };
};
