import React, { FC } from "react";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { useMenuItems } from "@/pages/common/components/CommonTabPanels/components/FeedTab/components/NewStreamButton";
import { useRoutesContext } from "@/shared/contexts";
import { PlusIcon } from "@/shared/icons";
import { animateScroll } from "react-scroll";
import { CommonAction } from "@/shared/constants";
import { commonActions } from "@/store/states";
import { CirclesPermissions, CommonMember, Governance } from "@/shared/models";
import { ButtonIcon, DesktopMenu, MobileMenu } from "@/shared/ui-kit";
import styles from "./NewStreamButton.module.scss";

interface NewStreamButtonProps {
  className?: string;
  isMobileVersion?: boolean;
  commonId: string;
  commonMember: (CommonMember & CirclesPermissions) | null;
  governance: Pick<Governance, "circles">;
  onClick?: () => void;
}

const NewStreamButton: FC<NewStreamButtonProps> = (props) => {
  const {
    className,
    isMobileVersion = false,
    commonId,
    commonMember,
    governance,
    onClick,
  } = props;
  const history = useHistory();
  const { getProjectCreationPagePath } = useRoutesContext();
  const handleNewSpace = () =>
    history.push(getProjectCreationPagePath(commonId));
  const dispatch = useDispatch();

  const onNewDiscussion = () => {
    dispatch(commonActions.setCommonAction(CommonAction.NewDiscussion));
    animateScroll.scrollToTop({ containerId: document.body, smooth: true });
  };
  const items = useMenuItems({
    commonMember,
    governance,
    onNewSpace: handleNewSpace,
  });

  if (items.length === 0) {
    return null;
  }

  if(items.length === 2) {
    return (
      <ButtonIcon className={styles.buttonIcon} onClick={onNewDiscussion}>
      <PlusIcon className={styles.icon} />
    </ButtonIcon>
    )
  }

  const triggerEl = (
    <ButtonIcon className={styles.buttonIcon} onClick={onClick}>
      <PlusIcon className={styles.icon} />
    </ButtonIcon>
  );
  const menuProps = {
    className,
    triggerEl,
    items,
  };
  const Menu = isMobileVersion ? MobileMenu : DesktopMenu;

  return <Menu {...menuProps} />;
};

export default NewStreamButton;
