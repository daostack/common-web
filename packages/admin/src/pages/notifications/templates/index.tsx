import React from 'react';
import { NextPage } from 'next';

import { Text, Breadcrumbs } from '@geist-ui/react';

import { Link } from '@components/Link';
import { gql } from '@apollo/client';

const NotificationTemplates = gql`

`;

const NotificationTemplatesPage: NextPage = () => {
  return (
    <React.Fragment>
      <Text h1>Notifications</Text>
      <Breadcrumbs>
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Link to="/notifications">Notifications</Link>
        </Breadcrumbs.Item>

        <Breadcrumbs.Item>
          <Link to="/notifications">Notification Templates</Link>
        </Breadcrumbs.Item>
      </Breadcrumbs>


    </React.Fragment>
  );
};

export default NotificationTemplatesPage;