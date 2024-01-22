import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DiscussionMessageService } from "@/services";
import { getTextFromTextEditorString } from "@/shared/components/Chat/ChatMessage/utils";
import { useRoutesContext } from "@/shared/contexts";
import {
  checkIsSystemDiscussionMessage,
  checkIsUserDiscussionMessage,
} from "@/shared/models";
import {
  cacheActions,
} from "@/store/states";
import { useCommonMembers } from "@/pages/OldCommon/hooks";
import { selectUser } from "@/pages/Auth/store/selectors";

interface Options {
  discussionId?: string | null;
  commonId?: string;
  onUserClick?: (userId: string) => void;
  onFeedItemClick?: (feedItemId: string) => void;
}

interface Return {
  preloadDiscussionMessages: (commonId: string, circleVisibility?: string[] | null) => void;
}

export const usePreloadDiscussionMessagesById = ({
  discussionId,
  commonId,
  onUserClick,
  onFeedItemClick,
}: Options): Return => {
  const dispatch = useDispatch();
  const { getCommonPagePath, getCommonPageAboutTabPath } = useRoutesContext();
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const {
    data: commonMembers,
    fetchCommonMembers,
  } = useCommonMembers();

  const preloadDiscussionMessages = useCallback(async (commonId, circleVisibility) => {
    fetchCommonMembers(commonId, circleVisibility);
  },[fetchCommonMembers]);

  const fetchDiscussionMessages = async () => {
    if (!discussionId) {
      return;
    }

    const discussionMessages = await DiscussionMessageService.getPreloadDiscussionMessagesByDiscussionId(discussionId);

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
          onFeedItemClick,
        });

        return {
          ...discussionMessage,
          parsedText,
        };
      }),
    );

    dispatch(
      cacheActions.updateDiscussionMessagesStateByDiscussionId({
        discussionId, updatedDiscussionMessages: discussionsWithText, removedDiscussionMessages: []
      }),
    );
  }

  useEffect(() => {
    if (!commonMembers || !commonId) {
      return
    }

    fetchDiscussionMessages();

  }, [commonMembers, discussionId, commonId]);

  return {
    preloadDiscussionMessages,
  };
};