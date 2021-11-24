import { Avatar, Divider, Link, List, ListItem, ListItemAvatar, ListItemText, ListSubheader } from '@mui/material';
import NextLink from 'next/link';
import React from 'react';

type Props = {
  tweets: Twitter.Tweet[];
};

const TweetList: React.FC<Props> = (props: Props) => (
  <List subheader={<ListSubheader>タイムライン</ListSubheader>}>
    <Divider />
    {props.tweets.map((tweet) => (
      <React.Fragment key={tweet.id}>
        <ListItem>
          <ListItemAvatar>
            <Avatar alt={tweet.userName} src={tweet.avatarUrl} />
          </ListItemAvatar>
          <ListItemText
            primary={tweet.content}
            secondary={
              <NextLink href={`/users/${tweet.userId}`} passHref>
                <Link underline="none" color="inherit">
                  {tweet.userName}
                </Link>
              </NextLink>
            }
          />
        </ListItem>
        <Divider />
      </React.Fragment>
    ))}
  </List>
);

export default TweetList;
