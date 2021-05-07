import React from 'react';
import { NextPage } from 'next';

import lodash from 'lodash';
import { gql } from '@apollo/client';
import { Text, Breadcrumbs, Loading } from '@geist-ui/react';

import { Link } from '@components/Link';
import { useGetAllUsersNotificationsQuery, NotificationType } from '@core/graphql';
import { Calendar, CheckInCircle, XCircle } from '@geist-ui/react-icons';
import { HasPermission } from '@components/HasPermission';

const NotificationPageQuery = gql`
  query getAllUsersNotifications($paginate: PaginateInput!) {
    notifications(paginate: $paginate) {
      id
      type

      createdAt

      seenStatus

      user {
        photo
        displayName
      }
    }
  }
`;

const NotificationsPage: NextPage = () => {
  const { data, loading } = useGetAllUsersNotificationsQuery({
    variables: {
      paginate: {
        take: 20
      }
    }
  });

  const getNotificationIcon = (notificationType: NotificationType) => {
    switch (notificationType) {
      case NotificationType.JoinRequestAccepted:
      case NotificationType.FundingRequestAccepted:
        return <CheckInCircle color="green"/>;

      case NotificationType.FundingRequestRejected:
      case NotificationType.JoinRequestRejected:
        return <XCircle color="red"/>;

      case NotificationType.General:
        return <Calendar/>;

      default:
        return <Calendar/>;
    }
  };

  return (
    <React.Fragment>
      <Text h1>Notifications</Text>
      <Breadcrumbs>
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Link to="/notifications">Notifications</Link>
        </Breadcrumbs.Item>
      </Breadcrumbs>

      {/* Notifications list  */}
      <HasPermission permission="admin.features.preview">
        <React.Fragment>
          {loading && (
            <Loading/>
          )}

          {data && (
            <React.Fragment>
              {data.notifications.map((n) => (
                <React.Fragment key={n.id}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <div
                      style={{
                        borderRadius: '1000px',
                        width: '35px',
                        height: '35px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: `solid 2px`,
                        marginRight: 10
                      }}
                    >
                      {getNotificationIcon(n.type)}
                    </div>

                    <Text>
                      {lodash.startCase(n.type)}
                    </Text>
                  </div>
                </React.Fragment>
              ))}

              {data.notifications.map((n) => (
                <React.Fragment key={n.id}>
                  {/*<User*/}
                  {/*  src={n.user.photo}*/}
                  {/*  name={n.user.displayName}*/}
                  {/*/>*/}
                </React.Fragment>
              ))}
            </React.Fragment>
          )}
        </React.Fragment>
      </HasPermission>

    </React.Fragment>
  );
};

export default NotificationsPage;