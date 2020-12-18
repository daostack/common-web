import { ICommonEntity } from '../types';
import { commonDb } from '../database';
import { proposalDb } from '../../proposals/database';
import { CommonError } from '../../util/errors';
import { createEvent } from '../../util/db/eventDbService';
import { EVENT_TYPES } from '../../event/event';

/**
 * Adds user to the common
 *
 * @param proposalId - The approved proposal
 *
 * @throws { CommonError } - If the passed proposal is not approved
 */
export const addCommonMemberByProposalId = async (proposalId: string): Promise<void> => {
  const proposal = await proposalDb.getProposal(proposalId);

  if(proposal.state !== 'passed') {
    throw new CommonError('Cannot add user from proposal, for witch the proposal is not approved', {
      proposalId
    });
  }

  const common = await commonDb.getCommon(proposal.commonId);

  logger.info('Adding new member to common', {
    common,
    proposal,
    newMemberId: proposal.proposerId
  });

  await addCommonMember(common, proposal.proposerId);
};

/**
 * Adds a user to the members of the passed common. There is no validation
 * being done here and you should more than likely user `addCommonMemberByProposalId`
 *
 * @param common - The common, to which the user will be added
 * @param userId - The ID of the user, that will be added
 */
const addCommonMember = async (common: ICommonEntity, userId: string): Promise<ICommonEntity> => {
  if(!common.members.includes({ userId })) {
    common.members.push({
      userId
    });

    await commonDb.updateCommon(common);

    // Emmit the event
    await createEvent({
      userId,
      objectId: common.id,
      type: EVENT_TYPES.COMMON_MEMBER_ADDED
    })
  }

  return common;
};