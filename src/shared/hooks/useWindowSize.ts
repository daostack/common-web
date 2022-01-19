import { useEffect, useState } from "react";

interface Return {
  width?: number;
  height?: number;
}

const useWindowSize = (): Return => {
  const [windowSize, setWindowSize] = useState<Return>({});

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

export default useWindowSize;
