import React from 'react';
import { NextPage } from 'next';

import Skeleton from 'react-loading-skeleton';
import { gql } from '@apollo/client/core';
import { Breadcrumbs, Card, Grid, Spacer, Text } from '@geist-ui/react';

import { useGetDashboardDataQuery, useStatisticsQuery } from '@graphql';
import { HasPermission } from '@components/HasPermission';
import { withPermission } from '../../helpers/hoc/withPermission';
import { LatestEventsTable } from '@components/tables/LatestEventsTable';
import { useRouter } from 'next/router';
import { Link } from '@components/Link';

const GetDashboardDataQuery = gql`
  query getDashboardData {
    statistics {
      newCommons
      newJoinRequests
      newFundingRequests

      newDiscussions
      newDiscussionMessages
    }
  }
`;

const GetStatisticsQuery = gql`
  query Statistics {
    statistics {
      users
      commons
      joinRequests
      fundingRequests
    }
  }
`;

const DashboardHomePage: NextPage = () => {
  const router = useRouter();

  const data = useGetDashboardDataQuery();
  const statistics = useStatisticsQuery();

  const onCardClick = (url: string) => {
    return () => {
      router.push(url);
    };
  };

  return (
    <React.Fragment>
      <Text h1>Dashboard</Text>

      <Breadcrumbs>
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Link to="/dashboard">Dashboard</Link>
        </Breadcrumbs.Item>
      </Breadcrumbs>

      <Spacer y={2}/>

      {data.data && (
        <React.Fragment>
          <HasPermission permission="admin.dashboard.read.overview">
            <Text h3>Application's overview</Text>

            <Grid.Container gap={2} alignItems="stretch" style={{ display: 'flex' }}>
              <Grid sm={24} md={8} onClick={onCardClick('/commons')} style={{ cursor: 'pointer' }}>
                <Card hoverable>
                  <Text h1>
                    {statistics.data && (
                      statistics.data.statistics.commons
                    )}

                    {!statistics.data && (
                      <Skeleton/>
                    )}
                  </Text>
                  <Text p>Total commons created</Text>
                </Card>
              </Grid>

              <Grid sm={24} md={8} onClick={onCardClick('/proposals')} style={{ cursor: 'pointer' }}>
                <Card hoverable>
                  <Text h1>
                    {statistics.data && (
                      statistics.data.statistics.joinRequests +
                      statistics.data.statistics.fundingRequests
                    )}

                    {!statistics.data && (
                      <Skeleton/>
                    )}
                  </Text>
                  <Text p>Proposals created</Text>
                </Card>
              </Grid>

              <Grid sm={24} md={8} onClick={onCardClick('/users')} style={{ cursor: 'pointer' }}>
                <Card hoverable>
                  <Text h1>
                    {statistics.data && (
                      statistics.data.statistics.users
                    )}

                    {!statistics.data && (
                      <Skeleton/>
                    )}
                  </Text>
                  <Text p>User on common</Text>
                </Card>
              </Grid>
            </Grid.Container>

            <Spacer y={2}/>

            <LatestEventsTable
              refresh
              notify
            />
          </HasPermission>
        </React.Fragment>
      )}

    </React.Fragment>
  );
};

export default withPermission('admin.dashboard.*', {
  redirect: true
})(DashboardHomePage);