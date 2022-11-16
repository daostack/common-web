export interface Item {
  id: string;
  image: string;
  name: string;
  path: string;
  hasMembership?: boolean;
  notificationsAmount?: number;
  items?: Item[];
}
