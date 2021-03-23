import { createCardCommand } from './commands/createCardCommand';
import { isCardOwnerQuery } from './queries/isCardOwnerQuery';

export const cardsService = {
  create: createCardCommand,

  isCardOwner: isCardOwnerQuery
};