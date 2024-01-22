import React from "react";
import { NavLink } from "react-router-dom";
import { CommonService, UserService } from "@/services";
import { store } from "@/shared/appConfig";
import { SystemDiscussionMessageType } from "@/shared/constants";
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
  StreamMovedSourceSystemMessage,
  StreamMovedTargetSystemMessage,
  SystemMessageCommonType,
  SystemMessageStreamType,
  User,
} from "@/shared/models";
import {
  getCommonPageAboutTabPath,
  getCommonPagePath,
  getUserName,
} from "@/shared/utils";
import { commonLayoutActions } from "@/store/states";
import { UserMention } from "../components";
import { Text, TextData } from "../types";
import {
  getFeedItemDisplayingData,
  getFeedItemDisplayingTitle,
} from "./getFeedItemDisplayingData";
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

const getCommon = async (commonId: string): Promise<Common | null> =>
  (await CommonService.getCachedCommonById(commonId)) ||
  (await CommonService.getCommonById(commonId, false, CommonState.INACTIVE));

const getCommonTypeText = (commonType: SystemMessageCommonType): string =>
  commonType === SystemMessageCommonType.Common ? "common" : "space";

const handleCommonClick = (commonId: string, rootCommonId?: string) => {
  store.dispatch(
    commonLayoutActions.resetCurrentCommonIdAndProjects(
      rootCommonId || commonId,
    ),
  );
};

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

const renderLink = (to: string, name: string, onClick?: () => void): Text => (
  <NavLink className={styles.systemMessageCommonLink} to={to} onClick={onClick}>
    {name}
  </NavLink>
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
    ? renderLink(path || "", name, () =>
        handleCommonClick(commonId, rootCommonId),
      )
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
  const commonEl = common ? (
    <>
      {" "}
      {common.state === CommonState.ACTIVE
        ? renderLink(
            (data.getCommonPagePath || getCommonPagePath)(common.id),
            common.name,
            () => handleCommonClick(common.id, common.rootCommonId),
          )
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
    renderLink(
      (data.getCommonPageAboutTabPath || getCommonPageAboutTabPath)(
        systemMessageData.commonId,
      ),
      "info",
      () => handleCommonClick(systemMessageData.commonId, common?.rootCommonId),
    ),
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

export const getTextFromSystemMessage = async (
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
    default:
      return null;
  }

  return text.map((item, index) => (
    <React.Fragment key={index}>{item}</React.Fragment>
  ));
};
