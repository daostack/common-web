import { createEventCommand } from './commands/createEventCommand';
import { $createEventCommand } from './commands/$createEventCommand';

import { processEventCommand } from './commands/processEventCommand';

export const eventService = {
  create: createEventCommand,
  $create: $createEventCommand,

  process: processEventCommand
};