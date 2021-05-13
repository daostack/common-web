import { FundingTypeEnum } from './Enums/FundingTypeEnum';

import { DelistCommonMutation } from './Mutations/DelistCommon.mutation';
import { WhitelistCommonMutation } from './Mutations/WhitelistCommon.mutation';
import { CreateCommonInput, CreateCommonMutation } from './Mutations/CreateCommon.mutation';

import { GetCommonQuery } from './Queries/GetCommon.query';
import { GetCommonsQuery } from './Queries/GetCommons.query';

import { CommonEventsExtension } from './Extensions/CommonEvents.extension';
import { CommonReportsExtension } from './Extensions/CommonReports.extension';
import { CommonProposalsExtension } from './Extensions/CommonProposals.extension';
import { CommonDiscussionsExtension } from './Extensions/CommonDiscussions.extension';
import { CommonCommonMemberExtension } from './Extensions/CommonCommonMember.extension';
import { CommonActiveProposalsExtension } from './Extensions/CommonActiveProposals.extension';

import { CommonType } from './Types/Common.type';
import { CommonWhereUniqueInput } from './Inputs/CommonWhereUnique.input';
import { CommonLinkInput } from './Inputs/CommonLink.input';


export const CommonTypes = [
  CommonType,

  GetCommonQuery,
  GetCommonsQuery,

  FundingTypeEnum,

  CreateCommonInput,
  CreateCommonMutation,
  DelistCommonMutation,
  WhitelistCommonMutation,

  CommonWhereUniqueInput,
  CommonLinkInput,

  CommonEventsExtension,
  CommonReportsExtension,
  CommonProposalsExtension,
  CommonDiscussionsExtension,
  CommonCommonMemberExtension,
  CommonActiveProposalsExtension
];
