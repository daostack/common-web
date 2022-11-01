import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectIsRtlLanguage } from "@/shared/store/selectors";

const RTL_CLASSNAME = "direction--rtl";
const LTR_CLASSNAME = "direction--ltr";

const TextDirectionHandler: FC = () => {
  const isRtlLanguage = useSelector(selectIsRtlLanguage());

  useEffect(() => {
    const classNameToAdd = isRtlLanguage ? RTL_CLASSNAME : LTR_CLASSNAME;
    const classNameToRemove = isRtlLanguage ? LTR_CLASSNAME : RTL_CLASSNAME;

    document.body.classList.remove(classNameToRemove);
    document.body.classList.add(classNameToAdd);
  }, [isRtlLanguage]);

  return null;
};

export default TextDirectionHandler;
