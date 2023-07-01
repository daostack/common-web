import { useEffect } from "react";
import { useSelector } from "react-redux";
import { StorageKey } from "@/shared/constants";
import { selectTheme } from "@/shared/store/selectors";

const ThemeHandler = () => {
  const theme = useSelector(selectTheme());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(StorageKey.Theme, theme);
  }, [theme]);

  return null;
};

export default ThemeHandler;
