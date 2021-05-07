import React from 'react';
import { NextPage } from 'next';
import { Breadcrumbs, Card, Grid, Spacer, Text } from '@geist-ui/react';

import { HasPermission } from '@components/HasPermission';
import { withPermission } from '../../helpers/hoc/withPermission';
import { LatestEventsTable } from '@components/tables/LatestEventsTable';
import { useRouter } from 'next/router';
import { Link } from '@components/Link';
import { gql } from '@apollo/client';
import { useGetAllTimeStatistiscQuery } from '@core/graphql';
import Skeleton from 'react-loading-skeleton';


const GetAllTimeStatistics = gql`
  query getAllTimeStatistisc {
    getStatistics(where: {
      type: AllTime
    }) {
      users
      commons
      joinProposals
      fundingProposals
    }
  }
`;

const DashboardHomePage: NextPage = () => {
  const router = useRouter();

  const statistics = useGetAllTimeStatistiscQuery();

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


      {/* --- Overview --- */}
      <HasPermission permission="admin.dashboard.read.overview">
        <Text h3>Application's overview</Text>

        <Grid.Container gap={2} alignItems="stretch" style={{ display: 'flex' }}>
          <Grid xs={24} md={8} onClick={onCardClick('/commons')} style={{ cursor: 'pointer' }}>
            <Card hoverable>
              <Text h1>
                {statistics.data && (
                  statistics.data.getStatistics[0].commons
                )}

                {!statistics.data && (
                  <Skeleton/>
                )}
              </Text>
              <Text p>Total commons created</Text>
            </Card>
          </Grid>

          <Grid xs={24} md={8} onClick={onCardClick('/proposals')} style={{ cursor: 'pointer' }}>
            <Card hoverable>
              <Text h1>
                {statistics.data && (
                  statistics.data.getStatistics[0].joinProposals +
                  statistics.data.getStatistics[0].fundingProposals
                )}

                {!statistics.data && (
                  <Skeleton/>
                )}
              </Text>
              <Text p>Proposals created</Text>
            </Card>
          </Grid>

          <Grid xs={24} md={8} onClick={onCardClick('/users')} style={{ cursor: 'pointer' }}>
            <Card hoverable>
              <Text h1>
                {statistics.data && (
                  statistics.data.getStatistics[0].users
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
      </HasPermission>


      {/* --- Events table --- */}
      <LatestEventsTable/>

    </React.Fragment>
  );
};

export default withPermission('admin.*', {
  redirect: true
})(DashboardHomePage);