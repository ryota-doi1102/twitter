import AuthContext from 'contexts/authContext';
import { useRouter } from 'next/router';
import { useContext, useState, useCallback, useEffect } from 'react';
import { getFollowList } from 'utils/firebase/firestore/follow';
import { getUsersTweetList, addTweet } from 'utils/firebase/firestore/tweet';
import { getUser } from 'utils/firebase/firestore/user';

const useTimelinePage = () => {
  const router = useRouter();
  const { loginUser } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [tweetContent, setTweetContent] = useState('');
  const [tweetList, setTweetList] = useState<Twitter.Tweet[]>([]);

  const requestGetTimelineTweet = useCallback(async () => {
    if (!loginUser) return;
    const followList = await getFollowList(loginUser.id);
    const userIdList = followList.map((follow) => follow.followerUserId);
    userIdList.push(loginUser.id);
    const usersTweetList = await getUsersTweetList(userIdList);
    const newTweetList: Twitter.Tweet[] = [];
    const promise = usersTweetList.map(async (usersTweet) => {
      const user = await getUser(usersTweet.userId);
      if (!user) return;
      const tweet: Twitter.Tweet = {
        id: usersTweet.id,
        userId: usersTweet.userId,
        userName: user?.name,
        avatarUrl: user?.avatarUrl,
        content: usersTweet.content,
        createdAt: usersTweet.createdAt,
      };
      newTweetList.push(tweet);
    });
    await Promise.all(promise);
    setTweetList(newTweetList);
  }, [loginUser]);

  useEffect(() => {
    requestGetTimelineTweet();
  }, [requestGetTimelineTweet]);

  const handleClickFab = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setTweetContent('');
  }, []);

  const handleChangeTweetContent: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const value = event.target.value;
    setTweetContent(value);
  }, []);

  const handleClickTweetButton = useCallback(async () => {
    if (!loginUser || tweetContent === '') return;
    await addTweet({
      userId: loginUser.id,
      content: tweetContent,
    });
    setOpen(false);
    setTweetContent('');
    router.reload();
  }, [loginUser, router, tweetContent]);

  return {
    open,
    tweetList,
    tweetContent,
    handleClickFab,
    handleClose,
    handleChangeTweetContent,
    handleClickTweetButton,
  };
};

export default useTimelinePage;
