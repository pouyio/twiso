import { AppProps } from 'next/app';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { Alert } from '../components/Alert/Alert';
import '../components/Alert/Alert.css';
import { App } from '../components/App';
import { Providers } from '../components/Providers';
import { AuthProvider } from '../contexts';
import '../css/index.css';
import '../css/tailwind.src.css';
import { StoreProvider } from '../state/store';
import { HeadTags } from '../components/HeadTags';

function MyApp({ Component, pageProps }: AppProps) {
  const [ref, setRef] = useState<HTMLDivElement | null>();
  useEffect(() => {
    document.cookie = `appClient=true; path=/; SameSite=Strict`;
  }, []);

  return (
    <>
      <HeadTags />
      <AuthProvider>
        <StoreProvider>
          <div ref={setRef}>
            <Providers modalRef={ref!}>
              <Head>
                <link rel="shortcut icon" href="/favicon.ico" />
              </Head>
              <Alert />
              <App>
                <Component {...pageProps} />
              </App>
            </Providers>
          </div>
        </StoreProvider>
      </AuthProvider>
    </>
  );
}

export default MyApp;
