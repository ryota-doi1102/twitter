import { Avatar, Card, CardHeader, Button, CardActions, Link } from '@mui/material';
import { format, fromUnixTime } from 'date-fns';
import { useCallback } from 'react';
import { addFollow, deleteFollow } from 'utils/firebase/firestore/follow';
import { User } from 'utils/firebase/firestore/user';
import NextLink from 'next/link';

type Props = {
  user: User;
  loginUserId: string | undefined;
  isFollow: boolean;
  setIsFollow: React.Dispatch<React.SetStateAction<boolean>>;
  onClickChangeUserNameButton: () => void;
};

const UserCard: React.FC<Props> = (props: Props) => {
  const handleClickFollowButton = useCallback(async () => {
    if (props.loginUserId && !props.isFollow) {
      await addFollow({
        followUserId: props.loginUserId,
        followerUserId: props.user.id,
      });
      props.setIsFollow(true);
    }
  }, [props]);

  const handleClickFollowingButton = useCallback(async () => {
    if (props.loginUserId && props.isFollow) {
      await deleteFollow(props.loginUserId, props.user.id);
      props.setIsFollow(false);
    }
  }, [props]);

  return (
    <Card sx={{ margin: 2 }}>
      <CardHeader
        avatar={<Avatar src={props.user.avatarUrl} />}
        title={props.user.name}
        subheader={`${format(fromUnixTime(props.user.createdAt), 'yyyy/MM/dd')}からTwitterを利用開始`}
        action={
          props.loginUserId !== props.user.id ? (
            props.isFollow ? (
              <Button variant="outlined" onClick={handleClickFollowingButton}>
                フォロー中
              </Button>
            ) : (
              <Button variant="contained" onClick={handleClickFollowButton}>
                フォローする
              </Button>
            )
          ) : (
            <Button variant="text" onClick={props.onClickChangeUserNameButton}>
              変更
            </Button>
          )
        }
      />
      <CardActions>
        <NextLink href={`/users/${props.user.id}/follow`} passHref>
          <Link underline="none">フォロー</Link>
        </NextLink>
        <NextLink href={`/users/${props.user.id}/follower`} passHref>
          <Link underline="none">フォロワー</Link>
        </NextLink>
      </CardActions>
    </Card>
  );
};

export default UserCard;
