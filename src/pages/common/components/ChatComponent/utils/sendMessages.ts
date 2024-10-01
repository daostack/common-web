import { ChatService, DiscussionMessageService } from "@/services";
import { parseStringToTextEditorValue } from "@/shared/ui-kit";
import { checkUncheckedItemsInTextEditorValue } from "@/shared/ui-kit/TextEditor/utils";
import { cacheActions } from "@/store/states";
import { delay } from "lodash";

export const sendMessages = async ({
  newMessagesWithFiles,
  updateChatMessage,
  chatChannel,
  discussionId,
  dispatch
}) => {
  newMessagesWithFiles.map(async (payload, index) => {
    delay(async () => {
      const pendingMessageId = payload.pendingMessageId as string;

      if (chatChannel) {
        const response = await ChatService.sendChatMessage({
          id: pendingMessageId,
          chatChannelId: chatChannel.id,
          text: payload.text || "",
          images: payload.images,
          files: payload.files,
          mentions: payload.tags?.map((tag) => tag.value),
          parentId: payload.parentId,
          hasUncheckedItems: checkUncheckedItemsInTextEditorValue(
            parseStringToTextEditorValue(payload.text),
          ),
          linkPreviews: payload.linkPreviews,
        });
        updateChatMessage(response);
      } else {
        const response = await DiscussionMessageService.createMessage({
          ...payload,
          id: pendingMessageId,
        });

        dispatch(
          cacheActions.updateDiscussionMessageWithActualId({
            discussionId,
            pendingMessageId,
            actualId: response.id,
          }),
        );
      }
    }, 2000 * (index || 1));
  });
};