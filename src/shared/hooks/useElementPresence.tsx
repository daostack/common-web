import { useEffect, useState } from "react";

export const useElementPresence = (attribute, value) => {
  const [elementPresent, setElementPresent] = useState(false);

  useEffect(() => {
    const observerCallback = (mutationsList) => {
      mutationsList.forEach((mutation) => {
        // Check for added nodes
        mutation.addedNodes.forEach((node) => {
          if (
            node.nodeType === 1 && // Ensure it's an element
            node.getAttribute(attribute) === value
          ) {
            setElementPresent(true);
          }
        });

        // Check for removed nodes
        mutation.removedNodes.forEach((node) => {
          if (
            node.nodeType === 1 && // Ensure it's an element
            node.getAttribute(attribute) === value
          ) {
            setElementPresent(false);
          }
        });
      });
    };

    const observer = new MutationObserver(observerCallback);

    // Start observing the entire document
    observer.observe(document.body, { childList: true, subtree: true });

    // Check initially if the element is already present
    const initialElement = document.querySelector(`[${attribute}="${value}"]`);
    if (initialElement) {
      setElementPresent(true);
    }

    return () => {
      observer.disconnect(); // Cleanup observer on unmount
    };
  }, [attribute, value]);

  return elementPresent;
};