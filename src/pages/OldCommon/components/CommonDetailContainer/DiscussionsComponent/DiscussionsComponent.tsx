import React from "react";
import { Tabs } from "@/pages/OldCommon";
import { Common, Discussion, Governance } from "@/shared/models";
import { EmptyTabComponent } from "../EmptyTabContent";
import DiscussionItemComponent from "./DiscussionItemComponent";
import "./index.scss";

interface DiscussionsComponentProps {
  discussions: Discussion[];
  loadDiscussionDetail: (payload: Discussion) => void;
  common: Common;
  governance: Governance;
  isCommonMember: boolean;
  isCommonMemberFetched: boolean;
  isJoiningPending: boolean;
  onAddNewPost: () => void;
}

export default function DiscussionsComponent({
  discussions,
  loadDiscussionDetail,
  common,
  governance,
  isCommonMember,
  isCommonMemberFetched,
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
          </div>
        )}
      </div>
      <div className="discussions-component-wrapper">
        {discussions.length > 0 ? (
          <>
            {discussions.map((d) => (
              <DiscussionItemComponent
                key={d.id}
                discussion={d}
                loadDiscussionDetail={loadDiscussionDetail}
                governance={governance}
              />
            ))}
          </>
        ) : (
          <EmptyTabComponent
            common={common}
            governance={governance}
            currentTab={Tabs.Discussions}
            message={
              "This is where members can discuss and share their thoughts and ideas."
            }
            title="No discussions yet"
            isCommonMember={isCommonMember}
            isCommonMemberFetched={isCommonMemberFetched}
            isJoiningPending={isJoiningPending}
          />
        )}
      </div>
    </>
  );
}
