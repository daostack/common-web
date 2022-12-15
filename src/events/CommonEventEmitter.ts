import { EventEmitter } from "eventemitter3";
import { Common } from "@/shared/models";

export enum CommonEvent {
  Created = "created",
}

export interface CommonEventToListener {
  [CommonEvent.Created]: (common: Common) => void;
}

class CommonEventEmitter extends EventEmitter<CommonEventToListener> {}

export default new CommonEventEmitter();
