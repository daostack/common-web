import { Monitor } from '@geist-ui/react-icons';
import React from 'react';

import { Link } from './Link';


export const Sidebar: React.FC = () => {
  return (
    <React.Fragment>
      <Link to="/dashboard" containerStyles={{ margin: 10 }}>
        Dashboard
      </Link>

      <br/>

      <Link to="/commons"  containerStyles={{ margin: 10 }}>
        Commons
      </Link>

      <br/>

      <Link to="/proposals"  containerStyles={{ margin: 10 }}>
        Proposals
      </Link>

      <br/>

      <Link to="/payouts"  containerStyles={{ margin: 10 }}>
        Payouts
      </Link>
    </React.Fragment>
  );
};