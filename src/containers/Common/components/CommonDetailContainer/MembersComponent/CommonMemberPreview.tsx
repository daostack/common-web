import React, { FC, useState, useEffect, useCallback, useMemo } from "react";
import { UserAvatar, Modal, Loader} from "@/shared/components";
import { CommonMemberPreviewInfo, CommonMemberWithUserInfo } from "@/shared/models";
import { getCommonMemberInfo } from "@/containers/Common/store/api";
import { getCountryNameFromCode } from "@/shared/assets/countries";
import { ROUTE_PATHS } from "@/shared/constants";
import { getCirclesNames } from "@/shared/utils/circles";
import "./common-member-preview.scss"

interface CommonMemberPreview {
  member: CommonMemberWithUserInfo;
  circles: string;
  memberName: string;
  avatar: string | undefined;
  isShowing: boolean;
  commonId: string;
  onClose: () => void;
  country: string;
  about?: string;
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
    about
  } = props;
  const [previewInfo, setPreviewInfo] = useState<CommonMemberPreviewInfo>({} as CommonMemberPreviewInfo);
  const [isLoading, setLoading] = useState(true);
  const commonsInfo = useMemo(() => {
    if (!previewInfo.commons) {
      return [];
    }

    return previewInfo.commons.map((common) => {
      const userCircleNames = getCirclesNames(Object.values(common.circles || {}), Object.values(common.circlesMap || {}) as string[]);

      return { ...common, userCircleNames };
    });
  },[previewInfo]);

  useEffect(() => {
    if(isShowing && member?.userId) {
      (async () => {
        const commonMemberPreviewInfo = await getCommonMemberInfo(member.userId, commonId);
        setPreviewInfo(commonMemberPreviewInfo);
        setLoading(false);
      })();
    }
  },[isShowing, member])

  const GeneralUserInfo = useCallback(() => {
    if(isLoading) {
      return <Loader />
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
            <p className="common-member-preview__section-title">Membership intro</p>
            <div className="common-member-preview__info">{previewInfo.introToCommon}</div>
          </>
        )}
        <p className="common-member-preview__section-title">Member of the following Commons</p>
        {commonsInfo.map((item) => (
          <div key={item.id} className="common-member-preview__info">
            <a
              href={ROUTE_PATHS.COMMON_DETAIL.replace(':id', item.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="common-member-preview__common-name-link"
            >
              {item.name}
            </a>
            {" "}
            -
            {" "}
            {item.userCircleNames}
          </div>
        ))}
      </>
    )
  },[isLoading, about, previewInfo])


  return (
    <Modal isShowing={isShowing} onClose={onClose} className="common-member-preview">
      <div className="common-member-preview__container">
        <div className="common-member-preview__container__header">
          <UserAvatar photoURL={avatar} className="common-member-preview__container__header__avatar" />
          <div className="common-member-preview__container__header__user-info">
            <div className="common-member-preview__container__header__user-info__name">{memberName}</div>
            <div className="common-member-preview__container__header__user-info__subtitle">{circles}</div>
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
  )
}
