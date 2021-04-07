import { FundingTypeEnum } from './Enums/FundingTypeEnum';
import { CreateCommonInput, CreateCommonMutation } from './Mutations/CreateCommon.mutation';

import { GetCommonQuery } from './Queries/GetCommon.query';

import { GetCommonsQuery } from './Queries/GetCommons.query';
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

  CommonCommonMemberExtension
];