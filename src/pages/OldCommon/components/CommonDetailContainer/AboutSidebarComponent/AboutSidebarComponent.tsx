import React, { useMemo } from "react";
import { Common } from "@/shared/models";
import { parseStringToTextEditorValue, TextEditor } from "@/shared/ui-kit";
import "./index.scss";

interface AboutSidebarComponentProps {
  title: string;
  common: Common;
  vievAllHandler: () => void;
}

export default function AboutSidebarComponent({
  title,
  vievAllHandler,
  common,
}: AboutSidebarComponentProps) {
  const description = common.description;
  const parsedDescription = useMemo(
    () => parseStringToTextEditorValue(description),
    [description],
  );

  return description ? (
    <div className="about-sidebar-wrapper">
      <div className="title-wrapper">
        <div className="title">{title}</div>
        <div className="view-all" onClick={vievAllHandler}>
          View full agenda
        </div>
      </div>
      <TextEditor value={parsedDescription} readOnly />
    </div>
  ) : null;
}
