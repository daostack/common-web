import { RefObject, useEffect, useState } from "react";

function useOutsideClick<
  T extends { contains: (target: EventTarget | null) => boolean },
>(ref: RefObject<T>) {
  const [isOutside, setOutside] = useState(false);

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    setOutside(Boolean(ref.current) && !ref?.current?.contains(event.target));
  };

  const setOusideValue = () => {
    setOutside(!isOutside);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  });

  return { isOutside, setOusideValue };
}

export default useOutsideClick;
