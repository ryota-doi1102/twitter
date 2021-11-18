import type { AppProps } from 'next/app';
import 'sanitize.css';

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  return <Component {...pageProps} />;
};

export default App;
