import { useCallback, useRef, useState } from "react";
import {
  CancelTokenSource,
  isRequestCancelled,
  getCancelTokenSource,
  Logger,
  CommonService,
} from "@/services";

interface Return {
  areCommonRulesAccepting: boolean;
  areCommonRulesAccepted: boolean;
  acceptCommonRules: (commonId: string) => void;
}

export const useCommonRulesAcceptance = (): Return => {
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);
  const [areCommonRulesAccepting, setAreCommonRulesAccepting] = useState(false);
  const [areCommonRulesAccepted, setAreCommonRulesAccepted] = useState(false);

  const acceptCommonRules = useCallback(async (commonId: string) => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel();
    }

    try {
      setAreCommonRulesAccepting(true);
      setAreCommonRulesAccepted(false);
      cancelTokenRef.current = getCancelTokenSource();

      await CommonService.acceptRules(commonId, {
        cancelToken: cancelTokenRef.current.token,
      });

      cancelTokenRef.current = null;
      setAreCommonRulesAccepted(true);
      setAreCommonRulesAccepting(false);
    } catch (error) {
      if (!isRequestCancelled(error)) {
        Logger.error(error);
        cancelTokenRef.current = null;
        setAreCommonRulesAccepting(false);
      }
    }
  }, []);

  return {
    areCommonRulesAccepting,
    areCommonRulesAccepted,
    acceptCommonRules,
  };
};
