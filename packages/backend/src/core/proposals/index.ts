import { createJoinProposalCommand } from './join/command/createJoinProposalCommand';

export const joinProposalService = {
  commands: {
    create: createJoinProposalCommand
  }
};

export const proposalsService = {
  join: joinProposalService
};