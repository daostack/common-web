import React, { FC } from "react";
import { UserAvatar } from "@/shared/components";
import { VoteWithUserInfo } from "@/shared/models";
import { getUserName } from "@/shared/utils";
import "./index.scss";

interface VoteItemProps {
  vote: VoteWithUserInfo;
}

const VoteItem: FC<VoteItemProps> = (props) => {
  const { vote } = props;
  const userName = getUserName(vote.user);

  return (
    <li className="votes-modal-item">
      <UserAvatar
        className="votes-modal-item__avatar"
        photoURL={vote.user.photoURL}
        nameForRandomAvatar={vote.user.email}
        userName={userName}
      />
      <div className="votes-modal-item__info">
        <span className="votes-modal-item__user-name">{userName}</span>
        <span className="votes-modal-item__vote-date">1m ago</span>
      </div>
      <img
        className="votes-modal-item__vote-icon"
        src={`/icons/votes/${vote.outcome}-old.svg`}
        alt={vote.outcome}
      />
    </li>
  );
};

export default VoteItem;
