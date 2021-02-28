export interface IEventObject {
  data: (eventObj: string) => any;
  email?: (notifyData: any) => any;
  notification?: (notifyData: any) => any;
}

export interface IEventData {
  eventObject: (eventObjId: string) => Promise<any>;
  notifyUserFilter: (eventObj: any) => string[] | Promise<string[]>;
}

export interface IEventModel {
  id: string;
  objectId: string;
  type: string;
  createdAt: string;
}
