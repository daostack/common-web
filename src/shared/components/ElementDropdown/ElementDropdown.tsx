import React, {
    FC,
    useCallback,
    useState,
    useEffect,
} from "react";
import {useDispatch, useSelector} from "react-redux";
import classNames from "classnames";

import {
    Dropdown,
    MenuButton,
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
import {copyToClipboard} from "@/shared/utils";
import {getScreenSize} from "@/shared/store/selectors";
import ShareIcon from "@/shared/icons/share.icon";
import CopyLinkIcon from "@/shared/icons/copyLink.icon";
import HideIcon from "@/shared/icons/hide.icon";
import {
    Common,
    Proposal,
    Discussion,
    DiscussionMessage, CommonMember,
} from "@/shared/models";
import {ElementDropdownMenuItems} from "../Dropdown";
import "./index.scss";
import ReportIcon from "@/shared/icons/report.icon";
import {openModerateModal} from "@/containers/Common/store/actions";
import {MODERATION_TYPES} from "../../../../../common-backend/functions/src/shared/enums/MODERATION_TYPES";
import {ModerationActionType} from "@/containers/Common/interfaces";

const ElementDropdownMenuItemsList: DropdownOption[] = [
    {
        text: (
            <>
                <ShareIcon className="share-icon" />
                <span>Share</span>
            </>
        ),
        searchText: "Share",
        value: ElementDropdownMenuItems.Share,
    },
    {
        text: (
            <>
                <CopyLinkIcon />
                <span>Copy link</span>
            </>
        ),
        searchText: "Copy link",
        value: ElementDropdownMenuItems.CopyLink,
    },
    {
        text: (
            <>
                <ReportIcon />
                <span>Report</span>
            </>
        ),
        searchText: "Report",
        value: ElementDropdownMenuItems.Report,
    },

];

const hideItem = {
    text: (
        <>
            <HideIcon />
            <span>Hide</span>
        </>
    ),
    searchText: "Hide",
    value: ElementDropdownMenuItems.Hide,
}



interface ElementDropdownProps {
    linkType: DynamicLinkType;
    elem: Common | Proposal | Discussion | DiscussionMessage;
    elemType: MODERATION_TYPES;
    variant?: Orientation;
    transparent?: boolean;
    className?: string;
    styles?: DropdownStyles;
    commonMember: CommonMember | null;
}

const ElementDropdown: FC<ElementDropdownProps> = (
    {
        linkType,
        elem,
        transparent = false,
        variant = Orientation.Vertical,
        styles = {},
        className,
        commonMember,
        elemType
    }
) => {
    const dispatch = useDispatch();
    const screenSize = useSelector(getScreenSize());
    const {notify} = useNotification();
    const [linkURL, setLinkURL] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<ElementDropdownMenuItems | unknown>(null);
    const [isShareLinkGenerating, setIsShareLinkGenerating] = useState<boolean>(false);
    const {handleOpen} = useBuildShareLink(linkType, elem, setLinkURL);
    const {isShowing, onOpen, onClose} = useModal(false);
    const isMobileView = (screenSize === ScreenSize.Mobile);

    useEffect(() => {
        if (commonMember) {
            const hide_permission = `HIDE_OR_UNHIDE_${elemType.toUpperCase()}`
            if (commonMember.allowedActions[hide_permission] && ElementDropdownMenuItemsList.length <= 3) {
                ElementDropdownMenuItemsList.push(hideItem)
            }
        }
    }, [commonMember]);


    const handleMenuItemSelect = useCallback((value: unknown) => {
            if (value === ElementDropdownMenuItems.Report || value === ElementDropdownMenuItems.Hide ){

                dispatch(openModerateModal({
                actionType:ElementDropdownMenuItems.Hide === value ? ModerationActionType.hide : ModerationActionType.report,
                    type:elemType,
                    itemId:elem.id
                }))
                return;
                }

            if (!linkURL) {
                handleOpen();
                setIsShareLinkGenerating(true);
            }

            setSelectedItem(value);
        },
        [
            setIsShareLinkGenerating,
            handleOpen,
            setSelectedItem,
            linkURL
        ]
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
                copyToClipboard(linkURL);
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
        onOpen
    ]);

    return (
        <>
            <Dropdown
                options={ElementDropdownMenuItemsList}
                menuButton={<MenuButton variant={variant} />}
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
