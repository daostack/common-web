import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import { useRoutesContext } from "@/shared/contexts";
import { useIsTabletView } from "@/shared/hooks/viewport";

interface ContentWrapperProps {
  className?: string;
  commonId: string;
}

const ContentWrapper: FC<ContentWrapperProps> = (props) => {
  const { className, commonId, children } = props;
  const isTabletView = useIsTabletView();
  const { getCommonPageAboutTabPath } = useRoutesContext();

  return isTabletView ? (
    <div className={className}>{children}</div>
  ) : (
    <NavLink className={className} to={getCommonPageAboutTabPath(commonId)}>
      {children}
    </NavLink>
  );
};

export default ContentWrapper;
