import { CSSProperties } from "react";
import AlertConfirm from "react-alert-confirm";

export type AsyncConfirmOptions = {
  title: string;
  description?: string;
  style?: CSSProperties;
  confirmText?: string;
  onConfirm: () => Promise<void>;
};
export async function asyncConfirm(options: AsyncConfirmOptions) {
  let resultPromise: Promise<void> | undefined;
  await AlertConfirm({
    title: options.title,
    desc: options.description,
    style: options.style,
    okText: options.confirmText,
    async closeBefore(confirmed) {
      if (resultPromise) {
        await resultPromise;
        return;
      }
      if (!confirmed) return;
      resultPromise = options.onConfirm();
      await resultPromise.catch((err) => {
        resultPromise = undefined;
        AlertConfirm.alert({ title: "There was an error" });
        throw err;
      });
    },
  });
}
