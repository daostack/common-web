import * as z from 'zod';
import { CommonFundingType, Common, CommonMemberRole } from '@prisma/client';
import { prisma } from '@toolkits';
import { createCommonMemberCommand } from './createCommonMemberCommand';
import { addCommonMemberRoleCommand } from './addCommonMemberRoleCommand';

const schema = z.object({
  name: z.string()
    .nonempty()
    .min(2)
    .max(255),

  fundingType: z.enum(Object.keys(CommonFundingType) as [(keyof typeof CommonFundingType)]),

  fundingMinimumAmount: z.number()
    .min(0)
    .max(100000),

  fundingCooldown: z.date(),

  founderId: z.string()
    .uuid()
});

export const createCommonCommand = async (command: z.infer<typeof schema>): Promise<Common> => {
  schema.parse(command);

  // Create the common and save it to the database
  const common = await prisma.common.create({
    data: {
      name: command.name,

      fundingType: command.fundingType,
      fundingCooldown: command.fundingCooldown,
      fundingMinimumAmount: command.fundingMinimumAmount
    }
  });

  // Add the creator as member
  const founder = await createCommonMemberCommand({
    commonId: common.id,
    userId: command.founderId
  });

  // Add the founder role to the creator
  await addCommonMemberRoleCommand({
    memberId: founder.id,
    roles: [
      CommonMemberRole.Founder
    ]
  });

  // @todo Create event for the common creation

  // Return the created common
  return common;
};