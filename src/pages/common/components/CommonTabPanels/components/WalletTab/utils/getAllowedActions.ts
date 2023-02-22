import { SupportersData } from "@/shared/models";
import { WalletAction } from "../constants";

export const getAllowedActions = (
  supportersData: SupportersData | null,
): WalletAction[] => (supportersData ? [WalletAction.NewContribution] : []);
