import React, { ReactNode } from "react";
import classNames from "classnames";
import { CommonMemberPreview } from "@/pages/OldCommon/components/CommonDetailContainer/MembersComponent/CommonMemberPreview";
import avatarPlaceholderSrc from "@/shared/assets/images/avatar-placeholder.svg";
import { MenuButton, UserAvatar } from "@/shared/components";
import { useModal } from "@/shared/hooks";
import { useCommonMemberWithUserInfo } from "@/shared/hooks/useCases/useCommonMemberWithUserInfo";
import { MenuItem } from "@/shared/interfaces";
import { DesktopMenu } from "@/shared/ui-kit";
import { getUserName } from "@/shared/utils";
import styles from "./FeedCardHeader.module.scss";

export interface FeedCardHeaderProps {
  avatar?: string;
  title: string;
  createdAt: ReactNode;
  type: string;
  circleVisibility?: string;
  menuItems?: MenuItem[];
  isMobileVersion?: boolean;
  commonId: string;
  userId: string | undefined;
}

export const FeedCardHeader: React.FC<FeedCardHeaderProps> = (props) => {
  const {
    avatar = avatarPlaceholderSrc,
    title,
    createdAt,
    type,
    circleVisibility,
    menuItems = [],
    isMobileVersion = false,
    commonId,
    userId,
  } = props;
  const { isShowing, onClose, onOpen } = useModal(false);
  const { data: commonMember } = useCommonMemberWithUserInfo(commonId, userId);

  return (
    <div className={styles.container}>
      <div className={styles.content} onClick={onOpen}>
        <UserAvatar
          className={styles.avatar}
          photoURL={avatar}
          userName={title}
          preloaderSrc={avatarPlaceholderSrc}
        />
        <div>
          <p className={classNames(styles.title, styles.text)}>{title}</p>
          <p className={classNames(styles.createdAt, styles.text)}>
            {createdAt}
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <div>
          <p className={classNames(styles.entityType, styles.text)}>{type}</p>
          {circleVisibility && (
            <p className={classNames(styles.visibility, styles.text)}>
              {circleVisibility}
            </p>
          )}
        </div>
        {!isMobileVersion && menuItems.length > 0 && (
          <DesktopMenu
            triggerEl={<MenuButton className={styles.threeDotMenu} />}
            items={menuItems}
          />
        )}
      </div>

      {commonMember && (
        <CommonMemberPreview
          key={commonMember.id}
          member={commonMember}
          circles={commonMember.circleIds[0]}
          memberName={getUserName(commonMember.user)}
          avatar={avatar}
          isShowing={isShowing}
          commonId={commonId}
          country={commonMember.user.country}
          about={commonMember.user.intro}
          onClose={onClose}
        />
      )}
    </div>
  );
};
