import React from "react";
import { Tabs } from "@/pages/OldCommon";
import { GovernanceActions } from "@/shared/constants";
import { Common, CommonMember, Discussion, Governance } from "@/shared/models";
import { hasPermission } from "@/shared/utils";
import { EmptyTabComponent } from "../EmptyTabContent";
import DiscussionItemComponent from "./DiscussionItemComponent";
import "./index.scss";

interface DiscussionsComponentProps {
  discussions: Discussion[];
  loadDiscussionDetail: (payload: { discussion: Discussion }) => void;
  common: Common;
  governance: Governance;
  commonMember: CommonMember | null;
  isCommonMemberFetched: boolean;
  isJoiningPending: boolean;
  onAddNewPost: () => void;
}

export default function DiscussionsComponent({
  discussions,
  loadDiscussionDetail,
  common,
  governance,
  commonMember,
  isCommonMemberFetched,
  isJoiningPending,
  onAddNewPost,
}: DiscussionsComponentProps) {
  const isCommonMember = Boolean(commonMember);
  const isDiscussionCreationAvailable =
    commonMember &&
    hasPermission({
      commonMember,
      governance,
      key: GovernanceActions.CREATE_DISCUSSION,
    });

  return (
    <>
      <div className="discussion-title-wrapper">
        <div className="title">Discussions</div>
        {isDiscussionCreationAvailable && (
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
