interface IPostAuthor {
  name: string;
  lastName: string;
  username: string;
  email: string;
  _id: string;
  avatar: string;
}

export interface IPost {
  _id: string;
  title: string;
  author: IPostAuthor;
  content: string;
  date: string;
  imageUrl: string;
}
