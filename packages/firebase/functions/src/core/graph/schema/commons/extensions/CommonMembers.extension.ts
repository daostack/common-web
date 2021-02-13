import { extendType } from "nexus";

import { ICommonEntity } from "@common/types";

import { CommonMemberType } from '../types/CommonMember.type';

export const CommonMembersExtension = extendType({
  // @todo Use constants
  type: 'Common',
  definition(t) {
    t.list.field('members', {
      type: CommonMemberType,
      resolve: (root: ICommonEntity) => {
        return root.members.map((member) => ({
          userId: member.userId,
          joinedAt: member.joinedAt,
        }));
      },
    });
  }
})