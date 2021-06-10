import React from 'react';
import { NextPage } from 'next';
import { Breadcrumbs, Card, Grid, Spacer, Text, Table } from '@geist-ui/react';
import { withPermission } from '../../helpers/hoc/withPermission';
import { LatestEventsTable } from '@components/tables/LatestEventsTable';
import { useRouter } from 'next/router';
import { Link } from '@components/Link';
import { gql } from '@apollo/client';
import Skeleton from 'react-loading-skeleton';
import { useDashboardDataQuery, useAllTimeStatisticsQuery } from '@core/graphql';
import { ArrowUpCircle } from '@geist-ui/react-icons';


const AllTimeStatistics = gql`
  query AllTimeStatistics {
    statistics(where: {
      type: AllTime
    }) {
      users
      commons
      joinProposals
      fundingProposals
    }
  }
`;

const DashboardData = gql`
  query dashboardData {
    payouts(
      where: {
        isPendingApprover: true
      }
    ) {
      id

      status
      description
      proposals {
        id
      }
    }
  }
`;

const DashboardHomePage: NextPage = () => {
  const router = useRouter();

  const { data: statistics } = useAllTimeStatisticsQuery();
  const { data } = useDashboardDataQuery();

  const onCardClick = (url: string) => {
    return async () => {
      await router.push(url);
    };
  };

  const transformPayoutsTable = () => {
    if (!data) {
      return [];
    }

    return data.payouts.map((p) => ({
      status: p.status,
      description: p.description,
      proposals: (
        <Text>
          {p.proposals.length}
        </Text>
      ),

      approve: (
        <Link to={`/financials/payouts/${p.id}/approve`}>
          <ArrowUpCircle/>
        </Link>
      )
    }));
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


      <React.Fragment>
        {/* --- Overview --- */}
        <Text h3>Application's overview</Text>

        <Grid.Container gap={2} alignItems="stretch" style={{ display: 'flex' }}>
          <Grid xs={24} md={8} onClick={onCardClick('/commons')} style={{ cursor: 'pointer' }}>
            <Card hoverable>
              <Text h1>
                {statistics && (
                  statistics.statistics[0].commons
                )}

                {!statistics && (
                  <Skeleton/>
                )}
              </Text>
              <Text p>Total commons created</Text>
            </Card>
          </Grid>

          <Grid xs={24} md={8} onClick={onCardClick('/proposals')} style={{ cursor: 'pointer' }}>
            <Card hoverable>
              <Text h1>
                {statistics && (
                  statistics.statistics[0].joinProposals +
                  statistics.statistics[0].fundingProposals
                )}

                {!statistics && (
                  <Skeleton/>
                )}
              </Text>
              <Text p>Proposals created</Text>
            </Card>
          </Grid>

          <Grid xs={24} md={8} onClick={onCardClick('/users')} style={{ cursor: 'pointer' }}>
            <Card hoverable>
              <Text h1>
                {statistics && (
                  statistics.statistics[0].users
                )}

                {!statistics && (
                  <Skeleton/>
                )}
              </Text>
              <Text p>User on common</Text>
            </Card>
          </Grid>
        </Grid.Container>
      </React.Fragment>

      <Spacer y={2}/>

      {!!data?.payouts?.length && (
        <React.Fragment>
          <Text h3>Your payout pending approvals</Text>

          <Table data={transformPayoutsTable()}>
            <Table.Column prop="status" label="Payout Status"/>
            <Table.Column prop="description" label="Description"/>
            <Table.Column prop="proposals" label="Count of proposals"/>
            <Table.Column prop="approve" label="Approve"/>
          </Table>

          <Spacer y={2}/>
        </React.Fragment>
      )}


      {/* --- Events table --- */}
      <LatestEventsTable/>

    </React.Fragment>
  );
};

export default withPermission('admin.*', {
  redirect: true
})(DashboardHomePage);