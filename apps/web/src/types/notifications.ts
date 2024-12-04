export interface Notification {
  id: string;
  userId: string;
  type: 'signup';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}
