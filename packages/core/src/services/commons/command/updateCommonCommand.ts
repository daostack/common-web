import * as z from 'zod';
import { Common, EventType } from '@prisma/client';

import { prisma } from '@toolkits';
import { NotFoundError } from '@errors';
import { eventService } from '@services';
import { LinkSchema, RuleSchema } from '@validation';

const schema = z.object({
  commonId: z.string()
    .nonempty(),

  name: z.string()
    .min(2)
    .max(255)
    .optional(),

  image: z.string()
    .optional(),

  description: z.string()
    .optional(),

  action: z.string()
    .optional(),

  byline: z.string()
    .optional(),

  links: z.array(LinkSchema)
    .nullable()
    .optional(),

  rules: z.array(RuleSchema)
    .nullable()
    .optional()
});

export const updateCommonCommand = async (command: z.infer<typeof schema>): Promise<Common> => {
  schema.parse(command);

  // Split the update part from the ID
  const { commonId, ...update } = command;

  // Find the common before the update
  const commonBefore = await prisma.common.findFirst({
    where: {
      id: commonId
    }
  });

  if (!commonBefore) {
    throw new NotFoundError('Cannot find the common selected for update!', commonId);
  }

  // Update the common
  const commonAfter = await prisma.common.update({
    where: {
      id: commonId
    },
    data: update
  });

  // Create event for the common creation
  eventService.create({
    type: EventType.CommonUpdated,
    commonId: commonAfter.id
  });

  // Create the update
  await prisma.commonUpdate.create({
    data: {
      common: {
        connect: {
          id: commonId
        }
      },

      commonBefore: JSON.stringify(commonBefore),
      commonAfter: JSON.stringify(commonAfter),

      change: JSON.stringify(update)
    }
  });


  // Return the created common
  return commonAfter;
};
