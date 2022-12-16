import { EventEmitter } from "eventemitter3";

// clear-common-member-{common-member-id}
// reset-common-member-{common-member-id}
export type CommonMemberEvent =
  | `clear-common-member-${string}`
  | `reset-common-member-${string}`;

class CommonMemberEventEmitter extends EventEmitter<CommonMemberEvent> {}

export default new CommonMemberEventEmitter();
