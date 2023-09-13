import React from "react";
import { NavLink } from "react-router-dom";
import { CommonService, UserService } from "@/services";
import { SystemDiscussionMessageType } from "@/shared/constants";
import {
  Common,
  CommonCreatedSystemMessage,
  CommonEditedSystemMessage,
  CommonFeedItemCreatedSystemMessage,
  CommonFeedType,
  CommonMemberAddedSystemMessage,
  SystemMessageCommonType,
  User,
} from "@/shared/models";
import {
  getCommonPageAboutTabPath,
  getCommonPagePath,
  getUserName,
} from "@/shared/utils";
import { UserMention } from "../components";
import { Text, TextData } from "../types";
import { getFeedItemDisplayingData } from "./getFeedItemDisplayingData";
import styles from "../ChatMessage.module.scss";

const getUser = async (userId: string, users: User[]): Promise<User | null> =>
  users.find((user) => user.uid === userId) ||
  UserService.getCachedUserById(userId);

const getCommon = async (commonId: string): Promise<Common | null> =>
  CommonService.getCachedCommonById(commonId);

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
      commonId={data.commonId}
      directParent={data.directParent}
      onUserClick={data.onUserClick}
    />
  ) : (
    defaultName
  );

const renderLink = (to: string, name: string): Text => (
  <NavLink className={styles.systemMessageCommonLink} to={to}>
    {name}
  </NavLink>
);

const renderClickableText = (text: string, onClick: () => void): Text => (
  <a className={styles.systemMessageCommonLink} onClick={onClick}>
    {text}
  </a>
);

const getCommonCreatedSystemMessageText = async (
  systemMessageData: CommonCreatedSystemMessage["systemMessageData"],
  data: TextData,
): Promise<Text[]> => {
  const user = await getUser(systemMessageData.userId, data.users);
  const isThisCommonCreated = systemMessageData.commonId === data.commonId;
  const userEl = renderUserMention(user, data);

  if (isThisCommonCreated) {
    return [
      userEl,
      ` created this ${getCommonTypeText(systemMessageData.commonType)}`,
    ];
  }

  const common = await getCommon(systemMessageData.commonId);
  const commonEl = common ? (
    <>
      {" "}
      {renderLink(
        (data.getCommonPagePath || getCommonPagePath)(common.id),
        common.name,
      )}
    </>
  ) : (
    ""
  );

  return [userEl, " created the space", commonEl].filter(Boolean);
};

const getCommonEditedSystemMessageText = async (
  systemMessageData: CommonEditedSystemMessage["systemMessageData"],
  data: TextData,
): Promise<Text[]> => {
  const user = await getUser(systemMessageData.userId, data.users);
  const userEl = renderUserMention(user, data);

  return [
    userEl,
    ` edited this ${getCommonTypeText(systemMessageData.commonType)}’s `,
    renderLink(
      (data.getCommonPageAboutTabPath || getCommonPageAboutTabPath)(
        systemMessageData.commonId,
      ),
      "info",
    ),
  ];
};

const getCommonMemberAddedSystemMessageText = async (
  systemMessageData: CommonMemberAddedSystemMessage["systemMessageData"],
  data: TextData,
): Promise<Text[]> => {
  const user = await getUser(systemMessageData.userId, data.users);
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
    getUser(systemMessageData.userId, data.users),
    getFeedItemDisplayingData(
      systemMessageData.feedItemDataId,
      systemMessageData.feedItemType,
    ),
  ]);
  const userEl = renderUserMention(user, data);
  const title =
    feedItemDisplayingData.title &&
    `${feedItemDisplayingData.title}${
      feedItemDisplayingData.isDeleted ? " (deleted)" : ""
    }`;
  const titleEl = title ? (
    <>
      {" "}
      {feedItemDisplayingData.isDeleted
        ? title
        : renderClickableText(title, () =>
            data.onFeedItemClick?.(systemMessageData.feedItemId),
          )}
    </>
  ) : (
    ""
  );

  return [
    userEl,
    ` created the ${
      systemMessageData.feedItemType === CommonFeedType.Discussion
        ? "discussion"
        : "proposal"
    }`,
    titleEl,
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
    default:
      return null;
  }

  return text.map((item, index) => (
    <React.Fragment key={index}>{item}</React.Fragment>
  ));
};
