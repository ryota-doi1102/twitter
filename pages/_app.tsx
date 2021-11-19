import Header from 'components/header';
import AuthContext, { AuthContextProvider } from 'contexts/authContext';
import type { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  const authContextProvider = AuthContextProvider();

  console.log(authContextProvider.currentUser?.id);

  return (
    <AuthContext.Provider value={authContextProvider}>
      <Header />
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
};

export default App;
