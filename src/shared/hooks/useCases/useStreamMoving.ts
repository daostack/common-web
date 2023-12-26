import { useCallback, useRef, useState } from "react";
import {
  CancelTokenSource,
  CommonFeedService,
  isRequestCancelled,
  getCancelTokenSource,
  Logger,
} from "@/services";
import { MoveStreamPayload } from "@/shared/interfaces";

interface State {
  isStreamMoving: boolean;
  isStreamMoved: boolean;
}

interface Return extends State {
  moveStream: (payload: MoveStreamPayload) => void;
}

export const useStreamMoving = (): Return => {
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);
  const [state, setState] = useState<State>({
    isStreamMoving: false,
    isStreamMoved: false,
  });

  const moveStream = useCallback(async (payload: MoveStreamPayload) => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel();
    }

    try {
      setState({
        isStreamMoving: true,
        isStreamMoved: false,
      });
      cancelTokenRef.current = getCancelTokenSource();

      await CommonFeedService.moveStream(payload, {
        cancelToken: cancelTokenRef.current.token,
      });

      cancelTokenRef.current = null;
      setState({
        isStreamMoving: false,
        isStreamMoved: true,
      });
    } catch (error) {
      if (!isRequestCancelled(error)) {
        Logger.error(error);
        cancelTokenRef.current = null;
        setState({
          isStreamMoving: false,
          isStreamMoved: false,
        });
      }
    }
  }, []);

  return {
    ...state,
    moveStream,
  };
};
