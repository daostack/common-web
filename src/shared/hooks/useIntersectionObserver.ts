import { useState, useEffect } from "react";

function useIntersectionObserver(
  element?: HTMLElement | null,
  rootMargin?: string,
) {
  const [isVisible, setState] = useState(false);

  useEffect(() => {
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(entry.isIntersecting);
      },
      { rootMargin },
    );

    observer.observe(element);

    return () => observer.unobserve(element);
  }, [element, rootMargin]);

  return isVisible;
}
export default useIntersectionObserver;
