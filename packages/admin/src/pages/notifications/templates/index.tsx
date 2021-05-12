import React from 'react';
import { NextPage } from 'next';

import { Text, Breadcrumbs, Table, Tag } from '@geist-ui/react';

import { Link } from '@components/Link';
import { gql } from '@apollo/client';
import { useGetNotificaitonTemplatesQuery } from '@core/graphql';
import { PlusCircle, Info } from '@geist-ui/react-icons';
import { HasPermission } from '@components/HasPermission';
import { useRouter } from 'next/router';
import lodash from 'lodash';
import { StatusIcon } from '@components/helpers';

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
    return lodash.unionBy(data.notificationTemplates, 'forType')
      .map((t) => {
        const related = data.notificationTemplates.filter(x => x.forType === t.forType);

        return ({
          forNotification: (
            <Text>
              {t.forType}
            </Text>
          ),

          push: (
            <StatusIcon
              valid={related.some(x => x.templateType === 'PushNotification')}
            />
          ),

          email: (
            <StatusIcon
              valid={related.some(x => x.templateType === 'EmailNotification')}
            />
          ),

          localizations: (
            <React.Fragment>
              {related.map(x => (
                <Tag type="success" style={{ marginRight: '1rem' }}>
                  {x.language}
                </Tag>
              ))}
            </React.Fragment>
          ),

          actions: (
            <React.Fragment>
              <Link to={`/notifications/templates/details/${t.forType}`}>
                <Info/>
              </Link>
            </React.Fragment>
          )
        });
      });
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
        <Table style={{ marginTop: '2rem' }} data={getDataForNotificationTemplateTable()}>
          <Table.Column prop="forNotification" label="Notification Type"/>
          <Table.Column prop="localizations" label="Localizations"/>

          <Table.Column prop="push" label="Email" width={50}/>
          <Table.Column prop="email" label="Push" width={50}/>

          <Table.Column prop="actions" label="" width={50}/>
        </Table>
      )}
    </React.Fragment>
  );
};

export default NotificationTemplatesPage;