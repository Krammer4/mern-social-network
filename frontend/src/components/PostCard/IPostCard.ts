export interface IPostCard {
  title: string;
  authorName: string;
  authorLastName: string;
  content: string;
  postId: string;
  authorEmail: string;
  username: string;
  date: string;
  userId: string;
  authorId: string;
  postImage: string;
  userAvatar: string;
  isRoute?: boolean;
  showSuccessMessage?: any;
  isLikeAvailible?: boolean;
  showWarningMessage?: any;
  isLiked?: boolean;
  setIsLiked?: any;
}
