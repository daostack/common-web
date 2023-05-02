import { AsyncConfirmOptions } from "@/shared/utils/asyncConfirm";

export const DELETE_CONFIRM_OPTIONS: Partial<AsyncConfirmOptions> = {
  description: "Note that this action could not be undone.",
  confirmText: "Delete",
  style: { width: 474 },
};
