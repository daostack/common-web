import { NextPage } from 'next';
import React from 'react';
import { Text, Breadcrumbs } from '@geist-ui/react';
import { Link } from '@components/Link';

const CreateNotificationTemplatePage: NextPage = () => {
  return (
    <React.Fragment>
      <Text h1>Create Notification Template</Text>
      <Breadcrumbs>
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Link to="/notifications">Notifications</Link>
        </Breadcrumbs.Item>

        <Breadcrumbs.Item>
          <Link to="/notifications/templates">Notification Templates</Link>
        </Breadcrumbs.Item>

        <Breadcrumbs.Item>
          <Link to="/notifications/templates/create">Create</Link>
        </Breadcrumbs.Item>
      </Breadcrumbs>


    </React.Fragment>
  );
};

export default CreateNotificationTemplatePage;