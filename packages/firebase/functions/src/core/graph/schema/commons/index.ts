import { CommonContributionTypeEnum } from './enums/CommonContributionType.enum';

import { CommonMemberType } from './types/CommonMember.type';
import { CommonMetadataType } from './types/CommonMetadata.type';

import { CommonMembersExtension } from './extensions/CommonMembers.extension';
import { CommonProposalsExtension } from './extensions/CommonProposals.extension';
import { CommonMemberUserExtension } from './extensions/CommonMemberUser.extension';
import { CommonOpenJoinRequestsExtension } from './extensions/CommonOpenJoinRequestExtension';
import { CommonOpenFundingRequestsExtension } from './extensions/CommonOpenFundingRequests.extension';

import { GetCommonQuery } from './queries/GetCommon.query';
import { GetCommonsQuery } from './queries/GetCommons.query';

import { RefreshCommonMembersMutation } from './mutations/refreshCommonMembers.mutation';

export const CommonTypes = [
  CommonContributionTypeEnum,

  CommonMemberType,
  CommonMetadataType,

  CommonMembersExtension,
  CommonProposalsExtension,
  CommonMemberUserExtension,
  CommonOpenJoinRequestsExtension,
  CommonOpenFundingRequestsExtension,

  GetCommonQuery,
  GetCommonsQuery,

  RefreshCommonMembersMutation
]