import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeTheme } from "@/shared/store/actions";
import { selectTheme } from "@/shared/store/selectors";
import { Theme as Themes } from "../../constants/theme";

const Theme = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  const handleChange = () => {
    dispatch(changeTheme(theme === Themes.Dark ? Themes.Light : Themes.Dark));
  };

  /**
   * Need design. For now 'Light' theme is the default.
   */
  return <div onClick={handleChange}>Toggle Theme</div>;
};

export default Theme;
