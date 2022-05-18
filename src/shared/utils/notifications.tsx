import { NotificationData } from "@/shared/interfaces";
import {
  EVENT_TITLE_STATES,
  EventTypeState,
  NotificationItem,
} from "@/shared/models/Notification";
import { formatPrice } from "@/shared/utils/shared";
import { Proposal } from "@/shared/models";

export function getFundingRequestNotification(
  data: NotificationItem,
  proposal: Proposal
): NotificationData {
  return {
    notificationId: data.eventId,
    eventObjectId: data.eventObjectId,
    type: data.eventType,
    notificationDate: data.createdAt.toDate(),
    content: proposal.description.title,
    title: EVENT_TITLE_STATES[data.eventType],
    actionTitle:
      data?.eventType === EventTypeState.fundingRequestRejected
        ? "Done"
        : "Let's get to work",
    additionalInformation: formatPrice(proposal.fundingRequest?.amount || 0),
  };
}
