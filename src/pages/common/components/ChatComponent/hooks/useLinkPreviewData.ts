import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CancelTokenSource } from "axios";
import {
  ChatService,
  getCancelTokenSource,
  isRequestCancelled,
  Logger,
} from "@/services";
import { useLoadingState } from "@/shared/hooks";
import { LoadingState, LinkPreviewData } from "@/shared/interfaces";
import { serializeTextEditorValue, TextEditorValue } from "@/shared/ui-kit";
import { extractUrls } from "@/shared/utils";

interface Options {
  message: TextEditorValue;
  onLinkPreviewDataChange: (data?: LinkPreviewData | null) => void;
}

interface Return {
  currentUrl: string;
  urls: string[];
  previewDataState: LoadingState<LinkPreviewData | null>;
  onPreviewDataReset: () => void;
  onPreviewDataHide: () => void;
}

export const useLinkPreviewData = (options: Options): Return => {
  const { message, onLinkPreviewDataChange } = options;
  const [currentUrl, setCurrentUrl] = useState("");
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);
  const [previewDataState, setPreviewDataState] =
    useLoadingState<LinkPreviewData | null>(null);
  const urls = useMemo(
    () => extractUrls(serializeTextEditorValue(message)),
    [message],
  );

  const handlePreviewDataReset = useCallback((shouldFullyReset = false) => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel();
      cancelTokenRef.current = null;
    }

    setPreviewDataState({
      loading: false,
      fetched: false,
      data: null,
    });
    onLinkPreviewDataChange(shouldFullyReset ? undefined : null);
  }, []);

  const handlePreviewDataHide = useCallback(
    () => handlePreviewDataReset(false),
    [handlePreviewDataReset],
  );

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
    if (!currentUrl || currentUrl.startsWith(window.location.origin)) {
      handlePreviewDataReset(true);
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
        onLinkPreviewDataChange(data);
      } catch (err) {
        if (!isRequestCancelled(err)) {
          Logger.error(err);
          cancelTokenRef.current = null;
          setPreviewDataState({
            loading: false,
            fetched: true,
            data: null,
          });
          onLinkPreviewDataChange(null);
        }
      }
    })();
  }, [currentUrl]);

  return {
    currentUrl,
    urls,
    previewDataState,
    onPreviewDataReset: handlePreviewDataReset,
    onPreviewDataHide: handlePreviewDataHide,
  };
};
