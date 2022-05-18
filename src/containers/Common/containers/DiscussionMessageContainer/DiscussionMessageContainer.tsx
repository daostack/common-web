import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CommonDetailContainer, Tabs } from "..";
import { fetchDiscussionMessageById, fetchDiscussionById } from "../../store/api";
import {
  DiscussionMessage,
  DiscussionWithHighlightedMessage,
} from "@/shared/models";
import { DynamicLinkType } from "@/shared/constants";

interface DiscussionMessageRouterParams {
  id: string;
}

const DiscussionMessageContainer = () => {
  const { id: discussionMessageId } = useParams<DiscussionMessageRouterParams>();
  const [currentDiscussionMsg, setCurrentDiscussionMsg] = useState<DiscussionMessage | null>(null);
  const [discussionWithHighlightedMsg, setDiscussionWithHighlightedMsg] = useState<DiscussionWithHighlightedMessage | null>(null);
  const [currentTab, setCurrentTab] = useState<Tabs | null>(null);

  useEffect(() => {
    if (
      currentDiscussionMsg
      || discussionWithHighlightedMsg
      || !discussionMessageId
    ) return;

    (
      async () => {
        try {
          const requestingDiscussionMsg = await fetchDiscussionMessageById(discussionMessageId);
          const relatedDiscussion = await fetchDiscussionById(requestingDiscussionMsg.discussionId);

          setCurrentDiscussionMsg(requestingDiscussionMsg);
          setDiscussionWithHighlightedMsg(
            {
              ...relatedDiscussion,
              highlightedMessageId: discussionMessageId,
              id: requestingDiscussionMsg.discussionId,
            }
          );
        } catch (error) {
          console.log(error);
        }
      }
    )();
  }, [
    currentDiscussionMsg,
    discussionWithHighlightedMsg,
    setCurrentDiscussionMsg,
    setDiscussionWithHighlightedMsg,
    discussionMessageId
  ]);

  useEffect(() => {
    if (!currentDiscussionMsg || !discussionWithHighlightedMsg)
      return;
    
    setCurrentTab(Tabs.Discussions);
  },
    [currentDiscussionMsg, discussionWithHighlightedMsg, setCurrentTab]
  );

  return (
    (currentDiscussionMsg && discussionWithHighlightedMsg && currentTab)
    && <CommonDetailContainer
      commonId={currentDiscussionMsg.commonId}
      activeModalElement={discussionWithHighlightedMsg}
      linkType={DynamicLinkType.DiscussionMessage}
      tab={currentTab}
    />
  );
};

export default DiscussionMessageContainer;
