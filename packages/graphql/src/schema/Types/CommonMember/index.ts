import { CommonMemberType } from './Types/CommonMember.type';
import { CommonMemberUserExtension } from './Extensions/CommonMemberUser.extension';
import { CommonMemberCommonExtensions } from './Extensions/CommonMemberCommon.extensions';
import { CommonMemberOrderByInput } from './Inputs/CommonMemberOrderBy.input';
import { CommonMemberRoleEnum } from './Enums/CommonMemberRole.enum';

export const CommonMemberTypes = [
  CommonMemberType,

  CommonMemberUserExtension,
  CommonMemberCommonExtensions,

  CommonMemberOrderByInput,

  CommonMemberRoleEnum
];