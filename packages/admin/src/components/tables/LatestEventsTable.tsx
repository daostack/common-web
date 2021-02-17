import React from 'react';

import { gql } from '@apollo/client';
import { Avatar, Table, Tag, Text, useToasts } from '@geist-ui/react';

import { HasPermission } from '@components/HasPermission';
import { useGetLatestEventsQuery } from '@graphql';
import useSound from 'use-sound';
import { useRouter } from 'next/router';

const GetLatestEventsQuery = gql`
  query GetLatestEvents($last: Int = 10, $after: Int = 0) {
    events(
      last: $last,
      after: $after
    ) {
      id

      createdAt

      type

      user {
        id

        firstName
        lastName

        photoURL
      }
    }
  }
`;

interface ILatestEventsTableProps {
  pagination?: boolean;
  refresh?: boolean;
  notify?: boolean;
}

export const LatestEventsTable: React.FC<ILatestEventsTableProps> = ({ pagination, refresh, notify }) => {
  const router = useRouter();

  const [toasts, setToast] = useToasts();
  const [play] = useSound('assets/sounds/notification.mp3');


  const { data, previousData } = useGetLatestEventsQuery({
    pollInterval: 5 * 1000
  });

  React.useEffect(() => {
    if (notify && !refresh) {
      console.warn('No notification will be sent when refresh is falsy!');
    }
  }, [refresh, notify]);

  React.useEffect(() => {
    if (previousData?.events?.length && notify) {
      const newEvents = data.events.filter(e => !previousData.events.includes(e));

      if (newEvents) {
        play();

        newEvents.forEach((e) => {
          setToast({
            text: `New event: ${e.type}`,
            delay: 2000
          });
        });
      }
    }
  }, [data, previousData]);

  const transformDataForTable = () => {
    return data.events.map((e) => ({
      id: e.id,

      occurredAt: new Date(e.createdAt).toLocaleString(),

      eventType: (
        <Tag>
          {e.type}
        </Tag>
      ),

      user: (
        <React.Fragment>
          {e.user ? (
            <React.Fragment>
              <Avatar src={e.user.photoURL} />
              <Text b style={{ marginLeft: 10 }}>
                {e.user.firstName} {e.user.lastName}
              </Text>
            </React.Fragment>
          ) : '-'}
        </React.Fragment>
      )
    }));
  };

  const onRowClick = (data: any): void => {
    if (data.id) {
      router.push({
        pathname: `/events/details/${data.id}`
      });
    }
  };

  return (
    <HasPermission permission="admin.events.read.list">
      {data && (
        <React.Fragment>
          <Text h3>Latest events</Text>

          <Table data={transformDataForTable()} onRow={onRowClick} hover>
            <Table.Column prop="occurredAt" label="Occurred at"/>
            <Table.Column prop="user" label="Actor"/>
            <Table.Column prop="eventType" label="Event Type"/>
          </Table>
        </React.Fragment>
      )}
    </HasPermission>
  );
};