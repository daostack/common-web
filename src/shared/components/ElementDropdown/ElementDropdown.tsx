import React, { FC, useCallback, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import copyToClipboard from "copy-to-clipboard";
import { selectUser } from "@/pages/Auth/store/selectors";
import { setCurrentDiscussionMessageReply } from "@/pages/OldCommon/store/actions";
import {
  selectCommonMember,
  selectGovernance,
} from "@/pages/OldCommon/store/selectors";
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
  Common,
  Proposal,
  Discussion,
  DiscussionMessage,
  CommonMember,
  Governance,
} from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { hasPermission } from "@/shared/utils";
import { DeleteModal } from "../DeleteModal";
import {
  Dropdown,
  ElementDropdownMenuItems,
  DropdownOption,
  DropdownStyles,
} from "../Dropdown";
import { HideContentTypes, HideModal } from "../HideModal";
import { ReportModal } from "../ReportModal";
import "./index.scss";

interface ElementDropdownProps {
  linkType: DynamicLinkType;
  elem: Common | Proposal | Discussion | DiscussionMessage;
  variant?: Orientation;
  transparent?: boolean;
  className?: string;
  styles?: DropdownStyles;
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
  const commonMember = useSelector(selectCommonMember()) as CommonMember;
  const governance = useSelector(selectGovernance()) as Governance;
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

  const onReply = useCallback(() => {
    dispatch(setCurrentDiscussionMessageReply(elem as DiscussionMessage));
  }, [elem]);

  const ElementDropdownMenuItemsList: DropdownOption[] = useMemo(() => {
    const isOwner = ownerId === user?.uid;
    const generalMenuItems = [
      {
        text: <span>Share</span>,
        searchText: "Share",
        value: ElementDropdownMenuItems.Share,
      },
    ];

    if (!isOwner) {
      generalMenuItems.push({
        text: <span>Report</span>,
        searchText: "Report",
        value: ElementDropdownMenuItems.Report,
      });
    }

    if (isDiscussionMessage) {
      generalMenuItems.push({
        text: <span>Copy Link</span>,
        searchText: "Copy Link",
        value: ElementDropdownMenuItems.CopyLink,
      });
    }

    if (
      hasPermission({
        commonMember,
        governance,
        key: HideContentTypes[entityType],
      })
    ) {
      generalMenuItems.push({
        text: <span>Hide</span>,
        searchText: "Hide",
        value: ElementDropdownMenuItems.Hide,
      });
    }

    const discussionMessageItems = isDiscussionMessage
      ? [
          {
            text: <span>Copy</span>,
            searchText: "Copy",
            value: ElementDropdownMenuItems.Copy,
          },
          {
            text: <span>Reply</span>,
            searchText: "Reply",
            value: ElementDropdownMenuItems.Reply,
          },
        ]
      : [];

    const additionalMenuItems =
      isOwner && isDiscussionMessage
        ? [
            {
              text: <span>Delete</span>,
              searchText: "Delete",
              value: ElementDropdownMenuItems.Delete,
            },
            {
              text: <span>Edit</span>,
              searchText: "Edit",
              value: ElementDropdownMenuItems.Edit,
            },
          ]
        : [];

    return [
      ...additionalMenuItems,
      ...discussionMessageItems,
      ...generalMenuItems,
    ];
  }, [linkURL, isDiscussionMessage, elem, user, ownerId, commonMember]);

  const handleMenuToggle = useCallback(
    (isOpen: boolean) => {
      if (!linkURL) {
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
    if (selectedItem === null || isShareLinkGenerating || !linkURL) {
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
        copyToClipboard(linkURL || "");
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
  }, [
    selectedItem,
    notify,
    isShareLinkGenerating,
    linkURL,
    onOpen,
    setSelectedItem,
  ]);

  const menuInlineStyle = useMemo(
    () => ({
      height: `${2.8125 * (ElementDropdownMenuItemsList.length || 1)}rem`,
    }),
    [ElementDropdownMenuItemsList],
  );

  return (
    <>
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
