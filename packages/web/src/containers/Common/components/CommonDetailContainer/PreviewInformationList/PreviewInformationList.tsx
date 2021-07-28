import React, { useEffect, useState } from "react";

import { ProposalCountDown } from "..";
import { Proposal, Discussion } from "../../../../../shared/models";
import { VotesComponent } from "../VotesComponent";
import "./index.scss";

interface PreviedData {
  id: string;
  value: string;
}
interface PreviewInformationListProps {
  title: string;
  proposals?: Proposal[];
  discussions?: Discussion[];
  vievAllHandler: () => void;
  onClickItem: (id: string) => void;
  type: string;
}

export default function PreviewInformationList(props: PreviewInformationListProps) {
  const [data, setData] = useState<PreviedData[]>([]);
  const { title, vievAllHandler, type, discussions, proposals } = props;

  useEffect(() => {
    if (type === "discussions" && discussions) {
      setData(
        [...discussions].splice(0, 5).map((d) => {
          return { id: d.id, value: d?.title };
        }),
      );
    }
    return () => {
      setData([]);
    };
  }, [type, discussions]);

  useEffect(() => {
    if (type === "proposals" && proposals) {
      setData(
        [...proposals].splice(0, 5).map((d) => {
          return { id: d.id, value: d.title || d.description };
        }),
      );
    }
    return () => {
      setData([]);
    };
  }, [type, proposals]);

  return (
    <div className="preview-information-wrapper">
      <div className="title-wrapper">
        <div className="title">{title}</div>
        {data.length > 0 ? (
          <div className="view-all" onClick={vievAllHandler}>
            View all
          </div>
        ) : null}
      </div>

      {data.length > 0 ? (
        <div className="information-content">
          {data.map((d) => {
            const proposal = proposals?.find((p) => p.id === d.id);
            return (
              <div className="item" key={d.id} onClick={() => props.onClickItem(d.id)}>
                <div className="item-title">{d.value}</div>
                {type === "proposals" && proposal ? (
                  <div className="item-bottom">
                    <div className="votes">
                      <VotesComponent proposal={proposal} type="preview" />
                    </div>
                    <div className="discussion-count">
                      <img src="/icons/discussions.svg" alt="discussions" />
                      <div className="count">{proposal.discussionMessage?.length || 0}</div>
                    </div>
                    <div className="countdown">
                      <ProposalCountDown type="preview" date={new Date(proposal?.expiresAt)} />
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-information-wrapper">
          {title === "Latest Discussions" ? (
            <img src="/icons/empty-discussion-preview.svg" alt="empty-disscussions" />
          ) : (
            <img src="/icons/empty-proposals-preview.svg" alt="empty-proposals" />
          )}
          <div className="message">
            No
            {title === "Latest Discussions" ? " discussions " : " proposals "}
            yet
          </div>
        </div>
      )}
    </div>
  );
}
