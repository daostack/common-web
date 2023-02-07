import { Colors } from "@/shared/constants";

export const selectorStyles = (hasError: boolean) => ({
  menu: (provided) => ({ ...provided, zIndex: 10000 }),
  menuPortal: (provided) => ({ ...provided, zIndex: 10000 }),
  control: (provided) => ({
    ...provided,
    height: "3rem",
    ...(hasError && { borderColor: Colors.error }),
  }),
  indicatorSeparator: () => ({ display: "none" }),
  indicatorsContainer: (provided) => ({
    ...provided,
    color: `${Colors.black} !important`,
  }),
});
