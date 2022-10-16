import React, {
  FC,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";

import { MenuButton, ShareModal } from "@/shared/components";
import {
  DynamicLinkType,
  Orientation,
  ShareViewType,
  ScreenSize,
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
import { DeleteButton } from "./DeleteButton";
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
    isDiscussionMessage = false
  }
) => {
  const screenSize = useSelector(getScreenSize());
  const { notify } = useNotification();
  const [linkURL, setLinkURL] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ElementDropdownMenuItems | unknown>(null);
  const [isShareLinkGenerating, setIsShareLinkGenerating] = useState<boolean>(false);
  const { handleOpen } = useBuildShareLink(linkType, elem, setLinkURL);
  const { isShowing, onOpen, onClose } = useModal(false);
  const isMobileView = (screenSize === ScreenSize.Mobile);

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
      
      const additionalMenuItems = isDiscussionMessage ? [
        {
          text: (
            <span>Delete</span>
          ),
          searchText: "Delete",
          value: ElementDropdownMenuItems.Delete,
        },
        {
          text: (
            <span>Copy</span>
          ),
          searchText: "Copy",
          value: ElementDropdownMenuItems.Copy,
        },
        {
          text: (
            <span>Edit</span>
          ),
          searchText: "Edit",
          value: ElementDropdownMenuItems.Edit,
        },
        {
          text: (
            <span>Reply</span>
          ),
          searchText: "Reply",
          value: ElementDropdownMenuItems.Reply,
        },
      ] : [];

      console.log('---additionalMenuItems',additionalMenuItems, isDiscussionMessage);


      return [...additionalMenuItems, ...generalMenuItems];
    },
      [linkURL, isDiscussionMessage]
  );

  console.log('---ElementDropdownMenuItemsList',ElementDropdownMenuItemsList);

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

      console.log('--value',value)
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
    // console.log('---selectedItem',selectedItem)
    // TODO: Comment linkUrl
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
        notify("The link has copied!");
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
