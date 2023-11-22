import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Theme } from "../constants";
import { toggleTheme } from "../store/actions";
import { selectTheme } from "../store/selectors";

const useLightThemeOnly = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  useEffect(() => {
    if (theme === Theme.Dark) {
      dispatch(toggleTheme(Theme.Light));
    }
  }, [theme, dispatch]);
};

export default useLightThemeOnly;
