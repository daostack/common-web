import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { Separator, UserAvatar } from "@/shared/components";
import { DiscussionMessageOwnerType } from "@/shared/constants";
import { KeyboardKeys } from "@/shared/constants/keyboardKeys";
import { useOutsideClick } from "@/shared/hooks";
import { ChatIcon, PlusIcon } from "@/shared/icons";
import { DotsIcon } from "@/shared/icons";
import { CommonFeedType, Discussion, User } from "@/shared/models";
import { Loader } from "@/shared/ui-kit";
import {
  generateFirstMessage,
  generateOptimisticFeedItem,
  getUserName,
} from "@/shared/utils";
import { commonActions, optimisticActions } from "@/store/states";
import styles from "./MentionDropdown.module.scss";
import { CommonService } from "@/services";

export const MENTION_TAG = "@";

export interface MentionDropdownProps {
  onClick: (user: User) => void;
  onClickDiscussion: (discussion: Discussion) => void;
  onCreateDiscussion: (createdDiscussionCommonId: string, discussionId: string, title: string) => void;
  onClose: () => void;
  users?: User[];
  discussions?: Discussion[];
  initUsers?: User[];
  initDiscussions?: Discussion[];
  shouldFocusTarget?: boolean;
  searchText: string;
  circleVisibility?: string[];
  user?: User | null;
  commonId?: string;
}

const MentionDropdown: FC<MentionDropdownProps> = (props) => {
  const {
    onClick,
    onClickDiscussion,
    onCreateDiscussion,
    users = [],
    discussions = [],
    onClose,
    shouldFocusTarget,
    initUsers = [],
    initDiscussions = [],
    searchText = "",
    circleVisibility,
    user,
    commonId,
  } = props;
  const mentionRef = useRef(null);
  const listRefs = useRef<HTMLLIElement[]>([]);
  const { isOutside, setOutsideValue } = useOutsideClick(mentionRef);
  const dispatch = useDispatch();

  const canCreateDiscussion = !!user && !!commonId;

  const [index, setIndex] = useState(0);
  const [isShowMoreUsers, setIsShowMoreUsers] = useState(false);
  const [isShowMoreDiscussions, setIsShowMoreDiscussions] = useState(false);
  const usersList = useMemo(() => {
    if (isShowMoreUsers) {
      return users;
    }

    return users.slice(0, 5);
  }, [isShowMoreUsers, users]);

  const discussionsList = useMemo(() => {
    if (isShowMoreDiscussions) {
      return discussions;
    }

    return discussions.slice(0, 5);
  }, [isShowMoreDiscussions, discussions]);

  useEffect(() => {
    const allRefs = document.querySelectorAll<HTMLLIElement>(
      `.${styles.content}`,
    );

    listRefs.current = [];
    allRefs.forEach((ref) => listRefs.current.push(ref));
    listRefs.current.sort((a, b) => {
      const tabIndexA = parseInt(a.getAttribute("tabIndex") || "0", 10);
      const tabIndexB = parseInt(b.getAttribute("tabIndex") || "0", 10);
      return tabIndexA - tabIndexB;
    });
  }, [searchText]);

  useEffect(() => {
    if (shouldFocusTarget) {
      // Clear and rebuild listRefs based on current usersList and discussionsList
      listRefs.current = [];
      const allRefs = document.querySelectorAll<HTMLLIElement>(
        `.${styles.content}`,
      );
      allRefs.forEach((ref) => listRefs.current.push(ref));
      // Sort the listRefs by tabIndex
      listRefs.current.sort((a, b) => {
        const tabIndexA = parseInt(a.getAttribute("tabIndex") || "0", 10);
        const tabIndexB = parseInt(b.getAttribute("tabIndex") || "0", 10);
        return tabIndexA - tabIndexB;
      });

      // Find the element with the matching tabIndex and focus it
      const elementToFocus = listRefs.current.find(
        (item) => parseInt(item.getAttribute("tabIndex") || "0", 10) === index,
      );

      if (elementToFocus) {
        elementToFocus.focus();
      }
    }
  }, [index, usersList, discussionsList, shouldFocusTarget]);

  const increment = () => {
    setIndex((value) => {
      const updatedValue = value + 1;
      return updatedValue < listRefs.current.length ? updatedValue : value;
    });
  };

  const decrement = () => {
    setIndex((value) => {
      const updatedValue = value - 1;
      return updatedValue >= 0 ? updatedValue : value;
    });
  };

  useEffect(() => {
    if (isOutside) {
      onClose();
      setOutsideValue();
    }
  }, [isOutside, setOutsideValue, onClose]);

  const onKeyDown = (event) => {
    event.preventDefault();
    switch (event.key) {
      case KeyboardKeys.ArrowUp: {
        decrement();
        break;
      }
      case KeyboardKeys.ArrowDown: {
        increment();
        break;
      }
      case KeyboardKeys.Enter: {
        const currentElement = listRefs.current.find(
          (item) =>
            parseInt(item.getAttribute("tabIndex") || "0", 10) === index,
        );

        if (!currentElement) return;

        const type = currentElement.dataset.type;

        if (type === "user") {
          // Handle user selection
          onClick(users[index]);
        } else if (type === "discussion") {
          // Handle discussion selection
          const discussionIndex =
            index - usersList.length - (users.length > 5 ? 1 : 0);
          onClickDiscussion(discussions[discussionIndex]);
        } else if (type === "toggleUsers") {
          // Toggle "Show More Users"
          setIsShowMoreUsers((prev) => {
            if (!prev && users.length > 5) {
              // If expanding, move focus to the 6th user
              setIndex(5);
            } else {
              // If collapsing, move focus back to the toggleUsers button
              setIndex(5);
            }
            return !prev;
          });
        } else if (type === "toggleDiscussions") {
          // Toggle "Show More Discussions"
          setIsShowMoreDiscussions((prev) => {
            if (!prev && discussions.length > 5) {
              // If expanding, move focus to the 6th discussion
              setIndex(usersList.length + 5);
            } else {
              // If collapsing, move focus back to the toggleDiscussions button
              setIndex(usersList.length + 5);
            }
            return !prev;
          });
        } else if (type === "newDiscussion" && searchText) {
          createDiscussion();
        }
        break;
      }
    }
  };

  const createDiscussion = async () => {
    if (!canCreateDiscussion) {
      return;
    }

    const common = await CommonService.getCachedCommonById(commonId);

    if (!common) {
      return;
    }

    const discussionId = uuidv4();
    const userName = getUserName(user);
    const userId = user.uid;
    const firstMessage = generateFirstMessage({ userName, userId });
    const title = searchText.slice(1);
    const optimisticFeedItem = generateOptimisticFeedItem({
        userId,
        commonId,
        type: CommonFeedType.OptimisticDiscussion,
        circleVisibility: circleVisibility ?? [],
        discussionId,
        title,
        content: firstMessage,
        lastMessageContent: {
          ownerId: userId,
          userName,
          ownerType: DiscussionMessageOwnerType.System,
          content: firstMessage,
        },
        shouldFocus: false
      });
    dispatch(
      optimisticActions.setOptimisticFeedItem({
        data: optimisticFeedItem,
        common
      }),
    );

    dispatch(
      commonActions.createDiscussion.request({
        payload: {
          id: discussionId,
          title,
          message: firstMessage,
          ownerId: userId,
          commonId,
          images: [],
          circleVisibility: circleVisibility ?? [],
        },
        commonId
      }),
    );

    onCreateDiscussion(commonId, discussionId, title);
  };

  const getRef = (element) => listRefs.current.push(element);
  const isEmptyContent =
    (initUsers.length > 0 || initDiscussions.length > 0) &&
    users.length === 0 &&
    discussions.length === 0;
  const isLoading = initUsers.length === 0 && initDiscussions.length === 0;

  const calculateNewDiscussionTabIndex = () => {
    let tabIndex = 0;
  
    // Users
    if (users.length > 0) {
      tabIndex += isShowMoreUsers ? users.length : Math.min(users.length, 5); // Visible users
      if (users.length > 5 && !isShowMoreUsers) {
        tabIndex += 1; // "Show More Users" button
      }
    }
  
    // Discussions
    if (discussions.length > 0) {
      tabIndex += isShowMoreDiscussions
        ? discussions.length
        : Math.min(discussions.length, 5); // Visible discussions
      if (discussions.length > 5 && !isShowMoreDiscussions) {
        tabIndex += 1; // "Show More Discussions" button
      }
    }
  
    return tabIndex; // The "New Discussion" button follows all visible items
  };

  return (
    <ul
      tabIndex={0}
      ref={mentionRef}
      className={styles.container}
      data-cy="mentions-portal"
      onKeyDown={onKeyDown}
    >
      {isLoading && (
        <li className={styles.emptyContent}>
          <Loader className={styles.loader} />
        </li>
      )}
      {isEmptyContent && (
        <li className={styles.emptyContent}>
          <p>No results</p>
        </li>
      )}
      {users.length > 0 && <p className={styles.sectionTitle}>People</p>}
      {usersList.map((user, index) => (
        <li
          id={user.uid}
          ref={getRef}
          tabIndex={index}
          key={user.uid}
          data-type="user"
          onClick={() => onClick(user)}
          className={styles.content}
        >
          <UserAvatar
            className={styles.userAvatar}
            userName={getUserName(user)}
            photoURL={user?.photo || user?.photoURL}
          />
          <p className={styles.userName}>{getUserName(user)}</p>
        </li>
      ))}
      {users.length > 5 && !isShowMoreUsers && (
        <li
          ref={getRef}
          tabIndex={usersList.length}
          key="toggleUsers"
          data-type="toggleUsers"
          onClick={() => setIsShowMoreUsers((prev) => !prev)}
          className={styles.content}
        >
          <DotsIcon className={styles.streamIcon} />
          <p className={styles.userName}>{users.length - 5} more results</p>
        </li>
      )}
      {users.length > 0 && discussions.length > 0 && (
        <Separator className={styles.separator} />
      )}
      {discussions.length > 0 && (
        <p className={styles.sectionTitle}>Link to stream</p>
      )}
      {discussionsList.map((discussion, index) => (
        <li
          id={discussion.id}
          ref={getRef}
          tabIndex={usersList.length + (users.length > 5 ? 1 : 0) + index}
          data-type="discussion"
          key={discussion.id}
          onClick={() => onClickDiscussion(discussion)}
          className={styles.content}
        >
          <ChatIcon className={styles.streamIcon} />
          <p className={styles.userName}>{discussion.title}</p>
        </li>
      ))}
      {discussions.length > 5 && !isShowMoreDiscussions && (
        <li
          ref={getRef}
          tabIndex={usersList.length + 1 + discussionsList.length}
          key="toggleDiscussions"
          data-type="toggleDiscussions"
          onClick={() => setIsShowMoreDiscussions((prev) => !prev)}
          className={styles.content}
        >
          <DotsIcon className={styles.streamIcon} />
          <p className={styles.userName}>
            {discussions.length - 5} more results
          </p>
        </li>
      )}
      {((users.length > 0 || discussions.length > 0) && canCreateDiscussion && searchText) && (
        <Separator className={styles.separator} />
      )}
      {(searchText && canCreateDiscussion) && (
        <li
          ref={getRef}
          tabIndex={calculateNewDiscussionTabIndex()}
          key="newDiscussion"
          data-type="newDiscussion"
          onClick={createDiscussion}
          className={styles.content}
        >
          <PlusIcon className={styles.streamIcon} />
          <p className={styles.userName}>
            New "{searchText.slice(1)}" discussion
          </p>
        </li>
      )}
    </ul>
  );
};

export default MentionDropdown;
