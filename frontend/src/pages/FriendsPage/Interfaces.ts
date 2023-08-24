interface IPost {
  _id: string;
  title: string;
  author: any;
  content: string;
  date: string;
  imageUrl: string;
}
interface ITrack {
  trackName: string;
  trackId: string;
  trackArtist: string;
  trackImage: string;
  trackPreview: string;
  trackHref: string;
  _id: string;
}
interface ISettings {
  isClosedProfile: boolean;
  userFavGenre: boolean;
  isClosedMusic: boolean;
  isClosedLikes: boolean;
}

export interface IUserData {
  _id: string;
  name: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  status: string;
  town: string;
  posts: IPost[];
  tracks: ITrack[];
  likedPosts: IPost[];
  settings: ISettings[];
  requests: any[];
  friends: IUserData[];
  notes: string[];
}
