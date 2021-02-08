import { NextPage } from 'next';
import React from 'react';

import { Text } from '@geist-ui/react';
import { withSidebar } from '../../hoc/withSidebar';

const DashboardHomePage: NextPage = () => {
  return (
    <React.Fragment>
      <Text h1>Dashboard</Text>
    </React.Fragment>
  )
}

export default withSidebar(DashboardHomePage);