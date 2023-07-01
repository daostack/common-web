import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { InviteFriendsButton } from "@/pages/common/components";
import { useRoutesContext } from "@/shared/contexts";
import { useIsTabletView } from "@/shared/hooks/viewport";
import {
  CirclesPermissions,
  Common,
  CommonMember,
  Governance,
} from "@/shared/models";
import { CommonAvatar } from "@/shared/ui-kit";
import { checkIsProject, getPluralEnding } from "@/shared/utils";
import { NewStreamButton, ShareButton } from "./components";
import styles from "./HeaderContent.module.scss";

interface HeaderContentProps {
  className?: string;
  common: Common;
  commonMembersAmount: number;
  commonMember: (CommonMember & CirclesPermissions) | null;
  governance: Governance;
}

const HeaderContent: FC<HeaderContentProps> = (props) => {
  const { className, common, commonMembersAmount, commonMember, governance } =
    props;
  const { getCommonPageAboutTabPath } = useRoutesContext();
  const isMobileVersion = useIsTabletView();

  if (isMobileVersion) {
    return null;
  }

  const isProject = checkIsProject(common);

  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.commonContent}>
        <NavLink
          className={styles.commonLink}
          to={getCommonPageAboutTabPath(common.id)}
        >
          <CommonAvatar
            name={common.name}
            src={common.image}
            className={classNames(styles.image, {
              [styles.imageNonRounded]: !isProject,
              [styles.imageRounded]: isProject,
            })}
          />

          <div className={styles.commonInfoWrapper}>
            <h1 className={styles.commonName}>{common.name}</h1>
            <p className={styles.commonMembersAmount}>
              {commonMembersAmount} member{getPluralEnding(commonMembersAmount)}
            </p>
          </div>
        </NavLink>
      </div>
      <div className={styles.actionButtonsWrapper}>
        <NewStreamButton
          commonId={common.id}
          commonMember={commonMember}
          governance={governance}
          isMobileVersion={isMobileVersion}
        />
        <InviteFriendsButton
          isMobileVersion={isMobileVersion}
          common={common}
          TriggerComponent={ShareButton}
        />
      </div>
    </div>
  );
};

export default HeaderContent;
