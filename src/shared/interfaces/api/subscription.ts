import { PaymentAmount } from "@/shared/models";

export interface SubscriptionUpdateData {
  subscriptionId: string;
  price: PaymentAmount;
}
