export interface Item {
  id: string;
  image: string;
  name: string;
  path: string;
  notificationsAmount?: number;
  items?: Item[];
}
