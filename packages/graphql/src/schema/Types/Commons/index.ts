import { CommonType } from './Types/Common.type';
import { FundingTypeEnum } from './Enums/FundingTypeEnum';
import { CreateCommonInput, CreateCommonMutation } from './Mutations/CreateCommon.mutation';
import { GetCommonQuery } from './Queries/GetCommon.query';
import { GetCommonsQuery } from './Queries/GetCommons.query';

export const CommonTypes = [
  CommonType,

  GetCommonQuery,
  GetCommonsQuery,

  FundingTypeEnum,

  CreateCommonInput,
  CreateCommonMutation
];