import React, { FC, useCallback, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import copyToClipboard from "copy-to-clipboard";
import { selectUser } from "@/pages/Auth/store/selectors";
import { chatActions } from "@/store/states";
import { MenuButton, ShareModal } from "@/shared/components";
import {
  DynamicLinkType,
  Orientation,
  ShareViewType,
  ScreenSize,
  EntityTypes,
} from "@/shared/constants";
import { useBuildShareLink, useNotification, useModal } from "@/shared/hooks";
import {
  MenuItem as DesktopStyleMenuItem,
  MenuItemType,
} from "@/shared/interfaces";
import { ModerationFlags } from "@/shared/interfaces/Moderation";
import {
  Common,
  Proposal,
  Discussion,
  DiscussionMessage,
  CommonMember,
  Governance,
} from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { DesktopStyleMenu } from "@/shared/ui-kit";
import { hasPermission } from "@/shared/utils";
import { selectCommonMember, selectGovernance } from "@/store/states";
import { DeleteModal } from "../DeleteModal";
import {
  Dropdown,
  ElementDropdownMenuItems,
  DropdownOption,
  DropdownStyles,
} from "../Dropdown";
import { HideContentTypes, HideModal } from "../HideModal";
import { ReportModal } from "../ReportModal";
import elementDropdownStyles from "./ElementDropdown.module.scss";
import "./index.scss";

interface ElementDropdownProps {
  linkType: DynamicLinkType;
  elem: Common | Proposal | Discussion | DiscussionMessage;
  variant?: Orientation;
  transparent?: boolean;
  className?: string;
  styles?: DropdownStyles;
  isOpen?: boolean;
  onMenuToggle?: (isOpen: boolean) => void;
  isDiscussionMessage?: boolean;
  entityType: EntityTypes;
  onEdit?: () => void;
  userId?: string;
  ownerId?: string;
  commonId?: string;
}

const ElementDropdown: FC<ElementDropdownProps> = ({
  linkType,
  elem,
  transparent = false,
  variant = Orientation.Vertical,
  styles = {},
  className,
  isOpen,
  onMenuToggle,
  isDiscussionMessage = false,
  entityType,
  onEdit,
  userId,
  ownerId,
  commonId,
}) => {
  const dispatch = useDispatch();
  const screenSize = useSelector(getScreenSize());
  const user = useSelector(selectUser());
  const commonMember = useSelector(selectCommonMember) as CommonMember;
  const governance = useSelector(selectGovernance) as Governance;
  const { notify } = useNotification();
  const [linkURL, setLinkURL] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<
    ElementDropdownMenuItems | unknown
  >(null);
  const [isShareLinkGenerating, setIsShareLinkGenerating] =
    useState<boolean>(false);
  const { handleOpen } = useBuildShareLink(linkType, elem, setLinkURL);
  const { isShowing, onOpen, onClose } = useModal(false);
  const {
    isShowing: isShowingReport,
    onOpen: onOpenReport,
    onClose: onCloseReport,
  } = useModal(false);
  const {
    isShowing: isShowingDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useModal(false);
  const {
    isShowing: isShowingHide,
    onOpen: onOpenHide,
    onClose: onCloseHide,
  } = useModal(false);
  const isMobileView = screenSize === ScreenSize.Mobile;
  const isControlledMenu = typeof isOpen === "boolean";
  const isHiddenElement =
    (elem as DiscussionMessage | Discussion | Proposal)?.moderation?.flag ===
    ModerationFlags.Hidden;

  const onReply = useCallback(() => {
    dispatch(chatActions.setCurrentDiscussionMessageReply(elem as DiscussionMessage));
  }, [elem]);

  const ElementDropdownMenuItemsList: DropdownOption[] = useMemo(() => {
    const isOwner = ownerId === user?.uid;

    const items: DropdownOption[] = [];

    if (isDiscussionMessage && !isHiddenElement) {
      items.push({
        text: <span>Reply</span>,
        searchText: "Reply",
        value: ElementDropdownMenuItems.Reply,
      });
    }

    if (isOwner && isDiscussionMessage) {
      items.push({
        text: <span>Edit</span>,
        searchText: "Edit",
        value: ElementDropdownMenuItems.Edit,
      });
    }

    if (isDiscussionMessage) {
      items.push({
        text: <span>Copy</span>,
        searchText: "Copy",
        value: ElementDropdownMenuItems.Copy,
      });
    }

    items.push({
      text: <span>Share</span>,
      searchText: "Share",
      value: ElementDropdownMenuItems.Share,
    });

    if (!isOwner) {
      items.push({
        text: <span>Report</span>,
        searchText: "Report",
        value: ElementDropdownMenuItems.Report,
      });
    }

    if (
      hasPermission({
        commonMember,
        governance,
        key: HideContentTypes[entityType],
      }) &&
      !isOwner &&
      !isHiddenElement
    ) {
      items.push({
        text: (
          <span className={elementDropdownStyles.menuItemRedText}>Hide</span>
        ),
        searchText: "Hide",
        value: ElementDropdownMenuItems.Hide,
      });
    }

    if (isOwner && isDiscussionMessage) {
      items.push({
        text: (
          <span className={elementDropdownStyles.menuItemRedText}>Delete</span>
        ),
        searchText: "Delete",
        value: ElementDropdownMenuItems.Delete,
      });
    }

    return items;
  }, [
    linkURL,
    isDiscussionMessage,
    elem,
    user,
    ownerId,
    commonMember,
    governance,
    isHiddenElement,
  ]);

  const handleMenuToggle = useCallback(
    (isOpen: boolean) => {
      if (!linkURL && isOpen) {
        handleOpen();
        setIsShareLinkGenerating(true);
      }

      if (onMenuToggle) onMenuToggle(isOpen);
    },
    [linkURL, onMenuToggle, setIsShareLinkGenerating],
  );

  const handleMenuItemSelect = useCallback(
    (value: unknown) => {
      setSelectedItem(value);
    },
    [setSelectedItem],
  );

  useEffect(() => {
    if (!linkURL || !isShareLinkGenerating) return;

    setIsShareLinkGenerating(false);
  }, [isShareLinkGenerating, setIsShareLinkGenerating, linkURL]);

  useEffect(() => {
    if (selectedItem === null) {
      return;
    }

    switch (selectedItem) {
      case ElementDropdownMenuItems.Share:
        onOpen();
        break;
      case ElementDropdownMenuItems.Copy:
        copyToClipboard((elem as DiscussionMessage).text);
        notify("The message has copied!");
        break;
      case ElementDropdownMenuItems.CopyLink:
        if (linkURL) {
          copyToClipboard(linkURL || "");
          notify("The link has copied!");
        }
        break;
      case ElementDropdownMenuItems.Delete:
        onOpenDelete();
        break;
      case ElementDropdownMenuItems.Reply:
        onReply();
        break;
      case ElementDropdownMenuItems.Edit:
        onEdit && onEdit();
        break;
      case ElementDropdownMenuItems.Report: //TODO: "Reports" dev scope
        onOpenReport();
        break;
      case ElementDropdownMenuItems.Hide:
        onOpenHide();
        break;
    }

    setSelectedItem(null);
  }, [
    selectedItem,
    notify,
    isShareLinkGenerating,
    linkURL,
    onOpen,
    setSelectedItem,
  ]);

  const desktopStyleMenuItems = useMemo<DesktopStyleMenuItem[]>(
    () =>
      ElementDropdownMenuItemsList.map<DesktopStyleMenuItem>((item) => ({
        type: MenuItemType.Button,
        id: item.value as string,
        className: item.className,
        text: item.text,
        onClick: () => {
          setSelectedItem(item.value);
          handleMenuToggle(false);
        },
      })),
    [ElementDropdownMenuItemsList, handleMenuToggle],
  );

  const menuInlineStyle = useMemo(
    () => ({
      height: `${2.8125 * (ElementDropdownMenuItemsList.length || 1)}rem`,
    }),
    [ElementDropdownMenuItemsList],
  );

  useEffect(() => {
    if (typeof isOpen === "boolean") {
      handleMenuToggle(isOpen);
    }
  }, [isOpen]);

  return (
    <>
      {!isControlledMenu && (
        <Dropdown
          options={ElementDropdownMenuItemsList}
          menuButton={<MenuButton variant={variant} />}
          onMenuToggle={handleMenuToggle}
          className={classNames("element-dropdown__menu-wrapper", className)}
          shouldBeFixed={false}
          onSelect={handleMenuItemSelect}
          isLoading={isShareLinkGenerating}
          menuInlineStyle={menuInlineStyle}
          styles={{
            ...styles,
            menuButton: classNames({
              "element-dropdown__menu-button--transparent": transparent,
            }),
            menu: "element-dropdown__menu",
            menuItem: "element-dropdown__menu-item",
          }}
        />
      )}
      {isControlledMenu && (
        <DesktopStyleMenu
          className={elementDropdownStyles.desktopStyleMenu}
          isOpen={isOpen}
          onClose={() => handleMenuToggle(false)}
          items={desktopStyleMenuItems}
          withTransition={false}
        />
      )}
      <ShareModal
        isShowing={isShowing}
        isLoading={isShareLinkGenerating}
        sourceUrl={linkURL || ""}
        onClose={onClose}
        type={
          isMobileView ? ShareViewType.ModalMobile : ShareViewType.ModalDesktop
        }
      />
      <HideModal
        userId={userId as string}
        isShowing={isShowingHide}
        onClose={onCloseHide}
        entity={elem}
        type={entityType}
        commonId={commonId as string}
      />
      <ReportModal
        userId={userId as string}
        isShowing={isShowingReport}
        onClose={onCloseReport}
        entity={elem}
        type={entityType}
      />
      <DeleteModal
        isShowing={isShowingDelete}
        onClose={onCloseDelete}
        entity={elem}
        type={entityType}
      />
    </>
  );
};

export default ElementDropdown;
