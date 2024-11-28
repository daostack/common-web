import React from "react";
import { CommonService, UserService } from "@/services";
import { store } from "@/shared/appConfig";
import { SystemDiscussionMessageType } from "@/shared/constants";
import { SpaceListVisibility } from "@/shared/interfaces";
import {
  Common,
  CommonCreatedSystemMessage,
  CommonDeletedSystemMessage,
  CommonEditedSystemMessage,
  CommonFeedItemCreatedSystemMessage,
  CommonFeedItemDeletedSystemMessage,
  CommonFeedType,
  CommonMemberAddedSystemMessage,
  CommonState,
  StreamLinkedInternalSystemMessage,
  StreamLinkedTargetSystemMessage,
  StreamMovedInternalSystemMessage,
  StreamMovedSourceSystemMessage,
  StreamMovedTargetSystemMessage,
  SystemMessageCommonType,
  SystemMessageStreamType,
  User,
  StreamMentionedSystemMessage,
} from "@/shared/models";
import {
  getCommonPageAboutTabPath,
  getCommonPagePath,
  getUserName,
} from "@/shared/utils";
import { selectCommonLayoutProjectsState } from "@/store/states";
import { UserMention } from "../components";
import { Text, TextData } from "../types";
import { getCommon } from "./getCommon";
import {
  getFeedItemDisplayingData,
  getFeedItemDisplayingTitle,
} from "./getFeedItemDisplayingData";
import { handleCommonClick } from "./handleCommonClick";
import { renderLink } from "./renderLink";
import styles from "../ChatMessage.module.scss";

const getUser = async (
  users: User[],
  userId?: string,
): Promise<User | null> => {
  if (!userId) {
    return null;
  }

  return (
    users.find((user) => user.uid === userId) ||
    UserService.getCachedUserById(userId)
  );
};

const getCommonTypeText = (commonType: SystemMessageCommonType): string =>
  commonType === SystemMessageCommonType.Common ? "common" : "space";

const renderUserMention = (
  user: User | null,
  data: TextData,
  defaultName = "A user",
): Text =>
  user ? (
    <UserMention
      users={[user]}
      userId={user.uid}
      displayName={getUserName(user)}
      mentionTextClassName={data.mentionTextClassName}
      onUserClick={data.onUserClick}
    />
  ) : (
    defaultName
  );

const renderClickableText = (text: string, onClick: () => void): Text => (
  <a className={styles.systemMessageCommonLink} onClick={onClick}>
    {text}
  </a>
);

const getCommonLinkWithPartialData = ({
  commonId,
  name = "",
  rootCommonId,
  state,
  path,
}: {
  commonId?: string;
  name?: string;
  rootCommonId?: string;
  state?: CommonState;
  path?: string;
}): Text => {
  if (!commonId) {
    return "";
  }

  return !state || state === CommonState.ACTIVE
    ? renderLink({
        to: path || "",
        name,
        onClick: () => handleCommonClick(commonId, rootCommonId),
      })
    : `${name} (deleted)`;
};

const getCommonLink = (common?: Common | null, path?: string): Text =>
  getCommonLinkWithPartialData({
    commonId: common?.id,
    name: common?.name,
    rootCommonId: common?.rootCommonId,
    state: common?.state,
    path,
  });

const checkHasMembership = async (
  commonId: string,
  userId?: string,
): Promise<boolean> => {
  const { projects } = selectCommonLayoutProjectsState(store.getState());
  const item = projects.find((project) => project.commonId === commonId);

  if (typeof item?.hasMembership !== "undefined") {
    return item.hasMembership;
  }
  if (!userId) {
    return false;
  }

  const commonMember = await CommonService.getCommonMemberByUserId(
    commonId,
    userId,
  );

  return Boolean(commonMember);
};

const getCommonCreatedSystemMessageText = async (
  systemMessageData: CommonCreatedSystemMessage["systemMessageData"],
  data: TextData,
): Promise<Text[]> => {
  const user = await getUser(data.users, systemMessageData.userId);
  const isThisCommonCreated = systemMessageData.commonId === data.commonId;
  const userEl = renderUserMention(user, data);

  if (isThisCommonCreated) {
    return [
      `This ${getCommonTypeText(systemMessageData.commonType)} was created by `,
      userEl,
    ];
  }

  const common = await getCommon(systemMessageData.commonId);

  if (common && common.listVisibility !== SpaceListVisibility.Public) {
    const hasMembership = await checkHasMembership(
      systemMessageData.commonId,
      data.userId,
    );

    if (!hasMembership) {
      return [];
    }
  }

  const commonEl = common ? (
    <>
      {" "}
      {common.state === CommonState.ACTIVE
        ? renderLink({
            to: (data.getCommonPagePath || getCommonPagePath)(common.id),
            name: common.name,
            onClick: () => handleCommonClick(common.id, common.rootCommonId),
          })
        : `${common.name} (deleted)`}
    </>
  ) : (
    ""
  );

  return ["The ", commonEl, " space was created by ", userEl].filter(Boolean);
};

const getCommonEditedSystemMessageText = async (
  systemMessageData: CommonEditedSystemMessage["systemMessageData"],
  data: TextData,
): Promise<Text[]> => {
  const [user, common] = await Promise.all([
    getUser(data.users, systemMessageData.userId),
    getCommon(systemMessageData.commonId),
  ]);
  const userEl = renderUserMention(user, data);

  return [
    `This ${getCommonTypeText(systemMessageData.commonType)}’s `,
    renderLink({
      to: (data.getCommonPageAboutTabPath || getCommonPageAboutTabPath)(
        systemMessageData.commonId,
      ),
      name: "info",
      onClick: () =>
        handleCommonClick(systemMessageData.commonId, common?.rootCommonId),
    }),
    " was edited by ",
    userEl,
  ];
};

const getCommonDeletedSystemMessageText = async (
  systemMessageData: CommonDeletedSystemMessage["systemMessageData"],
  data: TextData,
): Promise<Text[]> => {
  const [user, common] = await Promise.all([
    getUser(data.users, systemMessageData.userId),
    getCommon(systemMessageData.commonId),
  ]);
  const userEl = renderUserMention(user, data);

  return [
    `The ${common?.name || ""} ${getCommonTypeText(
      systemMessageData.commonType,
    )} was deleted by `,
    userEl,
  ];
};

const getCommonMemberAddedSystemMessageText = async (
  systemMessageData: CommonMemberAddedSystemMessage["systemMessageData"],
  data: TextData,
): Promise<Text[]> => {
  const user = await getUser(data.users, systemMessageData.userId);
  const userEl = renderUserMention(user, data);

  return [
    userEl,
    ` joined this ${getCommonTypeText(systemMessageData.commonType)}`,
  ];
};

const getFeedItemCreatedSystemMessageText = async (
  systemMessageData: CommonFeedItemCreatedSystemMessage["systemMessageData"],
  data: TextData,
): Promise<Text[]> => {
  const [user, feedItemDisplayingData] = await Promise.all([
    getUser(data.users, systemMessageData.userId),
    getFeedItemDisplayingData(
      systemMessageData.feedItemDataId,
      systemMessageData.feedItemType,
      data.commonId,
    ),
  ]);
  const userEl = renderUserMention(user, data);
  const title = getFeedItemDisplayingTitle(feedItemDisplayingData);
  const titleEl = title ? (
    <>
      {" "}
      {feedItemDisplayingData.isDeleted || feedItemDisplayingData.isMoved
        ? title
        : renderClickableText(title, () =>
            data.onFeedItemClick?.(systemMessageData.feedItemId),
          )}
    </>
  ) : (
    ""
  );

  return [titleEl, " was created by ", userEl].filter(Boolean);
};

const getFeedItemDeletedSystemMessageText = async (
  systemMessageData: CommonFeedItemDeletedSystemMessage["systemMessageData"],
  data: TextData,
): Promise<Text[]> => {
  const [user, feedItemDisplayingData] = await Promise.all([
    getUser(data.users, systemMessageData.userId),
    getFeedItemDisplayingData(
      systemMessageData.feedItemDataId,
      systemMessageData.feedItemType,
      data.commonId,
    ),
  ]);
  const userEl = renderUserMention(user, data);

  return [`${feedItemDisplayingData.title} was deleted by `, userEl].filter(
    Boolean,
  );
};

const getStreamMovedInternalSystemMessageText = async (
  systemMessageData: StreamMovedInternalSystemMessage["systemMessageData"],
  data: TextData,
): Promise<Text[]> => {
  const [user, sourceCommon, targetCommon] = await Promise.all([
    getUser(data.users, systemMessageData.userId),
    getCommon(systemMessageData.sourceCommonId),
    getCommon(systemMessageData.targetCommonId),
  ]);
  const sourceCommonEl = getCommonLink(
    sourceCommon,
    sourceCommon?.id &&
      (data.getCommonPagePath || getCommonPagePath)(sourceCommon.id),
  );
  const targetCommonEl = getCommonLink(
    targetCommon,
    targetCommon?.id &&
      (data.getCommonPagePath || getCommonPagePath)(targetCommon.id),
  );
  const userEl = renderUserMention(user, data);

  return [
    "This stream was moved from ",
    sourceCommonEl,
    " to ",
    targetCommonEl,
    " by ",
    userEl,
  ].filter(Boolean);
};

const getStreamMovedSourceSystemMessageText = async (
  systemMessageData: StreamMovedSourceSystemMessage["systemMessageData"],
  data: TextData,
): Promise<Text[]> => {
  const [user, common, feedItemDisplayingData] = await Promise.all([
    getUser(data.users, systemMessageData.userId),
    getCommon(systemMessageData.targetCommonId),
    getFeedItemDisplayingData(
      systemMessageData.feedItemDataId,
      systemMessageData.type === SystemMessageStreamType.Discussion
        ? CommonFeedType.Discussion
        : CommonFeedType.Proposal,
      data.commonId,
    ),
  ]);
  const commonEl = getCommonLink(
    common,
    common?.id && (data.getCommonPagePath || getCommonPagePath)(common.id),
  );
  const userEl = renderUserMention(user, data);

  return [
    feedItemDisplayingData.title,
    " was moved to ",
    commonEl,
    " by ",
    userEl,
  ].filter(Boolean);
};

const getStreamMovedTargetSystemMessageText = async (
  systemMessageData: StreamMovedTargetSystemMessage["systemMessageData"],
  data: TextData,
): Promise<Text[]> => {
  const [user, common, feedItemDisplayingData] = await Promise.all([
    getUser(data.users, systemMessageData.userId),
    getCommon(systemMessageData.sourceCommonId),
    getFeedItemDisplayingData(
      systemMessageData.feedItemDataId,
      systemMessageData.type === SystemMessageStreamType.Discussion
        ? CommonFeedType.Discussion
        : CommonFeedType.Proposal,
      data.commonId,
    ),
  ]);
  const commonEl = getCommonLink(
    common,
    common?.id && (data.getCommonPagePath || getCommonPagePath)(common.id),
  );
  const userEl = renderUserMention(user, data);

  return [
    feedItemDisplayingData.title,
    " was moved here from ",
    commonEl,
    " by ",
    userEl,
  ].filter(Boolean);
};

const getStreamLinkedInternalSystemMessageText = async (
  systemMessageData: StreamLinkedInternalSystemMessage["systemMessageData"],
  data: TextData,
): Promise<Text[]> => {
  const [user, targetCommon] = await Promise.all([
    getUser(data.users, systemMessageData.userId),
    getCommon(systemMessageData.targetCommonId),
  ]);
  const targetCommonEl = getCommonLink(
    targetCommon,
    targetCommon?.id &&
      (data.getCommonPagePath || getCommonPagePath)(targetCommon.id),
  );
  const userEl = renderUserMention(user, data);

  return [
    "This stream was linked into ",
    targetCommonEl,
    " by ",
    userEl,
  ].filter(Boolean);
};

const getStreamLinkedTargetSystemMessageText = async (
  systemMessageData: StreamLinkedTargetSystemMessage["systemMessageData"],
  data: TextData,
): Promise<Text[]> => {
  const [user, feedItemDisplayingData] = await Promise.all([
    getUser(data.users, systemMessageData.userId),
    getFeedItemDisplayingData(
      systemMessageData.feedItemDataId,
      systemMessageData.type === SystemMessageStreamType.Discussion
        ? CommonFeedType.Discussion
        : CommonFeedType.Proposal,
      data.commonId,
    ),
  ]);
  const userEl = renderUserMention(user, data);

  return [feedItemDisplayingData.title, " was linked here by ", userEl].filter(
    Boolean,
  );
};

/**
 * Generates the text content for a stream mention system message
 * @param systemMessageData - Data about the stream mention
 * @param data - Context data for text generation
 * @returns Promise resolving to an array of text elements
 */
const getStreamMentionedSystemMessageText = async (
  systemMessageData: StreamMentionedSystemMessage["systemMessageData"],
  data: TextData,
): Promise<Text[]> => {
  try {
    const [user, sourceCommon] = await Promise.all([
      getUser(data.users, systemMessageData.userId),
      getCommon(systemMessageData.sourceStreamId),
    ]);

    // Validate required data
    if (!user || !sourceCommon) {
      console.error('Missing user or source common data for stream mention message');
      return ['This stream was mentioned in another stream'];
    }

    const sourceCommonEl = getCommonLink(
      sourceCommon,
      sourceCommon?.id && (data.getCommonPagePath || getCommonPagePath)(sourceCommon.id),
    );
    const userEl = renderUserMention(user, data);

    return [
      "This stream was mentioned in ",
      sourceCommonEl,
      " by ",
      userEl,
    ].filter(Boolean);
  } catch (error) {
    console.error('Error generating stream mention message text:', error);
    // Fallback to basic message if rendering fails
    return ['This stream was mentioned in another stream'];
  }
};

export const getTextFromSystemMessage = async (
  message: SystemDiscussionMessage,
  data: TextData,
): Promise<Text[] | null> => {
  const { systemMessage } = data;
  let text: Text[] = [];

  if (!systemMessage) {
    return text;
  }

  switch (systemMessage.systemMessageType) {
    case SystemDiscussionMessageType.CommonCreated:
      text = await getCommonCreatedSystemMessageText(
        systemMessage.systemMessageData,
        data,
      );
      break;
    case SystemDiscussionMessageType.CommonEdited:
      text = await getCommonEditedSystemMessageText(
        systemMessage.systemMessageData,
        data,
      );
      break;
    case SystemDiscussionMessageType.CommonDeleted:
      text = await getCommonDeletedSystemMessageText(
        systemMessage.systemMessageData,
        data,
      );
      break;
    case SystemDiscussionMessageType.CommonMemberAdded:
      text = await getCommonMemberAddedSystemMessageText(
        systemMessage.systemMessageData,
        data,
      );
      break;
    case SystemDiscussionMessageType.FeedItemCreated:
      text = await getFeedItemCreatedSystemMessageText(
        systemMessage.systemMessageData,
        data,
      );
      break;
    case SystemDiscussionMessageType.FeedItemDeleted:
      text = await getFeedItemDeletedSystemMessageText(
        systemMessage.systemMessageData,
        data,
      );
      break;
    case SystemDiscussionMessageType.StreamMovedInternal:
      text = await getStreamMovedInternalSystemMessageText(
        systemMessage.systemMessageData,
        data,
      );
      break;
    case SystemDiscussionMessageType.StreamMovedSource:
      text = await getStreamMovedSourceSystemMessageText(
        systemMessage.systemMessageData,
        data,
      );
      break;
    case SystemDiscussionMessageType.StreamMovedTarget:
      text = await getStreamMovedTargetSystemMessageText(
        systemMessage.systemMessageData,
        data,
      );
      break;
    case SystemDiscussionMessageType.StreamLinkedInternal:
      text = await getStreamLinkedInternalSystemMessageText(
        systemMessage.systemMessageData,
        data,
      );
      break;
    case SystemDiscussionMessageType.StreamLinkedTarget:
      text = await getStreamLinkedTargetSystemMessageText(
        systemMessage.systemMessageData,
        data,
      );
      break;
    case SystemDiscussionMessageType.StreamMentioned:
      text = await getStreamMentionedSystemMessageText(
        systemMessage.systemMessageData,
        data,
      );
      break;
    default:
      return null;
  }

  return text.map((item, index) => (
    <React.Fragment key={index}>{item}</React.Fragment>
  ));
};
