import { ICommonEntity } from '../../../../../types';
import { proposalDb } from '../../proposals/database';
import { deleteProposal } from '../../proposals/business/deleteProposal';
import { commonDb } from '../database';

export const deleteCommon = async (common: ICommonEntity): Promise<void> => {
  // Find and delete all proposals for the common
  const proposals = await proposalDb.getMany({
    commonId: common.id
  });

  const deleteProposalPromiseArr: Promise<void>[] = [];

  proposals.forEach(proposal => deleteProposalPromiseArr.push(deleteProposal(proposal)));

  await Promise.all(deleteProposalPromiseArr);

  // All the proposal, linked to the proposal should now be deleted. Delete the common
  await commonDb.delete(common.id);

  // Everything is deleted. Log success
  logger.info('Common and related entities successfully deleted!', {
    common,
    proposals
  });
};