import { AllocateFundsTo } from "@/shared/constants";
import { NotificationData } from "@/shared/interfaces";
import {
  EVENT_TITLE_STATES,
  EventTypeState,
  NotificationItem,
} from "@/shared/models/Notification";
import { FundsAllocation } from "@/shared/models/governance/proposals";
import { formatPrice } from "@/shared/utils/shared";
import { Currency } from "../models";

export function getFundingRequestNotification(
  data: NotificationItem,
  proposal: FundsAllocation,
): NotificationData {
  return {
    notificationId: data.eventId,
    eventObjectId: data.eventObjectId,
    type: data.eventType,
    notificationDate: data.createdAt.toDate(),
    content: proposal.data.args.title,
    title: EVENT_TITLE_STATES[data.eventType],
    actionTitle:
      data?.eventType === EventTypeState.fundingRequestRejected
        ? "Done"
        : "Let's get to work",
    additionalInformation: formatPrice(
      proposal.data.args.amount || { amount: 0, currency: Currency.ILS },
    ),
  };
}

export const isAcceptedFundsAllocationToSubCommonEvent = (
  proposalTo: AllocateFundsTo,
  eventType: EventTypeState,
): boolean =>
  eventType === EventTypeState.fundingRequestAccepted &&
  proposalTo === AllocateFundsTo.SubCommon;
