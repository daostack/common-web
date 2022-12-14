import { EventEmitter } from "eventemitter3";
import { Common } from "@/shared/models";

export enum CommonEvent {
  Created = "created",
}

interface CommonEvents {
  [CommonEvent.Created]: (common: Common) => void;
}

class CommonEventEmitter extends EventEmitter<CommonEvents> {}

export default new CommonEventEmitter();
