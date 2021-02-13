import { ICommonEntity } from '@common/types';
import { objectType } from 'nexus';
import { proposalDb } from '../../../../../proposals/database';
import { ProposalType } from '../../proposals/proposals';
import { CommonMetadataType } from './CommonMetadata.type';

export const CommonType = objectType({
  name: 'Common',
  description: 'The common type',
  definition(t) {
    t.nonNull.id('id', {
      description: 'The unique identifier of the common',
    });

    t.date('createdAt', {
      description: 'The date, at which the common was created',
    });

    t.date('updatedAt', {
      description: 'The date, at which the common was last updated',
    });

    t.nonNull.string('name', {
      description: 'The display name of the common',
    });

    t.nonNull.int('balance', {
      description: 'The currently available funds of the common',
      resolve: (root: ICommonEntity) => Math.round(root.balance),
    });

    t.nonNull.int('raised', {
      description: 'The total amount of money, raised by the common',
      resolve: (root: ICommonEntity) => Math.round(root.raised),
    });

    t.nonNull.field('metadata', {
      type: CommonMetadataType,
    });
  },
});