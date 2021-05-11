import React from 'react';
import { NextPage } from 'next';

import { gql } from '@apollo/client';
import { Text, Breadcrumbs, Spacer, Table } from '@geist-ui/react';

import { Link } from '@components/Link';
import { useLoadNotificationSettignsQuery } from '@core/graphql';
import { StatusIcon } from '@components/helpers';
import { FullWidthLoader } from '@components/FullWidthLoader';
import lodash from 'lodash';
import { HasPermission } from '@components/HasPermission';
import { Edit } from '@geist-ui/react-icons';
import { Centered } from '@components/Centered';

const LoadNotificationSettings = gql`
  query LoadNotificationSettigns {
    notificationSettings {
      id

      type

      sendEmail
      sendPush

      showInUserFeed
    }
  }
`;


export const NotificationSettingsPage: NextPage = () => {
  const { data, loading } = useLoadNotificationSettignsQuery();

  // Transformers
  const getNotificationSettingsForTable = () => {
    if (data) {
      return data.notificationSettings.map((s) => ({
        forEvent: lodash.startCase(s.type),
        sendPush: (<StatusIcon valid={s.sendPush}/>),
        sendEmail: (<StatusIcon valid={s.sendEmail}/>),
        show: (<StatusIcon valid={s.showInUserFeed}/>),
        edit: (
          <div
            onClick={onEdit(s.id)}
            style={{
              cursor: 'pointer'
            }}
          >
            <Centered>
              <Edit/>
            </Centered>
          </div>
        )
      }));
    } else if (loading) {
      return Array(10).fill({
        forEvent: FullWidthLoader,
        sendPush: FullWidthLoader,
        sendEmail: FullWidthLoader,
        show: FullWidthLoader
      });
    }
  };

  // Actions

  const onEdit = (id: string) => {
    return () => {

    };
  };

  return (
    <React.Fragment>
      <Text h1>Notifications Settings</Text>
      <Breadcrumbs>
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>

        <Breadcrumbs.Item>
          <Link to="/notifications">Notifications</Link>
        </Breadcrumbs.Item>

        <Breadcrumbs.Item>
          <Link to="/notifications/settings">Settings</Link>
        </Breadcrumbs.Item>
      </Breadcrumbs>

      <Spacer/>

      <Table data={getNotificationSettingsForTable()}>
        <Table.Column prop="forEvent">
          For Event
        </Table.Column>

        <Table.Column prop="sendPush" label="Send Push" width={150}>
          <Centered>
            Send Push
          </Centered>
        </Table.Column>

        <Table.Column prop="sendEmail" label="Send Email" width={150}>
          <Centered>
            Send Email
          </Centered>
        </Table.Column>

        <Table.Column prop="show" label="Show in feed" width={150}>
          <Centered>
            Show in feed
          </Centered>
        </Table.Column>

        <HasPermission permission="admin.notification.setting.update">
          <Table.Column prop="edit" width={100}/>
        </HasPermission>
      </Table>
    </React.Fragment>
  );
};

export default NotificationSettingsPage;