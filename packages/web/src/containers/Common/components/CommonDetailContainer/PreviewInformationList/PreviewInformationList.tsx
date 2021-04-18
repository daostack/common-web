import React from "react";
import "./index.scss";

interface PreviedData {
  id: string;
  value: string;
}
interface PreviewInformationListProps {
  title: string;
  data: PreviedData[];
  vievAllHandler: () => void;
}

export default function PreviewInformationList(props: PreviewInformationListProps) {
  const { title, data, vievAllHandler } = props;
  return (
    <div className="preview-information-wrapper">
      <div className="title-wrapper">
        <div className="title">{title}</div>
        {data.length > 0 ? (
          <div className="view-all" onClick={vievAllHandler}>
            View All
          </div>
        ) : null}
      </div>

      {data.length > 0 ? (
        <div className="information-content">
          {data.map((d) => (
            <div className="item" key={d.id}>
              {d.value}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-information-wrapper">
          <div className="message">No {title} yet</div>
        </div>
      )}
    </div>
  );
}
