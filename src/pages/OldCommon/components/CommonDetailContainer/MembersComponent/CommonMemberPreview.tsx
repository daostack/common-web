import React, { FC, useState, useEffect, useMemo } from "react";
import { getCommonMemberInfo } from "@/pages/OldCommon/store/api";
import { getCountryNameFromCode } from "@/shared/assets/countries";
import { UserAvatar, Modal, Loader } from "@/shared/components";
import {
  CommonMemberPreviewInfo,
  CommonMemberWithUserInfo,
} from "@/shared/models";
import {
  getCirclesWithHighestTier,
  getFilteredByIdCircles,
} from "@/shared/utils/circles";
import "./common-member-preview.scss";

interface CommonMemberPreview {
  member: CommonMemberWithUserInfo | null;
  circles?: string;
  memberName: string;
  avatar: string | undefined;
  isShowing: boolean;
  commonId: string;
  onClose: () => void;
  country?: string;
  about?: string;
  dataFetched?: boolean;
  showCommonsOfMember?: boolean;
}

export const CommonMemberPreview: FC<CommonMemberPreview> = (props) => {
  const {
    member,
    commonId,
    circles,
    memberName,
    avatar,
    isShowing = false,
    onClose,
    country,
    about,
    dataFetched = true,
    showCommonsOfMember = false,
  } = props;
  const [previewInfo, setPreviewInfo] = useState<CommonMemberPreviewInfo>(
    {} as CommonMemberPreviewInfo,
  );
  const [isLoading, setLoading] = useState(true);
  const commonsInfo = useMemo(() => {
    if (!previewInfo.commons) {
      return [];
    }

    return previewInfo.commons
      .map((common) => {
        const governanceCircles = Object.values(common.circles || {});
        const circleIds = Object.values(common.circlesMap || {});
        const filteredByIdCircles = getFilteredByIdCircles(
          governanceCircles,
          circleIds,
        );
        const userCircleNames = getCirclesWithHighestTier(filteredByIdCircles)
          .map(({ name }) => name)
          .join(", ");

        return { ...common, userCircleNames };
      })
      .reduce<CommonMemberPreviewInfo["commons"]>(
        (acc, commonInfo) =>
          commonInfo.id === commonId
            ? [commonInfo, ...acc]
            : [...acc, commonInfo],
        [],
      );
  }, [previewInfo, commonId]);

  useEffect(() => {
    if (isShowing && member?.userId) {
      (async () => {
        const commonMemberPreviewInfo = await getCommonMemberInfo(
          member.userId,
          commonId,
        );
        setPreviewInfo(commonMemberPreviewInfo);
        setLoading(false);
      })();
    }
  }, [isShowing, member]);

  const GeneralUserInfo = () => {
    if (isLoading || !dataFetched) {
      return <Loader />;
    }

    return (
      <>
        {about && (
          <>
            <p className="common-member-preview__section-title">About</p>
            <div className="common-member-preview__info">{about}</div>
          </>
        )}
        {previewInfo.introToCommon && (
          <>
            <p className="common-member-preview__section-title">
              Membership intro
            </p>
            <div className="common-member-preview__info">
              {previewInfo.introToCommon}
            </div>
          </>
        )}
        {showCommonsOfMember && (
          <>
            <p className="common-member-preview__section-title">
              Member of the following Commons
            </p>
            {commonsInfo.map((commonInfo) => (
              <div
                key={commonInfo.id}
                className="common-member-preview__common-name"
              >
                {commonInfo.name} - {commonInfo.userCircleNames}
                {commonInfo.id === commonId && " (current)"}
              </div>
            ))}
          </>
        )}
      </>
    );
  };

  return (
    <Modal
      isShowing={isShowing}
      onClose={onClose}
      className="common-member-preview"
    >
      <div className="common-member-preview__container">
        <div className="common-member-preview__container__header">
          <UserAvatar
            photoURL={avatar}
            className="common-member-preview__container__header__avatar"
          />
          <div className="common-member-preview__container__header__user-info">
            <div className="common-member-preview__container__header__user-info__name">
              {memberName}
            </div>
            <div className="common-member-preview__container__header__user-info__subtitle">
              {circles}
            </div>
            {country && (
              <div className="common-member-preview__container__header__user-info__subtitle common-member-preview__container__header__user-info__country">
                {getCountryNameFromCode(country)}
              </div>
            )}
          </div>
        </div>
        <GeneralUserInfo />
      </div>
    </Modal>
  );
};
