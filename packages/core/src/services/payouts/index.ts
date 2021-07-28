import { createPayoutCommand } from './command/createPayoutCommand';
import { executePayoutCommand } from './command/executePayoutCommand';
import { approvePayoutCommand } from './command/approvePayoutCommand';
import { updatePayoutStatusCommand } from './command/updatePayoutStatusCommand';

export const payoutsService = {
  create: createPayoutCommand,
  execute: executePayoutCommand,
  approve: approvePayoutCommand,
  updateStatus: updatePayoutStatusCommand
};