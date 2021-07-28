import React from 'react';
import { NextPage } from 'next';

import Skeleton from 'react-loading-skeleton';

import { gql } from '@apollo/client';
import { Breadcrumbs, Card, Grid, Pagination, Spacer, Table, Text } from '@geist-ui/react';

import { Link } from '@components/Link';
import { useRouter } from 'next/router';
import { ChevronLeftCircleFill, ChevronRightCircleFill } from '@geist-ui/react-icons';
import { useGetProposalsHomescreenQuery, useAllTimeStatisticsQuery } from '@core/graphql';

const ProposalsHomepageData = gql`
  query getProposalsHomescreen($fundingPaginate: PaginateInput!, $joinPaginate: PaginateInput!) {
    funding: proposals(
      where: {
        type: FundingRequest
      }
      paginate: $fundingPaginate
    ) {
      id

      commonId

      votesFor
      votesAgainst

      title
      description

      funding {
        amount
      }
    }

    join: proposals(
      where: {
        type: JoinRequest
      }
      paginate: $joinPaginate
    ) {
      id

      commonId

      title
      description

      join {
        funding
        fundingType
      }
    }
  }
`;

const ProposalsHomepage: NextPage = () => {
  // ---- State
  const [fundingPage, setFundingPage] = React.useState<number>(1);
  const [joinPage, setJoinPage] = React.useState<number>(1);

  // ---- Hooks

  const router = useRouter();

  const { data: statistics } = useAllTimeStatisticsQuery();
  const { data } = useGetProposalsHomescreenQuery({
    variables: {
      joinPaginate: {
        take: 10,
        skip: 10 * (joinPage - 1)
      },
      fundingPaginate: {
        take: 10,
        skip: 10 * (fundingPage - 1)
      }
    }
  });

  // ---- Transformers

  const transformJoinData = () => {
    if (!data) {
      return Array(10).fill({});
    }

    return data.join.map((j) => ({
      id: j.id
    }));
  };

  const transformFundingData = () => {
    if (!data) return [];

    return data.funding.map((f) => ({
      id: f.id
    }));
  };

  // --- Actions

  const onTableRow = (data: { id: string }): void => {
    router.push(`/proposals/details/${data.id}`);
  };

  const onJoinPageChange = (page: number) => setJoinPage(page);
  const onFundingPageChange = (page: number) => setFundingPage(page);

  return (
    <React.Fragment>
      <React.Fragment>
        <Text h1>Proposals</Text>
        <Breadcrumbs>
          <Breadcrumbs.Item>Home</Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <Link to="/proposals">Proposals</Link>
          </Breadcrumbs.Item>
        </Breadcrumbs>

        <Spacer y={2}/>

        <React.Fragment>
          <Text h3>Proposals in a nutshell</Text>

          <Grid.Container gap={2} alignItems="stretch" style={{ display: 'flex' }}>
            <Grid sm={24} md={8}>
              <Card hoverable>
                <Text h1>
                  {statistics && (
                    statistics.statistics[0].fundingProposals
                  )}

                  {!statistics && (
                    <Skeleton/>
                  )}
                </Text>
                <Text p>Funding requests</Text>
              </Card>
            </Grid>

            <Grid sm={24} md={8}>
              <Card hoverable>
                <Text h1>
                  {statistics && (
                    statistics.statistics[0].joinProposals
                  )}

                  {!statistics && (
                    <Skeleton/>
                  )}
                </Text>
                <Text p>Join requests</Text>
              </Card>
            </Grid>

            <Grid sm={24} md={8}>
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
                <Text p>Total proposals</Text>
              </Card>
            </Grid>
          </Grid.Container>

          <Spacer y={2}/>
        </React.Fragment>
      </React.Fragment>

      {data && (
        <React.Fragment>
          <React.Fragment>
            <Text h3>Funding Requests</Text>

            <Table data={transformFundingData()} onRow={onTableRow}>
              <Table.Column prop="id"/>
            </Table>

            {statistics && statistics.statistics[0].fundingProposals > 10 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                <Pagination count={Math.ceil(statistics.statistics[0].fundingProposals / 10)}
                            onChange={onFundingPageChange} w>
                  <Pagination.Next>
                    <ChevronRightCircleFill/>
                  </Pagination.Next>

                  <Pagination.Previous>
                    <ChevronLeftCircleFill/>
                  </Pagination.Previous>
                </Pagination>
              </div>
            )}

            <Spacer y={2}/>
          </React.Fragment>

          <React.Fragment>
            <Text h3>Join Requests</Text>

            <Table data={transformJoinData()} onRow={onTableRow}>
              <Table.Column prop="id"/>
            </Table>

            {statistics && statistics.statistics[0].joinProposals > 10 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                <Pagination count={Math.ceil(statistics.statistics[0].joinProposals / 10)}
                            onChange={onJoinPageChange}>
                  <Pagination.Next>
                    <ChevronRightCircleFill/>
                  </Pagination.Next>

                  <Pagination.Previous>
                    <ChevronLeftCircleFill/>
                  </Pagination.Previous>
                </Pagination>
              </div>
            )}
          </React.Fragment>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ProposalsHomepage;