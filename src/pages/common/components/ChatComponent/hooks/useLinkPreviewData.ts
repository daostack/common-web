import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CancelTokenSource } from "axios";
import {
  ChatService,
  getCancelTokenSource,
  isRequestCancelled,
  Logger,
} from "@/services";
import { useLoadingState } from "@/shared/hooks";
import { LoadingState, PreviewData } from "@/shared/interfaces";
import { serializeTextEditorValue, TextEditorValue } from "@/shared/ui-kit";
import { extractUrls } from "@/shared/utils";

interface Return {
  currentUrl: string;
  urls: string[];
  previewDataState: LoadingState<PreviewData | null>;
  onPreviewDataReset: () => void;
}

export const useLinkPreviewData = (message: TextEditorValue): Return => {
  const [currentUrl, setCurrentUrl] = useState("");
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);
  const [previewDataState, setPreviewDataState] =
    useLoadingState<PreviewData | null>(null);
  const urls = useMemo(
    () => extractUrls(serializeTextEditorValue(message)),
    [message],
  );

  const handlePreviewDataReset = useCallback(() => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel();
      cancelTokenRef.current = null;
    }

    setPreviewDataState({
      loading: false,
      fetched: false,
      data: null,
    });
    // TODO: clear data in ChatComponent
  }, []);

  useEffect(() => {
    if (urls.length === 0) {
      setCurrentUrl("");
      return;
    }
    if (urls.includes(currentUrl)) {
      return;
    }

    setCurrentUrl(urls[0]);
  }, [urls]);

  useEffect(() => {
    if (!currentUrl) {
      if (previewDataState.data) {
        handlePreviewDataReset();
      }

      return;
    }

    (async () => {
      try {
        if (cancelTokenRef.current) {
          cancelTokenRef.current.cancel();
        }

        cancelTokenRef.current = getCancelTokenSource();
        setPreviewDataState({
          loading: true,
          fetched: false,
          data: null,
        });

        const data = await ChatService.getLinkPreviewData(currentUrl, {
          cancelToken: cancelTokenRef.current.token,
        });
        cancelTokenRef.current = null;
        setPreviewDataState({
          loading: false,
          fetched: true,
          data,
        });
      } catch (err) {
        if (!isRequestCancelled(err)) {
          Logger.error(err);
          cancelTokenRef.current = null;
          setPreviewDataState({
            loading: false,
            fetched: true,
            data: null,
          });
        }
      }
    })();
  }, [currentUrl]);

  return {
    currentUrl,
    urls,
    previewDataState,
    onPreviewDataReset: handlePreviewDataReset,
  };
};
