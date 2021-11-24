import { Button } from '@mui/material';
import useHomePage from 'hooks/pages/useHomePage';
import { NextPage } from 'next';

const HomePage: NextPage = () => {
  const { handleClickLoginButton } = useHomePage();
  return (
    <Button variant="contained" onClick={handleClickLoginButton}>
      Login
    </Button>
  );
};

export default HomePage;
