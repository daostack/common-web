import { EventEmitter } from "eventemitter3";

export enum CommonMemberEvent {
  Clear = "clear",
  Reset = "reset",
}

export interface CommonMemberEventToListener {
  [CommonMemberEvent.Clear]: (commonMemberId: string) => void;
  [CommonMemberEvent.Reset]: (commonId: string, commonMemberId: string) => void;
}

class CommonMemberEventEmitter extends EventEmitter<CommonMemberEventToListener> {}

export default new CommonMemberEventEmitter();
