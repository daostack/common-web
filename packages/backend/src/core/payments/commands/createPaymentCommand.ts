import * as z from 'zod';
import { EventType, Payment, PaymentType } from '@prisma/client';

import { prisma } from '@toolkits';
import { circleClient } from '@clients';
import { eventsService } from '@services';

import { addPaymentStatusProcessingJob } from '../queue/paymentProcessingQueue';
import { convertAmountToCircleAmount, convertCirclePaymentStatus } from '../helpers';

const schema = z.object({
  amount: z.number()
    .nonnegative(),

  type: z.enum(
    Object.keys(PaymentType) as [(keyof typeof PaymentType)]
  ),

  circleCardId: z.string()
    .nonempty()
    .uuid(),

  connect: z.object({
    commonId: z.string()
      .nonempty()
      .uuid(),

    commonMemberId: z.string()
      .uuid()
      .optional()
      .nullable(),

    userId: z.string()
      .nonempty(),

    joinId: z.string()
      .nonempty()
      .uuid(),

    subscriptionId: z.string()
      .uuid()
      .optional()
      .nullable(),

    cardId: z.string()
      .nonempty()
      .uuid()
  }),

  metadata: z.object({
    ipAddress: z.string()
      .nonempty(),

    email: z.string()
      .nonempty()
      .email()
  })
});

/**
 * Creates new payment with circle and in our database, without polling it for success
 *
 * @param command - The payload for creating the payment
 */
export const createPaymentCommand = async (command: z.infer<typeof schema>): Promise<Payment> => {
  // Validate the payload
  schema.parse(command);

  // Create the payment object in the database
  let payment = await prisma.payment.create({
    data: {
      amount: command.amount,
      type: command.type,

      ...command.connect
    }
  });

  // Create the payment with circle
  const { data: circlePayment } = await circleClient.payments.create({
    metadata: {
      sessionId: payment.id,
      ...command.metadata
    },

    source: {
      type: 'card',
      id: command.circleCardId
    },

    amount: convertAmountToCircleAmount(command.amount),
    idempotencyKey: payment.id,
    verification: 'none',
    description: `Payment for local payment ${payment.id}`
  });

  // Link the circle payment to the database
  payment = await prisma.payment.update({
    where: {
      id: payment.id
    },
    data: {
      circlePaymentId: circlePayment.id,
      circlePaymentStatus: circlePayment.status,
      status: convertCirclePaymentStatus(circlePayment.status)
    }
  });

  // Create event
  await eventsService.create({
    type: EventType.PaymentCreated,
    userId: command.connect.userId,
    commonId: command.connect.commonId
  });

  // Schedule payment processing
  addPaymentStatusProcessingJob(payment.id);

  return payment;
};