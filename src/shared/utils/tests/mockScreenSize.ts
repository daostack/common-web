import { store } from "@/shared/appConfig";
import { ScreenSize } from "@/shared/constants";
import { changeScreenSize } from "@/shared/store/actions";

export const mockScreenSize = (screenSize: ScreenSize = ScreenSize.Desktop) => {
  store.dispatch(changeScreenSize(screenSize));
};
