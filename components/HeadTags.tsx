import React from 'react';
import Head from 'next/head';

export const HeadTags: React.FC = () => {
  return (
    <Head>
      <meta charSet="utf-8" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1.0, viewport-fit=cover"
      />
      <meta name="theme-color" content="#000000" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      <link rel="manifest" href="/manifest.json" />
      <title>Twiso</title>
      <meta
        name="description"
        content="Keep track of the movies & shows you watch!"
      />
    </Head>
  );
};
