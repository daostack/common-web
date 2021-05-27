import { createWireCommand } from './commands/createWireCommand';
import { createWireBankDetailsCommand } from './commands/createWireBankDetailsCommand';

export const wireService = {
  create: createWireCommand,
  createWireBankDetails: createWireBankDetailsCommand
};