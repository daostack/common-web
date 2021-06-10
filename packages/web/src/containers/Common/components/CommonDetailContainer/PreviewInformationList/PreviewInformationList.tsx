import React from "react";
import "./index.scss";

interface PreviewData {
  id: string;
  value: string;
}
interface PreviewInformationListProps {
  title: string;
  data: PreviewData[];
  viewAllHandler: () => void;
}

export default function PreviewInformationList(props: PreviewInformationListProps) {
  const { title, data, viewAllHandler } = props;
  return (
    <div className="preview-information-wrapper">
      <div className="title-wrapper">
        <div className="title">{title}</div>
        <div className="view-all" onClick={viewAllHandler}>
          View All
        </div>
      </div>
      <div className="information-content">
        {data.map((d) => (
          <div className="item" key={d.id}>
            {d.value}
          </div>
        ))}
      </div>
    </div>
  );
}
