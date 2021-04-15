import { Event, EventType } from '@prisma/client';
import { notificationService } from '@services';

export const createEventNotificationCommand = async (event: Event): Promise<void> => {
  switch (event.type) {
    case EventType.FundingRequestAccepted:
    case EventType.FundingRequestRejected:
    case EventType.JoinRequestAccepted:
    case EventType.JoinRequestRejected:
      await notificationService.create({
        type: event.type,
        userId: event.userId!,
        connect: {
          discussionId: event.discussionId || undefined,
          proposalId: event.proposalId || undefined,
          commonId: event.commonId || undefined
        }
      });
  }
};