import { store } from "@/shared/appConfig";
import { commonLayoutActions } from "@/store/states";

export const handleCommonClick = (commonId: string, rootCommonId?: string) => {
  store.dispatch(
    commonLayoutActions.resetCurrentCommonIdAndProjects(
      rootCommonId || commonId,
    ),
  );
};