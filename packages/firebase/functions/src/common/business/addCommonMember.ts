import admin from 'firebase-admin';
import { EVENT_TYPES } from '../../event/event';
import { proposalDb } from '../../proposals/database';
import { createEvent } from '../../util/db/eventDbService';
import { CommonError } from '../../util/errors';
import { commonDb } from '../database';
import { ICommonEntity } from '../types';
import Timestamp = admin.firestore.Timestamp;

/**
 * Adds user to the common
 *
 * @param proposalId - The approved proposal
 *
 * @throws { CommonError } - If the passed proposal is not approved
 */
export const addCommonMemberByProposalId = async (proposalId: string): Promise<void> => {
  const proposal = await proposalDb.getProposal(proposalId);

  if (proposal.state !== 'passed') {
    throw new CommonError('Cannot add user from proposal, for witch the proposal is not approved', {
      proposalId
    });
  }

  const common = await commonDb.get(proposal.commonId);

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
  if (!isCommonMember(common, userId)) {
    common.members.push({
      userId,
      joinedAt: Timestamp?.now()
    });

    await commonDb.update(common);

    // Emmit the event
    await createEvent({
      userId,
      objectId: common.id,
      type: EVENT_TYPES.COMMON_MEMBER_ADDED
    });
  }

  return common;
};

const isCommonMember = (common: ICommonEntity, userId: string): boolean =>
  common.members.some((member) => member.userId === userId);