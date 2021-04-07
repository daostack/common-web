import * as z from 'zod';
import { FundingType, Common, CommonMemberRole, EventType } from '@prisma/client';

import { prisma } from '../../../domain/toolkits/index';
import { eventService } from '../../index';

import { createCommonMemberCommand } from './createCommonMemberCommand';
import { addCommonMemberRoleCommand } from './addCommonMemberRoleCommand';

const schema = z.object({
  name: z.string()
    .nonempty()
    .min(2)
    .max(255),

  fundingType: z.enum(Object.keys(FundingType) as [(keyof typeof FundingType)]),

  fundingMinimumAmount: z.number()
    .min(0)
    .max(100000),

  fundingCooldown: z.date(),

  founderId: z.string()
    .nonempty()
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

  // Create event for the common creation
  await eventService.create({
    type: EventType.CommonCreated,
    commonId: common.id,
    userId: command.founderId
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

  // Return the created common
  return common;
};
