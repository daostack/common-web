import React from 'react';
import { NextPage } from 'next';
import { Breadcrumbs, Card, Grid, Spacer, Text, Table, useToasts } from '@geist-ui/react';
import { withPermission } from '../../helpers/hoc/withPermission';
import { LatestEventsTable } from '@components/tables/LatestEventsTable';
import { useRouter } from 'next/router';
import { Link } from '@components/Link';
import { gql } from '@apollo/client';
import Skeleton from 'react-loading-skeleton';
import { useDashboardDataQuery, useAllTimeStatisticsQuery, useRefreshStatisticsMutation } from '@core/graphql';
import { ArrowUpCircle } from '@geist-ui/react-icons';
import Refresh from '@geist-ui/react-icons/refreshCw';
import { motion } from 'framer-motion';
import { HasPermission } from '@components/HasPermission';


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

const RefreshAllTimeStatistics = gql`
  mutation RefreshStatistics {
    forceUpdateStatistics
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

  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [, setToasts] = useToasts();

  const [refreshStatistics] = useRefreshStatisticsMutation();
  const { data: statistics, refetch } = useAllTimeStatisticsQuery();
  const { data } = useDashboardDataQuery();

  const onCardClick = (url: string) => {
    return async () => {
      await router.push(url);
    };
  };

  const onRefreshStatistics = async () => {
    if (!refreshing) {
      setRefreshing(true);

      try {
        const data = await refreshStatistics();

        if (data) {
          await refetch();

          setToasts({
            type: 'success',
            text: 'Successfully refreshed statistics'
          });
        } else {
          throw new Error();
        }
      } catch (e) {
        setToasts({
          type: 'error',
          text: 'Error occurred while refreshing statistics'
        });
      } finally {
        setTimeout(() => {
          setRefreshing(false);
        }, 500);
      }
    }
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

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Text h3>Application's overview</Text>

          <div
            style={{
              cursor: refreshing
                ? 'not-allowed'
                : 'pointer'
            }}
          >
            <HasPermission permission="admin.general.write">
              <motion.div
                animate={{
                  rotate: 360,
                  transition: {
                    duration: 1.5,
                    repeat: refreshing ? Infinity : 0
                  }
                }}
              >
                <Refresh
                  onClick={onRefreshStatistics}
                />
              </motion.div>
            </HasPermission>
          </div>
        </div>

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