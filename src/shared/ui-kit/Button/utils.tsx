import { ButtonVariant } from ".";
import { LoaderColor } from "../Loader/Loader";

export const getLoaderColor = (buttonVariant: ButtonVariant) => {
  return buttonVariant === ButtonVariant.PrimaryPurple
    ? LoaderColor.White
    : LoaderColor.Default;
};
