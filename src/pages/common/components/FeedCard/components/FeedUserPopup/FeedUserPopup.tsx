import React from "react";
import { CommonMemberPreview } from "@/pages/OldCommon/components/CommonDetailContainer/MembersComponent/CommonMemberPreview";
import { useCommonMemberWithUserInfo } from "@/shared/hooks/useCases";
import { Loader } from "@/shared/ui-kit";
import { getUserName } from "@/shared/utils";
import styles from "./FeedUserPopup.module.scss";

interface FeedUserPopupProps {
  commonId: string;
  userId?: string;
  avatar: string;
  isShowing: boolean;
  onClose: () => void;
}

export const FeedUserPopup = ({
  commonId,
  userId,
  avatar,
  isShowing,
  onClose,
}: FeedUserPopupProps) => {
  const { data, fetched } = useCommonMemberWithUserInfo(commonId, userId);

  if (!data || !fetched) {
    return <Loader className={styles.loader} />;
  }

  return (
    <CommonMemberPreview
      key={data.id}
      member={data}
      circles={data.circleIds[0]}
      memberName={getUserName(data.user)}
      avatar={avatar}
      isShowing={isShowing}
      commonId={commonId}
      country={data.user.country}
      about={data.user.intro}
      onClose={onClose}
    />
  );
};
