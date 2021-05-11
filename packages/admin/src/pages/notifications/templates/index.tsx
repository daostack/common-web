import React from 'react';
import { NextPage } from 'next';

import { Text, Breadcrumbs, Table } from '@geist-ui/react';

import { Link } from '@components/Link';
import { gql } from '@apollo/client';
import { useGetNotificaitonTemplatesQuery } from '@core/graphql';
import { Tag, PlusCircle } from '@geist-ui/react-icons';
import { HasPermission } from '@components/HasPermission';
import { useRouter } from 'next/router';

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
  const router = useRouter();

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text h1>Notification Templates</Text>

        <div/>

        <HasPermission permission="admin.notification.setting.templates.create">
          <div
            style={{
              cursor: 'pointer'
            }}
            onClick={async () => {
              await router.push('/notifications/templates/create');
            }}
          >
            <PlusCircle
              strokeWidth={2}
              color="blue"
            />
          </div>
        </HasPermission>
      </div>

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