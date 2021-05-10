import React from 'react';
import { NextPage } from 'next';

import { Text, Breadcrumbs, Table } from '@geist-ui/react';

import { Link } from '@components/Link';
import { gql } from '@apollo/client';
import { useGetNotificaitonTemplatesQuery } from '@core/graphql';
import { Tag } from '@geist-ui/react-icons';

const NotificationTemplates = gql`
  query getNotificaitonTemplates($paginate: PaginateInput!, $where: NotificationTemplateWhereInput) {
    notificationTemplates(
      paginate: $paginate,
      where: $where
    ) {
      id

      createdAt
      updatedAt

      subject

      forType
      language
      templateType
    }
  }
`;

const NotificationTemplatesPage: NextPage = () => {
  const { data, loading } = useGetNotificaitonTemplatesQuery({
    variables: {
      paginate: {
        take: 20
      }
    }
  });

  const getDataForNotificationTemplateTable = () => {
    return data.notificationTemplates.map((nt) => ({
      type: (
        <Tag>
          {nt.templateType}
        </Tag>
      )
    }));
  };

  return (
    <React.Fragment>
      <Text h1>Notifications</Text>
      <Breadcrumbs>
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Link to="/notifications">Notifications</Link>
        </Breadcrumbs.Item>

        <Breadcrumbs.Item>
          <Link to="/notifications/templates">Notification Templates</Link>
        </Breadcrumbs.Item>
      </Breadcrumbs>


      {data && (
        <Table style={{ marginTop: '2rem' }}>
          <Table.Column prop="type" label="Notification Type"/>
        </Table>
      )}
    </React.Fragment>
  );
};

export default NotificationTemplatesPage;