export interface IEventData {
  data: (eventObj: string) => any;
  email?: (notifyData: any) => any;
  notification?: (notifyData: any) => any;
} 