import { enumType } from "nexus";

export const PayoutStatusEnum = enumType({
  name: 'PayoutStatus',
  members: [
    'pending',
    'complete',
    'failed'
  ]
})