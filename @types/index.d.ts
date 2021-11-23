declare namespace Twitter {
  export type Tweet = {
    id: string;
    userName: string;
    avatarUrl: string;
    userId: string;
    content: string;
    createdAt: number;
  };

  type FollowListItem = {
    id: string;
    userId: string;
    userName: string;
    avatarUrl: string;
    createdAt: number;
    isFollow: boolean;
  };
}
