import React from "react";
import { NavLink } from "react-router-dom";
import { Text } from "../types";
import styles from "../ChatMessage.module.scss";

interface RenderLinkProps {
  to: string;
  name: string;
  onClick?: () => void;
  className?: string;
}

export const renderLink = ({
  to,
  name,
  onClick,
  className,
}: RenderLinkProps): Text => (
  <NavLink
    className={className || styles.systemMessageCommonLink}
    to={to}
    onClick={onClick}
  >
    {name}
  </NavLink>
);
