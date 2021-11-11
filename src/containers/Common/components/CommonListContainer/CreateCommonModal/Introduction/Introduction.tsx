import React, { useEffect } from "react";

import { isMobile } from "../../../../../shared/utils";
import "./index.scss";

interface IntroductionProps {
  setTitle: (title: string) => void;
}

export default function Introduction({ setTitle }: IntroductionProps) {
  useEffect(() => {
    setTitle('Create a Common');
  }, []);

  return (
    <div>Introduction</div>
  );
}
