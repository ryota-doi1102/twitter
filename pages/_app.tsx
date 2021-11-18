import Header from 'components/header';
import type { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
};

export default App;
