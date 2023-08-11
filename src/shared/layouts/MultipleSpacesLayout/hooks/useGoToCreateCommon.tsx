import { useHistory } from "react-router-dom";
import { ROUTE_PATHS } from "@/shared/constants";

const useGoToCreateCommon = (): (() => void) => {
  const history = useHistory();
  const goToCreateCommon = (): void => {
    history.push(ROUTE_PATHS.COMMON_CREATION);
  };

  return goToCreateCommon;
};

export default useGoToCreateCommon;
