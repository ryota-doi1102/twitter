import { List, ListSubheader, Divider } from '@mui/material';
import React from 'react';
import { User } from 'utils/firebase/firestore/user';
import UserListItem from './userListItem';

type Props = {
  listHeader: string;
  users: User[];
};

const UserList: React.FC<Props> = (props: Props) => (
  <List subheader={<ListSubheader>{props.listHeader}</ListSubheader>}>
    <Divider />
    {props.users.map((user) => (
      <React.Fragment key={user.id}>
        <UserListItem user={user} />
        <Divider />
      </React.Fragment>
    ))}
  </List>
);

export default UserList;
