import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { ButtonIcon, Loader } from "@/shared/components";
import { ShareViewType, SharePopupVariant } from "@/shared/constants";
import { FacebookIcon, LinkedInIcon } from "@/shared/icons";
import { isMobile } from "@/shared/utils";
import "./index.scss";

enum Social {
  Facebook = "facebook",
  Twitter = "twitter",
  LinkedIn = "linkedin",
  Telegram = "telegram",
  Whatsapp = "whatsapp",
}

interface SocialLinksProps {
  shareViewType: ShareViewType;
  sourceUrl: string;
  isLoading: boolean;
  popupVariant?: SharePopupVariant;
  top?: string;
  linkText?: string;
}

const SOCIAL_LINKS: Record<Social, string> = {
  [Social.Facebook]: "https://www.facebook.com/sharer/sharer.php",
  [Social.Telegram]: "https://t.me/share/url",
  [Social.Twitter]: "https://twitter.com/intent/tweet",
  [Social.LinkedIn]: "https://www.linkedin.com/sharing/share-offsite",
  [Social.Whatsapp]: "https://wa.me",
};

export const SocialLinks: FC<SocialLinksProps> = ({
  shareViewType,
  sourceUrl,
  isLoading,
  popupVariant,
  top,
  linkText,
}) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "share",
  });

  const shareNatively = useCallback(async () => {
    if (!navigator?.share) return;

    try {
      await navigator.share({
        url: sourceUrl,
        text: linkText,
      });
    } catch (error) {
      console.error(error);
    }
  }, [sourceUrl, linkText]);

  const generateShareQuery = useCallback(
    (social: Social) => {
      switch (social) {
        case Social.Facebook:
          return `?u=${sourceUrl}${linkText ? `&quote=${linkText}` : ""}`;
        case Social.Whatsapp:
          return `?text=${linkText ? `${linkText}%0a%0a` : ""}${sourceUrl}`;
        case Social.Twitter:
        case Social.Telegram:
          return `?url=${sourceUrl}${linkText ? `&text=${linkText}` : ""}`;
        case Social.LinkedIn:
          return `?url=${sourceUrl}`;
        default:
          return "";
      }
    },
    [linkText, sourceUrl],
  );

  const handleURLOpen = useCallback(
    async (social: Social) => {
      if (isMobile() && navigator && Boolean(navigator.share)) {
        await shareNatively();
        return;
      }
      const query = generateShareQuery(social);
      const socialURL = `${SOCIAL_LINKS[social]}${query}`;

      window.open(socialURL);
    },
    [shareNatively, generateShareQuery],
  );

  return (
    <div
      className={classNames("social-links-wrapper", {
        "social-links-wrapper--modal-mobile":
          shareViewType === ShareViewType.ModalMobile,
        "social-links-wrapper--top-center":
          shareViewType === ShareViewType.Popup &&
          popupVariant === SharePopupVariant.TopCenter,
        "social-links-wrapper--loading": isLoading,

        "social-links-wrapper--modal-desktop":
          shareViewType === ShareViewType.ModalDesktop,
      })}
      style={{ top: `${top ?? "64px"}` }}
    >
      {shareViewType === ShareViewType.Popup && (
        <div className="title">{t("title")}</div>
      )}
      {isLoading ? (
        <Loader />
      ) : (
        <div
          className={classNames("social-links", {
            "social-links--modal-mobile":
              shareViewType === ShareViewType.ModalMobile,
          })}
        >
          <ButtonIcon onClick={() => handleURLOpen(Social.Facebook)}>
            <FacebookIcon
              className="social-icon facebook-icon"
              color="currentColor"
            />
          </ButtonIcon>
          <ButtonIcon onClick={() => handleURLOpen(Social.LinkedIn)}>
            <LinkedInIcon className="social-icon linkedin-icon" />
          </ButtonIcon>
          <button
            className="twitter"
            onClick={() => handleURLOpen(Social.Twitter)}
          >
            <div className="social-icon twitter-icon" />
          </button>
          <button
            className="telegram"
            onClick={() => handleURLOpen(Social.Telegram)}
          >
            <div className="social-icon telegram-icon" />
          </button>
          <button
            className="whatsapp"
            onClick={() => handleURLOpen(Social.Whatsapp)}
          >
            <div className="social-icon whatsapp-icon" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SocialLinks;
