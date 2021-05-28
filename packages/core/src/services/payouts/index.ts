import { createPayoutCommand } from './command/createPayoutCommand';
import { approvePayoutCommand } from './command/approvePayoutCommand';

export const payoutsService = {
  create: createPayoutCommand,

  approve: approvePayoutCommand
};