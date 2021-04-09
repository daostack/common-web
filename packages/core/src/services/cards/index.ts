import { createCardCommand } from './commands/createCardCommand';
import { isCardOwnerQuery } from './queries/isCardOwnerQuery';

export const cardService = {
  create: createCardCommand,

  isCardOwner: isCardOwnerQuery
};