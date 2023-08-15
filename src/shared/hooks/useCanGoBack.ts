import { useLocation } from "react-router-dom";

export const useCanGoBack = (): boolean => {
  const location = useLocation();

  return Boolean(location.key);
};
