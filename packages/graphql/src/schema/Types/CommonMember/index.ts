import { CommonMemberType } from './Types/CommonMember.type';

import { CommonMemberUserExtension } from './Extensions/CommonMemberUser.extension';
import { CommonMemberCommonExtensions } from './Extensions/CommonMemberCommon.extensions';
import { CommonMemberProposalsExtensions } from './Extensions/CommonMemberProposals.extensions';

import { CommonMemberOrderByInput } from './Inputs/CommonMemberOrderBy.input';
import { CommonMemberRoleEnum } from './Enums/CommonMemberRole.enum';

export const CommonMemberTypes = [
  CommonMemberType,

  CommonMemberUserExtension,
  CommonMemberCommonExtensions,
  CommonMemberProposalsExtensions,

  CommonMemberOrderByInput,

  CommonMemberRoleEnum
];