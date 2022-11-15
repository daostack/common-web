export interface Item {
  id: string;
  image: string;
  name: string;
  notificationsAmount?: number;
  items?: Item[];
}
