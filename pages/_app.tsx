import Header from 'components/header';
import AuthContext, { AuthContextProvider } from 'contexts/authContext';
import type { AppProps } from 'next/app';
import GlobalStyles from '@mui/material/GlobalStyles';

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  const authContextProvider = AuthContextProvider();

  return (
    <AuthContext.Provider value={authContextProvider}>
      <GlobalStyles styles={{ body: { margin: 0 } }} />
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
    </AuthContext.Provider>
  );
};

export default App;
