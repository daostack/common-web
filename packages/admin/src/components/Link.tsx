import { Link as GeistLink } from '@geist-ui/react';
import NextLink from 'next/link';
import React from 'react';

interface ILinkProps {
  to: string;

  textStyles?: React.CSSProperties;
  containerStyles?: React.CSSProperties;

  Icon?: React.FC;
}

export const Link: React.FC<React.PropsWithChildren<ILinkProps>> = ({ to, Icon, children, ...props }) => {
  return (
    <NextLink href={to}>
      <GeistLink>
        <span style={{ display: 'flex', justifyContent: 'center', ...props.containerStyles }}>
          {Icon && <Icon />}

          <span style={{ paddingLeft: 10, ...props.textStyles }}>
            {children}
          </span>
        </span>
      </GeistLink>
    </NextLink>
  );
};