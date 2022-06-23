import React, {
  FC,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";

import {
  Dropdown,
  MenuButton,
  ElementDropdownMenuItems,
  DropdownOption,
  DropdownStyles,
  ShareModal,
} from "@/shared/components";
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
import ShareIcon from "@/shared/icons/share.icon";
import CopyLinkIcon from "@/shared/icons/copyLink.icon";
import {
  Common,
  Proposal,
  Discussion,
  DiscussionMessage,
} from "@/shared/models";
import "./index.scss";

interface ElementDropdownProps {
  linkType: DynamicLinkType;
  elem: Common | Proposal | Discussion | DiscussionMessage;
  variant?: Orientation;
  transparent?: boolean;
  className?: string;
  styles?: DropdownStyles;
  onMenuToggle?: (isOpen: boolean) => void;
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
    () =>
      [
        {
          text: (
            <>
              <ShareIcon className="share-icon"/>
              <span>Share</span>
            </>
          ),
          searchText: "Share",
          value: ElementDropdownMenuItems.Share,
        },
        {
          text: (
            <div
              className="dropdown-copy-link"
              onClick={() => copyToClipboard(linkURL || "")}
            >
              <CopyLinkIcon />
              <span>Copy link</span>
            </div>
          ),
          searchText: "Copy link",
          value: ElementDropdownMenuItems.CopyLink,
        },
        //TODO: "Reports" dev scope
        // {
        //   text: (
        //     <>
        //       <ReportIcon />
        //       <span>Report</span>
        //     </>
        //   ),
        //   searchText: "Report",
        //   value: ElementDropdownMenuItems.Report,
        // },
      ],
      [linkURL]
  );

  const handleMenuToggle = useCallback((isOpen: boolean) => {
    if (!linkURL) {
      handleOpen();
      setIsShareLinkGenerating(true);
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
      case ElementDropdownMenuItems.CopyLink:
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
            menu: "element-dropdown__menu",
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
