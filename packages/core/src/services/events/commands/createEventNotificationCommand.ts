import { Event, EventType, NotificationType } from '@prisma/client';
import { notificationService } from '@services';

export const createEventNotificationCommand = async (event: Event): Promise<void> => {
  switch (event.type) {
    case EventType.JoinRequestAccepted:
      await notificationService.create({
        type: NotificationType.RequestToJoinAccepted,
        userId: event.userId!
      });
  }
};