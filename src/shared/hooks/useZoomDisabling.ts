import { useCallback, useEffect, useRef } from "react";
import {
  DEFAULT_VIEWPORT_CONFIG,
  VIEWPORT_CONFIG_TO_BLOCK_AUTO_ZOOM,
} from "../constants/shared";

const CONTENT_TAG_NAME = "content";

interface Options {
  shouldDisableAutomatically?: boolean;
  shouldRemoveCreatedElement?: boolean;
}

interface Return {
  disableZoom: () => void;
  resetZoom: () => void;
}

const createMetaViewportTag = (
  content = DEFAULT_VIEWPORT_CONFIG
): HTMLMetaElement => {
  const element = document.createElement("meta");
  element.setAttribute("name", "viewport");
  element.setAttribute(CONTENT_TAG_NAME, content);
  document.head.appendChild(element);

  return element;
};

const getViewportMetaElement = (): HTMLMetaElement | null =>
  document.querySelector<HTMLMetaElement>('meta[name="viewport"]');

const useZoomDisabling = (options: Options = {}): Return => {
  const {
    shouldDisableAutomatically = true,
    shouldRemoveCreatedElement = false,
  } = options;
  const previousViewportContentRef = useRef<string | null>(null);

  const disableZoom = useCallback(() => {
    const viewportMeta = getViewportMetaElement();

    if (viewportMeta) {
      previousViewportContentRef.current =
        previousViewportContentRef.current ??
        viewportMeta.getAttribute(CONTENT_TAG_NAME);
      viewportMeta.setAttribute(
        CONTENT_TAG_NAME,
        VIEWPORT_CONFIG_TO_BLOCK_AUTO_ZOOM
      );
    } else {
      previousViewportContentRef.current = null;
      createMetaViewportTag(VIEWPORT_CONFIG_TO_BLOCK_AUTO_ZOOM);
    }
  }, []);

  const resetZoom = useCallback(() => {
    const viewportMeta = getViewportMetaElement();

    if (!viewportMeta) {
      previousViewportContentRef.current = null;
      return;
    }
    if (previousViewportContentRef.current === null && shouldRemoveCreatedElement) {
      viewportMeta.remove();
      return;
    }

    viewportMeta.setAttribute(
      CONTENT_TAG_NAME,
      previousViewportContentRef.current ?? DEFAULT_VIEWPORT_CONFIG
    );
    previousViewportContentRef.current = null;
  }, [shouldRemoveCreatedElement]);

  useEffect(() => {
    if (shouldDisableAutomatically) {
      disableZoom();
    }

    return () => {
      resetZoom();
    };
  }, [shouldDisableAutomatically, disableZoom, resetZoom]);

  return { disableZoom, resetZoom };
};

export default useZoomDisabling;
