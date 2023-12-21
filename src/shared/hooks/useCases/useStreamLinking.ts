import { useCallback, useRef, useState } from "react";
import {
  CancelTokenSource,
  CommonFeedService,
  isRequestCancelled,
  getCancelTokenSource,
  Logger,
} from "@/services";
import { LinkStreamPayload } from "@/shared/interfaces";

interface State {
  isStreamLinking: boolean;
  isStreamLinked: boolean;
}

interface Return extends State {
  linkStream: (payload: LinkStreamPayload) => void;
}

export const useStreamLinking = (): Return => {
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);
  const [state, setState] = useState<State>({
    isStreamLinking: false,
    isStreamLinked: false,
  });

  const linkStream = useCallback(async (payload: LinkStreamPayload) => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel();
    }

    try {
      setState({
        isStreamLinking: true,
        isStreamLinked: false,
      });
      cancelTokenRef.current = getCancelTokenSource();

      await CommonFeedService.linkStream(payload, {
        cancelToken: cancelTokenRef.current.token,
      });

      cancelTokenRef.current = null;
      setState({
        isStreamLinking: false,
        isStreamLinked: true,
      });
    } catch (error) {
      if (!isRequestCancelled(error)) {
        Logger.error(error);
        cancelTokenRef.current = null;
        setState({
          isStreamLinking: false,
          isStreamLinked: false,
        });
      }
    }
  }, []);

  return {
    ...state,
    linkStream,
  };
};
