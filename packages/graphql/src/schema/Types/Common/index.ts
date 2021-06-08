import { FundingTypeEnum } from './Enums/FundingTypeEnum';

import { UpdateCommonMutation } from './Mutations/UpdateCommon.mutation';
import { DelistCommonMutation } from './Mutations/DelistCommon.mutation';
import { WhitelistCommonMutation } from './Mutations/WhitelistCommon.mutation';
import { CreateCommonInput, CreateCommonMutation } from './Mutations/CreateCommon.mutation';

import { GetCommonQuery } from './Queries/GetCommon.query';
import { GetCommonsQuery } from './Queries/GetCommons.query';

import { CommonEventsExtension } from './Extensions/CommonEvents.extension';
import { CommonReportsExtension } from './Extensions/CommonReports.extension';
import { CommonUpdatesExtension } from './Extensions/CommonUpdates.extension';
import { CommonProposalsExtension } from './Extensions/CommonProposals.extension';
import { CommonDiscussionsExtension } from './Extensions/CommonDiscussions.extension';
import { CommonCommonMemberExtension } from './Extensions/CommonCommonMember.extension';
import { CommonActiveProposalsExtension } from './Extensions/CommonActiveProposals.extension';

import { CommonType } from './Types/Common.type';
import { CommonUpdateType } from './Types/CommonUpdate.type';

import { CommonRuleInput } from './Inputs/CommonRule.input';
import { CommonLinkInput } from './Inputs/CommonLink.input';
import { CommonWhereInput } from './Inputs/CommonWhere.input';
import { CommonWhereUniqueInput } from './Inputs/CommonWhereUnique.input';


export const CommonTypes = [
  CommonType,
  CommonUpdateType,

  GetCommonQuery,
  GetCommonsQuery,

  FundingTypeEnum,

  CreateCommonInput,
  CreateCommonMutation,
  UpdateCommonMutation,
  DelistCommonMutation,
  WhitelistCommonMutation,

  CommonLinkInput,
  CommonRuleInput,
  CommonWhereInput,
  CommonWhereUniqueInput,

  CommonEventsExtension,
  CommonReportsExtension,
  CommonUpdatesExtension,
  CommonProposalsExtension,
  CommonDiscussionsExtension,
  CommonCommonMemberExtension,
  CommonActiveProposalsExtension
];
