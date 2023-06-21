import React from "react";
import { CommonMemberPreview } from "@/pages/OldCommon/components/CommonDetailContainer/MembersComponent/CommonMemberPreview";
import { useCommonMemberWithUserInfo } from "@/shared/hooks/useCases";
import { getUserName } from "@/shared/utils";

interface UserPopupProps {
  commonId: string;
  userId?: string;
  avatar: string;
  isShowing: boolean;
  onClose: () => void;
}

const UserPopup = ({
  commonId,
  userId,
  avatar,
  isShowing,
  onClose,
}: UserPopupProps) => {
  const { data, fetched } = useCommonMemberWithUserInfo(commonId, userId);

  return (
    <CommonMemberPreview
      key={data?.id}
      member={data}
      circles={data?.circleIds[0]}
      memberName={getUserName(data?.user)}
      avatar={avatar}
      isShowing={isShowing}
      commonId={commonId}
      country={data?.user.country}
      about={data?.user.intro}
      onClose={onClose}
      dataFetched={fetched}
    />
  );
};

export default UserPopup;
