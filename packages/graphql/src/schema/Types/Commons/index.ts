import { FundingTypeEnum } from './Enums/FundingTypeEnum';
import { CreateCommonInput, CreateCommonMutation } from './Mutations/CreateCommon.mutation';

import { GetCommonQuery } from './Queries/GetCommon.query';
import { GetCommonsQuery } from './Queries/GetCommons.query';

import { CommonEventsExtension } from './Extensions/CommonEvents.extension';
import { CommonProposalsExtension } from './Extensions/CommonProposals.extension';
import { CommonDiscussionsExtension } from './Extensions/CommonDiscussions.extension';
import { CommonCommonMemberExtension } from './Extensions/CommonCommonMember.extension';

import { CommonType } from './Types/Common.type';
import { CommonWhereUniqueInput } from './Inputs/CommonWhereUnique.input';

export const CommonTypes = [
  CommonType,

  GetCommonQuery,
  GetCommonsQuery,

  FundingTypeEnum,

  CreateCommonInput,
  CreateCommonMutation,

  CommonWhereUniqueInput,

  CommonEventsExtension,
  CommonProposalsExtension,
  CommonDiscussionsExtension,
  CommonCommonMemberExtension
];