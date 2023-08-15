import { useHistory } from "react-router-dom";

interface Return {
  canGoBack: boolean;
  goBack: () => void;
}

export const useGoBack = (): Return => {
  const history = useHistory();

  return {
    canGoBack: Boolean(history.location.key),
    goBack: history.goBack,
  };
};
