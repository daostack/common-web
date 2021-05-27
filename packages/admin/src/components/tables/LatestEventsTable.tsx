import React from 'react';
import { Table, Text, Tag, Avatar } from '@geist-ui/react';

import { HasPermission } from '@components/HasPermission';
import { useRouter } from 'next/router';
import { gql } from '@apollo/client';
import { useGetLatestEventsQuery } from '@core/graphql';

const GetLatestEventsQuery = gql`
  query GetLatestEvents($take: Int = 10, $skip: Int = 0) {
    events(paginate: {
      take: $take,
      skip: $skip
    }) {
      id

      createdAt
      type

      user {
        firstName
        lastName

        photo
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

  const { data } = useGetLatestEventsQuery();


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
              <Avatar src={e.user.photo}/>
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
    <HasPermission permission="admin.events.read" redirect={false}>
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