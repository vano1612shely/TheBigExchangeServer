export interface ICreatePost {
  title: string;
  header: string;
  content: string;
  keywords: string;
  description: string;
  media: string;
}
export interface IPost {
  id: number;
  createdAt: Date;
  title: string;
  header: string;
  keywords: string;
  description: string;
  content: string;
  media: IMedia[];
}
export interface IUpdatePost {
  id: number;
  header: string;
  title: string;
  content: string;
  keywords: string;
  description: string;
  media: string;
}
export interface IMedia {
  id: number;
  postId: number;
  url: string;
}
