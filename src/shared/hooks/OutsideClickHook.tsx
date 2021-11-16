import { RefObject, useEffect, useState } from "react";

function useOutsideClick<T extends Node>(ref: RefObject<T>) {
  const [isOutside, setOutside] = useState(false);

  const handleClickOutside = (event: MouseEvent) => {
    setOutside(Boolean(ref.current) && !ref?.current?.contains(event.target as Node));
  };

  const setOusideValue = () => {
    setOutside(!isOutside);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return { isOutside, setOusideValue };
}

export default useOutsideClick;
