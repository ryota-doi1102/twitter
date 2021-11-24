import { NextPage } from 'next';
import React from 'react';
import useTimelinePage from 'hooks/pages/useTimelinePage';
import TweetDialog from 'components/tweetDialog';
import TweetFab from 'components/tweetFab';
import TweetList from 'components/tweetList';

const TimelinePage: NextPage = () => {
  const {
    open,
    tweetList,
    tweetContent,
    handleClickFab,
    handleClose,
    handleChangeTweetContent,
    handleClickTweetButton,
  } = useTimelinePage();
  return (
    <>
      <TweetList subheader="タイムライン" tweets={tweetList} />
      <TweetFab handleClickFab={handleClickFab} />
      <TweetDialog
        open={open}
        handleClose={handleClose}
        tweetContent={tweetContent}
        handleChangeTweetContent={handleChangeTweetContent}
        handleClickTweetButton={handleClickTweetButton}
      />
    </>
  );
};

export default TimelinePage;
