import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Theme } from "../constants";
import { changeTheme } from "../store/actions";
import { selectTheme } from "../store/selectors";

const useLightThemeOnly = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  useEffect(() => {
    if (theme === Theme.Dark) {
      dispatch(changeTheme(Theme.Light));
    }
  }, [theme, dispatch, changeTheme]);
};

export default useLightThemeOnly;
