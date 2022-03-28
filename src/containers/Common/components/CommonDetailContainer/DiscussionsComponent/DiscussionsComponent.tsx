import React from "react";

import { Common, Discussion } from "../../../../../shared/models";
import { EmptyTabComponent } from "../EmptyTabContent";
import DiscussionItemComponent from "./DiscussionItemComponent";
import "./index.scss";

interface DiscussionsComponentProps {
  discussions: Discussion[];
  loadDisscussionDetail: (payload: Discussion) => void;
  common: Common;
  isCommonMember: boolean;
  isJoiningPending: boolean;
  onAddNewPost: () => void;
}

export default function DiscussionsComponent({
  discussions,
  loadDisscussionDetail,
  common,
  isCommonMember,
  isJoiningPending,
  onAddNewPost,
}: DiscussionsComponentProps) {
  return (
    <>
      <div className="discussion-title-wrapper">
        <div className="title">Discussions</div>
        {isCommonMember && (
          <div className="add-button" onClick={onAddNewPost}>
            <img src="/icons/add-discussion.svg" alt="add-post" />
            <span>Add New Discussion</span>
          </div>)}
      </div>
      <div className="discussions-component-wrapper">
        {discussions.length > 0 ? (
          <>
            {discussions.map((d) => (
              <DiscussionItemComponent
                key={d.id}
                discussion={d}
                loadDisscussionDetail={loadDisscussionDetail}
              />
            ))}
          </>
        ) : (
          <EmptyTabComponent
            common={common}
            currentTab="discussions"
            message={
              "This is where members can discuss and share their thoughts and ideas."
            }
            title="No discussions yet"
            isCommonMember={isCommonMember}
            isJoiningPending={isJoiningPending}
          />
        )}
      </div>
    </>
  );
}
