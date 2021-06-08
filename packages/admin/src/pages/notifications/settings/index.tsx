import React from 'react';
import { NextPage } from 'next';

import lodash from 'lodash';
import { gql } from '@apollo/client';
import { Edit } from '@geist-ui/react-icons';
import { Text, Breadcrumbs, Spacer, Table, Modal, Checkbox, Note, Button, useToasts } from '@geist-ui/react';

import { Link } from '@components/Link';
import { Centered } from '@components/Centered';
import { StatusIcon } from '@components/helpers';
import { HasPermission } from '@components/HasPermission';
import { FullWidthLoader } from '@components/FullWidthLoader';
import {
  useLoadNotificationSettignsQuery,
  NotificationSystemSettings,
  useUpdateNotificationSettingsMutation
} from '@core/graphql';

const LoadNotificationSettings = gql`
  query LoadNotificationSettigns {
    notificationSettings {
      id

      createdAt
      updatedAt

      type

      sendEmail
      sendPush

      showInUserFeed
    }
  }
`;

const UpdateNotificationSettings = gql`
  mutation UpdateNotificationSettings($input: UpdateNotificationSettingsInput!) {
    updateNotificationSettings(input: $input) {
      id
    }
  }
`;


export const NotificationSettingsPage: NextPage = () => {
  const [, setToast] = useToasts();

  const { data, loading, refetch } = useLoadNotificationSettignsQuery();
  const [updateSettings, { loading: updatingSettings }] = useUpdateNotificationSettingsMutation();

  const [update, setUpdate] = React.useState<NotificationSystemSettings>();

  // Transformers
  const getNotificationSettingsForTable = () => {
    if (data) {
      return data.notificationSettings.map((s) => ({
        forNotificationType: lodash.startCase(s.type),
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
        forNotificationType: FullWidthLoader,
        sendPush: FullWidthLoader,
        sendEmail: FullWidthLoader,
        show: FullWidthLoader
      });
    }
  };

  // Actions

  const onEdit = (id: string) => {
    return () => {
      setUpdate(data.notificationSettings.find(x => x.id === id));
    };
  };

  const onSave = async () => {
    try {
      await updateSettings({
        variables: {
          input: {
            id: update.id,
            showInUserFeed: update.showInUserFeed,
            sendPush: update.sendPush,
            sendEmail: update.sendEmail
          }
        }
      });

      await refetch();

      onClose();


    } catch (e) {
      console.error(e);
    }
  };

  const onClose = () => {
    setUpdate(null);
  };

  const onUpdateValue = (key: keyof NotificationSystemSettings, value: boolean) => {
    setUpdate((u) => ({
      ...u,
      [key]: value
    }));
  };


  return (
    <React.Fragment>
      <Modal open={!!update} onClose={onClose} width="30vw">
        <Modal.Content>
          <Text h4>Edit notification settings for {update?.type}</Text>

          <Spacer y={1.5}/>

          <Checkbox
            size="large"
            checked={update?.sendPush}
            onChange={() => onUpdateValue('sendPush', !update.sendPush)}
          >
            Send via push notification
          </Checkbox>

          <Spacer y={.5}/>

          <Checkbox
            size="large"
            checked={update?.sendEmail}
            onChange={() => onUpdateValue('sendEmail', !update.sendEmail)}
          >
            Send via email
          </Checkbox>

          <Spacer y={.5}/>

          <Checkbox
            size="large"
            checked={update?.showInUserFeed}
            onChange={() => onUpdateValue('showInUserFeed', !update.showInUserFeed)}
          >
            Show in user's notification feed
          </Checkbox>

          <Spacer y={1}/>

          <Note type="warning">
            Depending of whether there is a template for the selected{' '}
            notification type email or push notification may not be{' '}
            send regardless of the chosen value here
          </Note>

          <Spacer y={1}/>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              loading={updatingSettings}
              onClick={onSave}
            >
              Update
            </Button>
          </div>
        </Modal.Content>
      </Modal>


      <React.Fragment>
        <Text h1>Notification Settings</Text>
        <Breadcrumbs>
          <Breadcrumbs.Item>Home</Breadcrumbs.Item>

          <Breadcrumbs.Item>
            <Link to="/notifications">Notifications</Link>
          </Breadcrumbs.Item>

          <Breadcrumbs.Item>
            <Link to="/notifications/settings">Settings</Link>
          </Breadcrumbs.Item>
        </Breadcrumbs>
      </React.Fragment>

      <Spacer/>

      <Table data={getNotificationSettingsForTable()}>
        <Table.Column prop="forNotificationType">
          For Notification Type
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