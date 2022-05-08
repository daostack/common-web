import React, { FC, useCallback } from "react";
import classNames from "classnames";
import { Loader } from "@/shared/components";
import { isMobile } from "@/shared/utils";
import {
  ShareViewType,
  SharePopupVariant,
} from "@/shared/constants";
import "./index.scss";

enum Social {
  Facebook = "facebook",
  Twitter = "twitter",
  LinkedIn = "linkedin",
  Telegram = "telegram",
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
};

export const SocialLinks: FC<SocialLinksProps> = (
  {
    shareViewType,
    sourceUrl,
    isLoading,
    popupVariant,
    top,
    linkText,
  }
) => {

  const shareNatively = useCallback(async () => {
    if (!navigator?.share)
      return;

    try {
      await navigator.share({
        url: sourceUrl,
        text: linkText,
      });
    } catch (error) {
      console.error(error);
    }
  }, [sourceUrl, linkText]);

  const generateShareQuery = useCallback((social: Social) => {
    switch (social) {
      case Social.Facebook:
        return `?u=${sourceUrl}${linkText ? `&quote=${linkText}` : ""}`;
      case Social.Twitter:
      case Social.Telegram:
        return `?url=${sourceUrl}${linkText ? `&text=${linkText}` : ""}`;
      case Social.LinkedIn:
        return `?url=${sourceUrl}`;
      default:
        return "";
    }
  }, [linkText, sourceUrl]);

  const handleURLOpen = useCallback(async (social: Social) => {
    if (isMobile() && navigator && Boolean(navigator.share)) {
      await shareNatively();
      return;
    }
    const query = generateShareQuery(social);
    const socialURL = `${SOCIAL_LINKS[social]}${query}`;

    window.open(socialURL);
  }, [shareNatively, generateShareQuery]);

  return (
    <div
      className={classNames(
        "social-links-wrapper",
        {
          "social-links-wrapper--modal-mobile": (shareViewType === ShareViewType.modalMobile),
          "social-links-wrapper--top-center": (shareViewType === ShareViewType.popup) && (popupVariant === SharePopupVariant.topCenter),
          "social-links-wrapper--loading": isLoading,

          "social-links-wrapper--modal-desktop": (shareViewType === ShareViewType.modalDesktop),
        }
      )}
      style={{ top: `${top ?? "64px"}` }}
    >
      {shareViewType === ShareViewType.popup && <div className="title">Share with</div>}
      {
        isLoading
          ? <Loader />
          : (
            <div
              className={classNames(
                "social-links",
                {
                "social-links--modal-mobile": (shareViewType === ShareViewType.modalMobile),
                }
              )}
            >
              <button
                className="facebook"
                onClick={() => handleURLOpen(Social.Facebook)}
              />
              <button
                className="twitter"
                onClick={() => handleURLOpen(Social.Twitter)}
              />
              <button
                className="linkedin"
                onClick={() => handleURLOpen(Social.LinkedIn)}
              />
              <button
                className="telegram"
                onClick={() => handleURLOpen(Social.Telegram)}
              />
            </div>
          )
      }
    </div>
  );
}

export default SocialLinks;
