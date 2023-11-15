import { Colors } from "@/shared/constants";

export const selectorStyles = (hasError: boolean, isDarkMode: boolean) => ({
  menu: (provided) => ({ ...provided, zIndex: 10000 }),
  menuPortal: (provided) => ({ ...provided, zIndex: 10000 }),
  menuList: (provided) => ({
    ...provided,
    backgroundColor: isDarkMode ? "#2e3452" : "#f8f8f5",
  }),
  control: (provided) => ({
    ...provided,
    height: "3rem",
    ...(hasError && { borderColor: Colors.error }),
    backgroundColor: isDarkMode ? "#2e3452" : "#f8f8f5",
    color: isDarkMode ? "#ffffff" : "#001a36",
    border: "none",
  }),
  option: (provided) => ({
    ...provided,
    backgroundColor: isDarkMode ? "#2e3452" : "#f8f8f5",
    color: isDarkMode ? "#ffffff" : "#001a36",
  }),
  indicatorSeparator: () => ({ display: "none" }),
  indicatorsContainer: (provided) => ({
    ...provided,
    color: isDarkMode ? "#ffffff" : "#001a36",
  }),
  singleValue: (provided) => ({
    ...provided,
    backgroundColor: isDarkMode ? "#2e3452" : "#f8f8f5",
    color: isDarkMode ? "#ffffff" : "#001a36",
  }),
});
