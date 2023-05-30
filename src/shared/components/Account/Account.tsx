import React, { useEffect, useRef, useState } from "react";
import { UserAvatar } from "../../../shared/components";
import { User } from "../../../shared/models";
import { useOutsideClick } from "../../hooks";
import { getUserName } from "../../utils";
import "./index.scss";

interface AccountProps {
  user: User | null;
  logOut: () => void;
  isTrusteeRoute: boolean;
  hasAdminAccess: boolean;
}

const Account = ({ user }: AccountProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const wrapperRef = useRef(null);
  const { isOutside, setOutsideValue } = useOutsideClick(wrapperRef);

  useEffect(() => {
    if (isOutside) {
      setShowMenu(false);
      setOutsideValue();
    }
  }, [isOutside, setShowMenu, setOutsideValue]);

  return (
    <div className="account-wrapper" onClick={() => setShowMenu(!showMenu)}>
      <UserAvatar
        className="avatar"
        photoURL={user?.photoURL}
        nameForRandomAvatar={user?.email}
        userName={getUserName(user)}
      />
      <div>{getUserName(user)}</div>
    </div>
  );
};

export default Account;
