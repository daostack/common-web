import { NotificationData } from "@/shared/interfaces";
import {
  EventTitleState,
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
    type: data.eventType,
    notificationDate: data.createdAt.toDate(),
    content: proposal.description.title,
    title: EventTitleState[data.eventType],
    actionTitle:
      data?.eventType === EventTypeState.fundingRequestRejected
        ? "Done"
        : "Let's get to work",
    additionalInformation: formatPrice(proposal.fundingRequest?.amount || 0),
  };
}
