import React from 'react';
import { NextPage } from 'next';

import { gql } from '@apollo/client';
import { PlusCircle, Trash } from '@geist-ui/react-icons';
import {
  Text,
  Breadcrumbs,
  Tag,
  Table,
  useTheme,
  Modal,
  Divider,
  Select,
  Radio,
  Button,
  useToasts,
  Spacer
} from '@geist-ui/react';

import { Link } from '@components/Link';
import { StatusIcon } from '@components/helpers';
import { FullWidthLoader } from '@components/FullWidthLoader';
import {
  useGetNotificationEventsQuery,
  useGetCreateNotificationEventOptionsLazyQuery,
  EventType,
  NotificationType,
  useCreateNotificationEventIntegrationMutation,
  useDeleteNotificationEventIntegrationMutation
} from '@core/graphql';
import { HasPermission } from '@components/HasPermission';

const GetNotificationEvents = gql`
  query GetNotificationEvents($paginate: PaginateInput!) {
    notificationEventSettings(paginate: $paginate) {
      id

      sendToEveryone
      sendToCommon
      sendToUser

      description

      sendNotificationType
      onEvent
    }
  }
`;

const GetCreateNotificationEventsOptions = gql`
  query GetCreateNotificationEventOptions {
    notificationEventOptions {
      availableEvents
      availableNotifications
    }
  }
`;

const Mutations = gql`
  mutation CreateNotificationEventIntegration($input: CreateNotificationEventSettingsInput!) {
    createNotificationEventSettings(input: $input) {
      id
    }
  }

  mutation DeleteNotificationEventIntegration($id: ID!) {
    deleteEventNotificationSetting(id: $id)
  }

`;

interface CreateIntegrationData {
  onEvent: EventType;
  notificationType: NotificationType;
  sendTo: string;
}

const NotificationEventsPage: NextPage = () => {
  const theme = useTheme();
  const [, setToasts] = useToasts();

  const [deleteIntegration, { loading: deletingIntegration }] = useDeleteNotificationEventIntegrationMutation();
  const [createIntegration, { loading: creatingIntegration }] = useCreateNotificationEventIntegrationMutation();
  const [loadOptions, { data: options }] = useGetCreateNotificationEventOptionsLazyQuery();
  const { data, loading, refetch } = useGetNotificationEventsQuery({
    variables: {
      paginate: {
        take: 100
      }
    }
  });

  // State
  const [createOpen, setCreateOpen] = React.useState<boolean>();
  const [createData, setCreateData] = React.useState<CreateIntegrationData>();

  // Actions
  const onOpenCreate = () => {
    setCreateOpen(true);

    setCreateData({
      onEvent: null,
      notificationType: null,
      sendTo: 'everyone'
    });

    if (!options) {
      loadOptions();
    }
  };

  // Set data
  const onEventChange = (e: EventType) => {
    setCreateData((v) => ({
      ...v,
      onEvent: e
    }));
  };

  const onNotificationChange = (n: NotificationType) => {
    setCreateData((v) => ({
      ...v,
      notificationType: n
    }));
  };

  const onSendToChange = (st: string) => {
    setCreateData((v) => ({
      ...v,
      sendTo: st
    }));
  };

  const onCreate = async (): Promise<void> => {
    try {
      const res = await createIntegration({
        variables: {
          input: {
            onEvent: createData.onEvent,
            sendNotificationType: createData.notificationType,

            description: `${createData.notificationType} send on ${createData.onEvent}`,

            sendToEveryone: createData.sendTo === 'sendToEveryone',
            sendToCommon: createData.sendTo === 'sendToCommon',
            sendToUser: createData.sendTo === 'sendToUser'
          }
        }
      });

      setCreateOpen(false);

      setToasts({
        type: 'success',
        text: 'Integration created'
      });

      refetch()
        .then(() => {
          console.info('Refreshed the event integrations after new event was created');
        });
    } catch (e) {
      setToasts({
        type: 'error',
        text: 'Error occurred when creating the integration!'
      });

      console.error(e);
    }
  };

  const onDelete = (id: string) => {
    return async () => {
      const res = await deleteIntegration({
        variables: {
          id
        }
      });

      if (res.data.deleteEventNotificationSetting) {
        await refetch();

        console.info('Refreshed the event integrations after one was deleted');

        setToasts({
          type: 'success',
          text: 'Integration deleted'
        });
      } else {
        setToasts({
          type: 'error',
          text: 'Error occurred when deleting the integration!'
        });
      }
    };
  };

  // Transformers
  const getNotificationEventsForTable = () => {
    if (data) {
      return data.notificationEventSettings.map((ns) => ({
        description: ns.description,
        sendToEveryone: (
          <StatusIcon valid={ns.sendToEveryone}/>
        ),
        sendToCommon: (
          <StatusIcon valid={ns.sendToCommon}/>
        ),
        sendToUser: (
          <StatusIcon valid={ns.sendToUser}/>
        ),

        onEvent: (
          <Text>{ns.onEvent}</Text>
        ),

        sendNotification: (
          <Tag>{ns.sendNotificationType}</Tag>
        ),

        actions: (
          <Trash
            onClick={onDelete(ns.id)}
            style={{
              cursor: 'pointer'
            }}
          />
        )
      }));
    } else if (loading) {
      return Array(10).fill({
        description: FullWidthLoader,
        sendToEveryone: FullWidthLoader,
        sendToCommon: FullWidthLoader,
        sendToUser: FullWidthLoader,
        onEvent: FullWidthLoader,
        sendNotification: FullWidthLoader,
        actions: FullWidthLoader
      });
    }
  };

  return (
    <React.Fragment>
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} width="50%">
        <Modal.Content>
          <Text
            h4
            style={{
              marginBottom: 0
            }}
          >
            Create new event notification integration
          </Text>

          <Text
            style={{
              marginTop: 0
            }}
          >
            After creating the integration new notification will be created{' '}
            for the selected user group on the selected even
          </Text>

          <Divider/>

          {options && (
            <React.Fragment>
              <React.Fragment>
                <Text style={{ marginBottom: 0 }}>On event</Text>
                <Select width="100%" placeholder="Select event" value={createData.onEvent} onChange={onEventChange}>
                  {options.notificationEventOptions.availableEvents
                    .filter(x => !data.notificationEventSettings.filter(y => y.onEvent === x).length)
                    .map((e) => (
                      <Select.Option value={e} key={e}>
                        {e}
                      </Select.Option>
                    ))}
                </Select>
              </React.Fragment>

              <React.Fragment>
                <Text style={{ marginBottom: 0 }}>Will create notification with type</Text>
                <Select
                  width="100%"
                  placeholder="Select notification type"
                  value={createData.notificationType}
                  onChange={onNotificationChange}
                >
                  {options.notificationEventOptions.availableNotifications.map((n) => (
                    <Select.Option value={n} key={n}>
                      {n}
                    </Select.Option>
                  ))}
                </Select>
              </React.Fragment>

              <React.Fragment>
                <Text style={{ marginBottom: '.5em' }}>Send to</Text>

                <Radio.Group value={createData.sendTo} onChange={onSendToChange}>
                  <Radio value="sendToEveryone">All users</Radio>
                  <Radio value="sendToCommon">All common members</Radio>
                  <Radio value="sendToUser">The event initiator</Radio>
                </Radio.Group>
              </React.Fragment>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}
              >
                <Button
                  loading={creatingIntegration}
                  onClick={onCreate}
                >
                  Create
                </Button>
              </div>
            </React.Fragment>
          )}


        </Modal.Content>
      </Modal>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text h1>Notification Events</Text>

        <div/>

        <HasPermission permission="admin.notification.setting.event.create">
          <div
            onClick={onOpenCreate}
            style={{
              cursor: 'pointer'
            }}
          >
            <PlusCircle
              strokeWidth={2}
              color={theme.palette.success}
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
          <Link to="/notifications/events">Events</Link>
        </Breadcrumbs.Item>
      </Breadcrumbs>

      <Spacer/>

      <Table data={getNotificationEventsForTable()}>
        <Table.Column prop="description" label="Description"/>
        <Table.Column prop="sendToEveryone" label="Send to everyone"/>
        <Table.Column prop="sendToCommon" label="Send to common"/>
        <Table.Column prop="sendToUser" label="Send to user"/>
        <Table.Column prop="onEvent" label="Broadcast on event"/>
        <Table.Column prop="sendNotification" label="Type of the created notification"/>
        <Table.Column prop="actions" label=""/>
      </Table>
    </React.Fragment>
  );
};

export default NotificationEventsPage;