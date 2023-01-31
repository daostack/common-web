import React from "react";
import { CommonMemberPreview } from "@/pages/OldCommon/components/CommonDetailContainer/MembersComponent/CommonMemberPreview";
import { useCommonMemberWithUserInfo } from "@/shared/hooks/useCases/useCommonMemberWithUserInfo";
import { getUserName } from "@/shared/utils";

interface FeedUserPopupProps {
  commonId: string;
  userId: string | undefined;
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
  const { data: commonMember } = useCommonMemberWithUserInfo(commonId, userId);

  return (
    <>
      {commonMember && (
        <CommonMemberPreview
          key={commonMember.id}
          member={commonMember}
          circles={commonMember.circleIds[0]}
          memberName={getUserName(commonMember.user)}
          avatar={avatar}
          isShowing={isShowing}
          commonId={commonId}
          country={commonMember.user.country}
          about={commonMember.user.intro}
          onClose={onClose}
        />
      )}
    </>
  );
};
