import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useCommonMembers } from "@/pages/OldCommon/hooks";
import { DiscussionMessageService } from "@/services";
import { getTextFromTextEditorString } from "@/shared/components/Chat/ChatMessage/utils";
import { useRoutesContext } from "@/shared/contexts";
import {
  checkIsSystemDiscussionMessage,
  checkIsUserDiscussionMessage,
} from "@/shared/models";
import { InternalLinkData } from "@/shared/utils";
import { cacheActions } from "@/store/states";

interface Options {
  discussionId?: string | null;
  commonId?: string;
  onUserClick?: (userId: string) => void;
  onStreamMentionClick?: (feedItemId: string) => void;
  onFeedItemClick?: (feedItemId: string) => void;
  onInternalLinkClick?: (data: InternalLinkData) => void;
}

interface Return {
  preloadDiscussionMessages: (
    circleVisibility?: string[] | null,
    force?: boolean,
  ) => void;
}

export const usePreloadDiscussionMessagesById = ({
  discussionId,
  commonId,
  onUserClick,
  onStreamMentionClick,
  onFeedItemClick,
  onInternalLinkClick,
}: Options): Return => {
  const dispatch = useDispatch();
  const { getCommonPagePath, getCommonPageAboutTabPath } = useRoutesContext();
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const { data: commonMembers, fetchCommonMembers } = useCommonMembers({
    commonId,
  });
  const [forceUpdateFlag, setForceUpdateFlag] = useState(false);

  const preloadDiscussionMessages = useCallback(
    async (circleVisibility, force = false) => {
      fetchCommonMembers(circleVisibility);

      if (force) {
        setForceUpdateFlag((s) => !s);
      }
    },
    [fetchCommonMembers],
  );

  const fetchDiscussionMessages = async () => {
    if (!discussionId) {
      return;
    }

    try {
      const discussionMessages =
        await DiscussionMessageService.getPreloadDiscussionMessagesByDiscussionId(
          discussionId,
        );
  
      const users = commonMembers.map(({ user }) => user);
  
      const discussionsWithText = await Promise.all(
        discussionMessages.map(async (discussionMessage) => {
          const isUserDiscussionMessage =
            checkIsUserDiscussionMessage(discussionMessage);
          const isSystemMessage =
            checkIsSystemDiscussionMessage(discussionMessage);
  
          const parsedText = await getTextFromTextEditorString({
            userId,
            ownerId: isUserDiscussionMessage ? discussionMessage.ownerId : null,
            textEditorString: discussionMessage.text,
            users,
            commonId: discussionMessage.commonId,
            systemMessage: isSystemMessage ? discussionMessage : undefined,
            getCommonPagePath,
            getCommonPageAboutTabPath,
            onUserClick,
            onStreamMentionClick,
            onFeedItemClick,
            onInternalLinkClick,
          });
  
          return {
            ...discussionMessage,
            parsedText,
          };
        }),
      );
  
      dispatch(
        cacheActions.updateDiscussionMessagesStateByDiscussionId({
          discussionId,
          updatedDiscussionMessages: discussionsWithText,
          removedDiscussionMessages: [],
        }),
      );
    } catch(err) {
      dispatch(
        cacheActions.updateDiscussionMessagesStateByDiscussionId({
          discussionId,
          updatedDiscussionMessages: [],
          removedDiscussionMessages: [],
        }),
      );
    }
  };

  useEffect(() => {
    if (!commonMembers || !commonId) {
      return;
    }

    fetchDiscussionMessages();
  }, [commonMembers, discussionId, commonId, forceUpdateFlag]);

  return {
    preloadDiscussionMessages,
  };
};
