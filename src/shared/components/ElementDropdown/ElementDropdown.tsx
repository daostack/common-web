import React, {
  FC,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";

import { MenuButton, ShareModal } from "@/shared/components";
import {
  DynamicLinkType,
  Orientation,
  ShareViewType,
  ScreenSize,
  ENTITY_TYPES,
} from "@/shared/constants";
import {
  useBuildShareLink,
  useNotification,
  useModal,
} from "@/shared/hooks";
import { copyToClipboard } from "@/shared/utils";
import { getScreenSize } from "@/shared/store/selectors";
import {
  Common,
  Proposal,
  Discussion,
  DiscussionMessage,
} from "@/shared/models";
import {
  Dropdown,
  ElementDropdownMenuItems,
  DropdownOption,
  DropdownStyles,
} from "../Dropdown";
import "./index.scss";
import { deleteDiscussionMessage, setCurrentDiscussionMessageReply } from "@/containers/Common/store/actions";

interface ElementDropdownProps {
  linkType: DynamicLinkType;
  elem: Common | Proposal | Discussion | DiscussionMessage;
  variant?: Orientation;
  transparent?: boolean;
  className?: string;
  styles?: DropdownStyles;
  onMenuToggle?: (isOpen: boolean) => void;
  isDiscussionMessage?: boolean;
  isOwner?: boolean;
  entityType: ENTITY_TYPES;
}

const ElementDropdown: FC<ElementDropdownProps> = (
  {
    linkType,
    elem,
    transparent = false,
    variant = Orientation.Vertical,
    styles = {},
    className,
    onMenuToggle,
    isDiscussionMessage = false,
    isOwner = false,
    entityType
  }
) => {
  const dispatch = useDispatch();
  const screenSize = useSelector(getScreenSize());
  const { notify } = useNotification();
  const [linkURL, setLinkURL] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ElementDropdownMenuItems | unknown>(null);
  const [isShareLinkGenerating, setIsShareLinkGenerating] = useState<boolean>(false);
  const { handleOpen } = useBuildShareLink(linkType, elem, setLinkURL);
  const { isShowing, onOpen, onClose } = useModal(false);
  const isMobileView = (screenSize === ScreenSize.Mobile);


  const onDelete = useCallback(() => {
    // TODO: Add other entities
    switch(entityType) {
      case ENTITY_TYPES.DiscussionMessage: {
        dispatch(deleteDiscussionMessage.request({
          payload: {
            discussionId: (elem as DiscussionMessage).discussionId,
            discussionMessageId: elem.id,
          },
          callback(error) {
              if(error) {
                notify("Something went wrong");
                return;
              }

              notify("The message has deleted!");
          },
        }))
        break;
      }
    }

  },[elem, entityType]);

  const onReply = useCallback(() => {
    dispatch(setCurrentDiscussionMessageReply(elem as DiscussionMessage));
  }, [elem]);

  const ElementDropdownMenuItemsList: DropdownOption[] = useMemo(
    () => {
      const generalMenuItems = [
        {
          text: (
            <span>Share</span>
          ),
          searchText: "Share",
          value: ElementDropdownMenuItems.Share,
        },
        {
          text: (
            <span>Report</span>
          ),
          searchText: "Report",
          value: ElementDropdownMenuItems.Report,
        },
      ];

      const discussionMessageItems = isDiscussionMessage ? [
        {
          text: (
            <span>Copy</span>
          ),
          searchText: "Copy",
          value: ElementDropdownMenuItems.Copy,
        },
        {
          text: (
            <span>Reply</span>
          ),
          searchText: "Reply",
          value: ElementDropdownMenuItems.Reply,
        }
      ] :[];

      
      const additionalMenuItems = isOwner && isDiscussionMessage ? [
        {
          text: (
            <span>Delete</span>
          ),
          searchText: "Delete",
          value: ElementDropdownMenuItems.Delete,
        },
        {
          text: (
            <span>Edit</span>
          ),
          searchText: "Edit",
          value: ElementDropdownMenuItems.Edit,
        }
      ] : [];

      return [...additionalMenuItems, ...discussionMessageItems, ...generalMenuItems];
    },
      [linkURL, isDiscussionMessage, isOwner, elem]
  );

  const handleMenuToggle = useCallback((isOpen: boolean) => {
    if (linkURL) {
      setIsShareLinkGenerating(true);
      handleOpen();
    }

    if (onMenuToggle)
      onMenuToggle(isOpen);
  }, [
    linkURL,
    onMenuToggle,
    handleOpen,
    setIsShareLinkGenerating
  ]);

  const handleMenuItemSelect = useCallback((value: unknown) => {
      if (value === ElementDropdownMenuItems.Report) return; //TODO: "Reports" dev scope

      setSelectedItem(value);
    },
    [setSelectedItem]
  );

  useEffect(() => {
    if (!linkURL || !isShareLinkGenerating)
      return;

    setIsShareLinkGenerating(false);
  }, [isShareLinkGenerating, setIsShareLinkGenerating, linkURL]);

  useEffect(() => {
    if (
      selectedItem === null
      || isShareLinkGenerating
      || !linkURL
    ) return;

    switch (selectedItem) {
      case ElementDropdownMenuItems.Share:
        onOpen();
        break;
      case ElementDropdownMenuItems.Copy:
        notify("The link has copied!");
        break;
      case ElementDropdownMenuItems.Delete:
        onDelete();
        break;
      case ElementDropdownMenuItems.Reply:
        onReply();
        break;
      case ElementDropdownMenuItems.Report: //TODO: "Reports" dev scope
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
        styles={
          {
            ...styles,
            menuButton: classNames({
              "element-dropdown__menu-button--transparent": transparent,
            }),
            menu: classNames("element-dropdown__menu", {
              'element-dropdown__extended-menu': isDiscussionMessage
            }),
            menuItem: "element-dropdown__menu-item"
          }
        }
      />
      <ShareModal
        isShowing={isShowing}
        isLoading={isShareLinkGenerating}
        sourceUrl={linkURL || ""}
        onClose={onClose}
        type={isMobileView ? ShareViewType.ModalMobile : ShareViewType.ModalDesktop}
      />
    </>
  );
};

export default ElementDropdown;
