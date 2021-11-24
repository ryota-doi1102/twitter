import { ListItem, ListItemButton, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { User } from 'utils/firebase/firestore/user';

type Props = {
  user: User;
};

const UserListItem: React.FC<Props> = (props: Props) => {
  const router = useRouter();

  const handleClickListItemButton = useCallback(() => {
    router.push(`/users/${props.user.id}`);
  }, [props.user.id, router]);

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={handleClickListItemButton}>
        <ListItemAvatar>
          <Avatar alt={props.user.name} src={props.user.avatarUrl} />
        </ListItemAvatar>
        <ListItemText primary={props.user.name} />
      </ListItemButton>
    </ListItem>
  );
};

export default UserListItem;
