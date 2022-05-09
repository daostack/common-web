import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import { DynamicLinkType, DYNAMIC_LINK_URI_PREFIX } from "@/shared/constants";
import {
  Common,
  Proposal,
  Discussion,
  DiscussionMessage,
} from "@/shared/models";
import { buildShareLink } from "@/shared/store/actions";
import {
  selectLoadingShareLinks,
  selectShareLinks,
} from "@/shared/store/selectors";

interface BuildShareLinkReturn {
  handleOpen: () => void;
}

interface LinkMetaData {
  link: string;
  socialTitle: string;
  socialDescription: string;
  socialImageLink: string;
}

const getLinkMetaData = ( //FIXME
  linkType: DynamicLinkType,
  elem: Common | Proposal | Discussion | DiscussionMessage,
): LinkMetaData | null => {
  switch (linkType) {
    case DynamicLinkType.Common:
      elem = elem as Common;

      return (
        {
          link: `${DYNAMIC_LINK_URI_PREFIX}/${DynamicLinkType.Common}/${elem.id}`,
          socialTitle: elem.name || "",
          socialDescription: [
              elem.metadata.byline || "",
              "Download the Common app to join now."
            ].filter(Boolean).join(". "),
          socialImageLink: elem.image || "",
        }
      );
    case DynamicLinkType.Proposal:
      elem = elem as Proposal;

      return (
        {
          link: `${DYNAMIC_LINK_URI_PREFIX}/${DynamicLinkType.Proposal}/${elem.id}`,
          socialTitle: elem.title || elem.description.title || "",
          socialDescription: elem.description.description || "",
          socialImageLink: "/assets/images/join.jpg", //FIXME
        }
      );
    case DynamicLinkType.Discussion:
      elem = elem as Discussion;

      return (
        {
          link: `${DYNAMIC_LINK_URI_PREFIX}/${DynamicLinkType.Discussion}/${elem.id}`,
          socialTitle: elem.title || "",
          socialDescription: elem.description || "",
          socialImageLink: "/assets/images/join.jpg", //FIXME
        }
      );
    case DynamicLinkType.DiscussionMessage:
      elem = elem as DiscussionMessage;

      return (
        {
          link: `${DYNAMIC_LINK_URI_PREFIX}/${DynamicLinkType.DiscussionMessage}/${elem.id}`,
          socialTitle: `${elem.flag || ""} discussion's message`,
          socialDescription: elem.text || "",
          socialImageLink: "/assets/images/join.jpg", //FIXME
        }
      );
    default:
      return null;
  }
};

const useBuildShareLink = (
  linkType: DynamicLinkType,
  elem: Common | Proposal | Discussion | DiscussionMessage,
  setLinkURL: (linkURL: string) => void,
): BuildShareLinkReturn => {
  const linkMetaData = getLinkMetaData(linkType, elem);
  const dispatch = useDispatch();
  const linkKey = `${linkType}/${elem.id}`;
  const shareLinks = useSelector(selectShareLinks());
  const loadingShareLinks = useSelector(selectLoadingShareLinks());
  const linkURL = shareLinks[linkKey] || "";
  const isLoading = Boolean(loadingShareLinks[linkKey]);

  const handleOpen = useCallback(() => {
    if (
      linkURL
      || isLoading
      || !linkMetaData
    ) return;

    const {
      link,
      socialTitle,
      socialDescription,
      socialImageLink,
    } = linkMetaData;

    dispatch(
      buildShareLink.request({
        payload: {
          key: linkKey,
          linkInfo: {
            link,
            domainUriPrefix: DYNAMIC_LINK_URI_PREFIX,
            socialMetaTagInfo: {
              socialTitle,
              socialDescription,
              socialImageLink,
            },
          },
        },
      })
    );
  }, [
    linkURL,
    isLoading,
    dispatch,
    linkKey,
    linkMetaData
  ]);

  useEffect(() => {
    if (isLoading || !linkURL)
      return;

    setLinkURL(linkURL);
  }, [isLoading, linkURL, setLinkURL]);

  return { handleOpen };
};

export default useBuildShareLink;
