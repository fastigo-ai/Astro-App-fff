export interface IContentBlock {
  type: 'video' | 'image' | 'text' | 'steps';
  url?: string;
  text?: string;
  steps?: string[];
}

export interface IActivity {
  _id?: string;
  id?: string;
  title: string;
  type: string;
  duration: string;
  color: string;
  iconName: string;
  contentBlocks: IContentBlock[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

