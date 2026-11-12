export interface IBabyBump {
  _id?: string;
  id?: string;
  userId?: string;
  phone?: string;
  photoUrl: string;
  caption?: string;
  month?: number;
  week?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

