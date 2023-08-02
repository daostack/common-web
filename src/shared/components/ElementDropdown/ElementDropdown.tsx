import React, { FC, useCallback, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import copyToClipboard from "copy-to-clipboard";
import { selectUser } from "@/pages/Auth/store/selectors";
import { MenuButton, ShareModal } from "@/shared/components";
import { Orientation, EntityTypes } from "@/shared/constants";
import { useNotification, useModal } from "@/shared/hooks";
import {
  CopyIcon,
  Edit3Icon,
  HideIcon,
  ReplyIcon,
  Report2Icon,
  Share3Icon,
  Trash2Icon,
} from "@/shared/icons";
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
import {
  DesktopStyleMenu,
  parseStringToTextEditorValue,
  serializeTextEditorValue,
} from "@/shared/ui-kit";
import {
  StaticLinkType,
  generateStaticShareLink,
  hasPermission,
} from "@/shared/utils";
import { chatActions } from "@/store/states";
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
  linkType: StaticLinkType;
  elem: Common | Proposal | Discussion | DiscussionMessage;
  variant?: Orientation;
  transparent?: boolean;
  className?: string;
  styles?: DropdownStyles;
  isOpen?: boolean;
  onMenuToggle?: (isOpen: boolean) => void;
  isDiscussionMessage?: boolean;
  isChatMessage?: boolean;
  isDiscussionMessageWithFile?: boolean;
  entityType: EntityTypes;
  onEdit?: () => void;
  userId?: string;
  ownerId?: string;
  commonId?: string;
  isControlledDropdown?: boolean;
  feedItemId: string;
  onDelete?: (elemId: string) => void;
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
  isChatMessage = false,
  isDiscussionMessageWithFile = false,
  entityType,
  onEdit,
  userId,
  ownerId,
  commonId,
  isControlledDropdown = true,
  feedItemId,
  onDelete,
}) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser());
  const commonMember = useSelector(selectCommonMember) as CommonMember;
  const governance = useSelector(selectGovernance) as Governance;
  const { notify } = useNotification();
  const [selectedItem, setSelectedItem] = useState<
    ElementDropdownMenuItems | unknown
  >(null);

  const staticShareLink = generateStaticShareLink(linkType, elem, feedItemId);

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
  const isControlledMenu = typeof isOpen === "boolean" && isControlledDropdown;
  const isHiddenElement =
    (elem as DiscussionMessage | Discussion | Proposal)?.moderation?.flag ===
    ModerationFlags.Hidden;

  const onReply = useCallback(() => {
    dispatch(
      chatActions.setCurrentDiscussionMessageReply(elem as DiscussionMessage),
    );
  }, [elem]);

  const ElementDropdownMenuItemsList: DropdownOption[] = useMemo(() => {
    const isOwner = Boolean(ownerId && ownerId === user?.uid);

    const items: DropdownOption[] = [];

    if (isDiscussionMessage && !isHiddenElement) {
      items.push({
        text: (
          <div className={elementDropdownStyles.itemContent}>
            <ReplyIcon />
            <span>Reply</span>
          </div>
        ),
        searchText: "Reply",
        value: ElementDropdownMenuItems.Reply,
      });
    }

    if (isOwner && isDiscussionMessage && !isDiscussionMessageWithFile) {
      items.push({
        text: (
          <div className={elementDropdownStyles.itemContent}>
            <Edit3Icon />
            <span>Edit</span>
          </div>
        ),
        searchText: "Edit",
        value: ElementDropdownMenuItems.Edit,
      });
    }

    if (isDiscussionMessage && !isDiscussionMessageWithFile) {
      items.push({
        text: (
          <div className={elementDropdownStyles.itemContent}>
            <CopyIcon />
            <span>Copy</span>
          </div>
        ),
        searchText: "Copy",
        value: ElementDropdownMenuItems.Copy,
      });
    }

    if (!isChatMessage) {
      items.push({
        text: (
          <div className={elementDropdownStyles.itemContent}>
            <Share3Icon />
            <span>Share</span>
          </div>
        ),
        searchText: "Share",
        value: ElementDropdownMenuItems.Share,
      });
    }

    if (!isOwner) {
      items.push({
        text: (
          <div className={elementDropdownStyles.itemContent}>
            <Report2Icon />
            <span>Report</span>
          </div>
        ),
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
          <div className={elementDropdownStyles.itemContent}>
            <HideIcon />
            <span>Hide</span>
          </div>
        ),
        searchText: "Hide",
        value: ElementDropdownMenuItems.Hide,
      });
    }

    if (isOwner && (isDiscussionMessage || isChatMessage)) {
      items.push({
        text: (
          <div className={elementDropdownStyles.itemContent}>
            <Trash2Icon className={elementDropdownStyles.redIcon} />
            <span className={elementDropdownStyles.menuItemRedText}>
              Delete
            </span>
          </div>
        ),
        searchText: "Delete",
        value: ElementDropdownMenuItems.Delete,
      });
    }

    return items;
  }, [
    isDiscussionMessage,
    isChatMessage,
    elem,
    user,
    ownerId,
    commonMember,
    governance,
    isHiddenElement,
  ]);

  const handleMenuToggle = useCallback(
    (isOpen: boolean) => {
      if (onMenuToggle) onMenuToggle(isOpen);
    },
    [onMenuToggle],
  );

  const handleMenuItemSelect = useCallback(
    (value: unknown) => {
      setSelectedItem(value);
    },
    [setSelectedItem],
  );

  useEffect(() => {
    if (selectedItem === null) {
      return;
    }

    switch (selectedItem) {
      case ElementDropdownMenuItems.Share:
        onOpen();
        break;
      case ElementDropdownMenuItems.Copy:
        copyToClipboard(
          serializeTextEditorValue(
            parseStringToTextEditorValue((elem as DiscussionMessage).text),
          ),
        );
        notify("The message has copied!");
        break;
      case ElementDropdownMenuItems.CopyLink:
        copyToClipboard(staticShareLink || "");
        notify("The link has copied!");
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
  }, [selectedItem, notify, onOpen, setSelectedItem]);

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
      height: `${2.5 * (ElementDropdownMenuItemsList.length || 1)}rem`,
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
          isOpen={isOpen}
          options={ElementDropdownMenuItemsList}
          menuButton={<MenuButton variant={variant} />}
          onMenuToggle={handleMenuToggle}
          className={classNames("element-dropdown__menu-wrapper", className)}
          shouldBeFixed={false}
          onSelect={handleMenuItemSelect}
          menuInlineStyle={menuInlineStyle}
          styles={{
            ...styles,
            menuButton: classNames(styles?.menuButton, {
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
        sourceUrl={staticShareLink || ""}
        onClose={onClose}
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
        isChatMessage={isChatMessage}
        onDelete={onDelete}
      />
    </>
  );
};

export default ElementDropdown;
