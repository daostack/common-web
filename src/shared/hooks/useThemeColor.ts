import { useCallback } from "react";
import { useSelector } from "react-redux";
import { ThemeColors, ThemeColorsValues } from "../constants";
import { selectTheme } from "../store/selectors";

interface Return {
  getThemeColor: (color: ThemeColors) => string;
}

const useThemeColor = (): Return => {
  const theme = useSelector(selectTheme);

  const getThemeColor = useCallback(
    (color: ThemeColors) => {
      return ThemeColorsValues[theme][color];
    },
    [theme],
  );

  return { getThemeColor };
};

export default useThemeColor;
