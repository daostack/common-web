import { ButtonVariant } from "../Button";
import { LoaderColor } from "./Loader";

export const getLoaderColor = (buttonVariant: ButtonVariant) => {
  return buttonVariant === ButtonVariant.PrimaryPurple
    ? LoaderColor.White
    : LoaderColor.Default;
};
