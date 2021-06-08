import * as z from 'zod';
import { FundingType, Common, CommonMemberRole, EventType } from '@prisma/client';

import { prisma } from '@toolkits';
import { eventService } from '@services';
import { LinkSchema, RuleSchema } from '@validation';

import { createCommonMemberCommand } from './createCommonMemberCommand';
import { addCommonMemberRoleCommand } from './addCommonMemberRoleCommand';

const schema = z.object({
  name: z.string()
    .nonempty()
    .min(2)
    .max(255),

  image: z.string()
    .nonempty(),

  description: z.string()
    .nonempty(),

  action: z.string()
    .optional(),

  byline: z.string()
    .optional(),

  fundingType: z.enum(Object.keys(FundingType) as [(keyof typeof FundingType)]),

  fundingMinimumAmount: z.number()
    .min(0)
    .max(100000),

  founderId: z.string()
    .nonempty(),

  links: z.array(LinkSchema)
    .nullable()
    .optional(),

  rules: z.array(RuleSchema)
    .nullable()
    .optional()
});

export const createCommonCommand = async (command: z.infer<typeof schema>): Promise<Common> => {
  schema.parse(command);

  // Create the common and save it to the database
  const common = await prisma.common.create({
    data: {
      name: command.name,

      image: command.image,

      fundingType: command.fundingType,
      fundingMinimumAmount: command.fundingMinimumAmount,
      byline: command.byline,
      links: command.links,
      rules: command.rules
    }
  });

  // Create event for the common creation
  eventService.create({
    type: EventType.CommonCreated,
    commonId: common.id,
    userId: command.founderId
  });

  // Add the creator as member
  const founder = await createCommonMemberCommand({
    commonId: common.id,
    userId: command.founderId
  });

  // Add the founder roles to the creator
  await addCommonMemberRoleCommand({
    memberId: founder.id,
    roles: [
      CommonMemberRole.Founder,
      CommonMemberRole.Moderator
    ]
  });

  // Return the created common
  return common;
};
