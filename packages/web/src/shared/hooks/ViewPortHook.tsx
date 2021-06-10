import { useState, useEffect } from "react";

function useViewPortHook(element: any, rootMargin: string) {
  const [isVisible, setState] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(entry.isIntersecting);
      },
      { rootMargin },
    );
    console.log(element);

    element && observer.observe(element);

    return () => element && observer.unobserve(element);
  }, [element, rootMargin]);

  return isVisible;
}
export default useViewPortHook;
