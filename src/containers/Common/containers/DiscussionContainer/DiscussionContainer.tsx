import React, { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CommonDetailContainer, Tabs } from "..";
import { fetchDiscussionById } from "../../store/api";
import { Discussion } from "@/shared/models";
import { DynamicLinkType } from "@/shared/constants";

interface DiscussionRouterParams {
  id: string;
}

const DiscussionContainer: FC = () => {
  const { id: discussionId } = useParams<DiscussionRouterParams>();
  const [currentDiscussion, setCurrentDiscussion] = useState<Discussion | null>(null);
  const [currentTab, setCurrentTab] = useState<Tabs | null>(null);

  useEffect(() => {
    if (currentDiscussion || !discussionId)
      return;

    (
      async () => {
        try {
          const requestingDiscussion = await fetchDiscussionById(discussionId);

          setCurrentDiscussion(
            {
              ...requestingDiscussion,
              id: discussionId,
            }
          );
        } catch (error) {
          console.log(error);
        }
      }
    )();
  }, [currentDiscussion, setCurrentDiscussion, discussionId]);

  useEffect(() => {
    if (!currentDiscussion)
      return;
    
    setCurrentTab(Tabs.Discussions);
  },
    [currentDiscussion, setCurrentTab]
  );

  return (
    (currentDiscussion && currentTab)
    && <CommonDetailContainer
      commonId={currentDiscussion.commonId}
      activeModalElement={currentDiscussion}
      linkType={DynamicLinkType.Discussion}
      tab={currentTab}
    />
  );
};

export default DiscussionContainer;
