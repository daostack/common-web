import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StorageKey } from "@/shared/constants";
import { changeTheme } from "@/shared/store/actions";
import { selectTheme } from "@/shared/store/selectors";
import { Theme as Themes } from "../../constants/theme";

const Theme = () => {
  const theme = useSelector(selectTheme());
  const dispatch = useDispatch();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(StorageKey.Theme, theme);
  }, [theme]);

  const handleChange = () => {
    dispatch(changeTheme(theme === Themes.Dark ? Themes.Light : Themes.Dark));
  };

  /**
   * Need design. For now 'Light' theme is the default.
   */
  return <div onClick={handleChange}>Toggle Theme</div>;
};

export default Theme;
