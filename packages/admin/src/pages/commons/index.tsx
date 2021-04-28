import React from 'react';
import { NextPage } from 'next';

import Skeleton from 'react-loading-skeleton';
import { gql } from '@apollo/client/core';
import { Spacer, Text, Table, Pagination, Tag, useToasts, Breadcrumbs, Grid, Card } from '@geist-ui/react';
import { ChevronRightCircleFill, ChevronLeftCircleFill, Home } from '@geist-ui/react-icons';

import { Link } from '../../components/Link';
import { withPermission } from '../../helpers/hoc/withPermission';
import { useRouter } from 'next/router';
import { Centered } from '@components/Centered';
import { FullWidthLoader } from '@components/FullWidthLoader';
import {
  useGetAllTimeStatistiscQuery,
  useGetCommonsHomescreenDataQuery,
  GetCommonsHomescreenDataQueryResult
} from '@core/graphql';

const GetCommonsHomescreenData = gql`
  query getCommonsHomescreenData($take: Int = 10, $skip: Int) {
    commons(paginate: {
      take: $take,
      skip: $skip
    }) {
      id

      name

      raised
      balance

      createdAt
      updatedAt

      members {
        userId
      }

      description
      byline

      fundingType
      fundingMinimumAmount
    }
  }
`;

const CommonsHomepage: NextPage = () => {
  // State
  const [page, setPage] = React.useState<number>(1);

  // Data fetching and custom hooks
  const [toasts, setToast] = useToasts();
  const router = useRouter();
  const statistics = useGetAllTimeStatistiscQuery();
  const data = useGetCommonsHomescreenDataQuery({
    variables: {
      take: 10,
      skip: (page - 1) * 10
    }
  });

  // Actions
  const onPageChange = (val: number): void => {
    setPage(val);
  };

  const transformCommonsArray = (data: GetCommonsHomescreenDataQueryResult): any => {
    if (data.loading) {
      console.debug('Data is still loading, skipping transform');

      return Array(10).fill({
        name: FullWidthLoader,
        raised: FullWidthLoader,
        balance: FullWidthLoader,
        type: FullWidthLoader,
        action: FullWidthLoader
      });
    }

    if (data.error) {
      setToast({
        type: 'error',
        text: 'An error occurred during the data fetching'
      });

      console.error(data.error);

      return [];
    }

    const { commons } = data.data;

    return commons.map((common) => ({
      id: common.id,

      icon: (
        <Centered>
          <Home/>
        </Centered>
      ),

      name: common.name,

      raised: (common.raised / 100)
        .toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      balance: (common.balance / 100)
        .toLocaleString('en-US', { style: 'currency', currency: 'USD' }),

      members: (
        <Text b>
          {common.members.length}
        </Text>
      ),

      type: (
        <React.Fragment>
          {common.fundingType === 'OneTime' ? (
            <Tag type="success">One Time</Tag>
          ) : (
            <Tag type="secondary">Monthly</Tag>
          )}
        </React.Fragment>
      )
    }));
  };

  const onCommonTableRow = (data: { id: string }) => {
    router.push({
      pathname: `/commons/details/${data.id}`
    });
  };

  return (
    <React.Fragment>
      <Text h1>Commons</Text>
      <Breadcrumbs>
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Link to="/commons">Commons</Link>
        </Breadcrumbs.Item>
      </Breadcrumbs>

      <Spacer y={2}/>

      <React.Fragment>
        <Text h3>Commons in a nutshell</Text>

        <Grid.Container gap={2} alignItems="stretch" style={{ display: 'flex' }}>
          <Grid sm={24} md={8}>
            <Card hoverable>
              <Text h1>
                {statistics.data && (
                  statistics.data.getStatistics[0].commons
                )}

                {!statistics.data && (
                  <Skeleton/>
                )}
              </Text>
              <Text p>Total commons</Text>
            </Card>
          </Grid>

          <Grid sm={24} md={8}>
            <Card hoverable>
              <Text h1 type="error">
                98
              </Text>
              <Text p>Commons from the last week</Text>
            </Card>
          </Grid>

          <Grid sm={24} md={8}>
            <Card hoverable>
              <Text h1 type="error">
                432
              </Text>
              <Text p>Commons with funds</Text>
            </Card>
          </Grid>
        </Grid.Container>

        <Spacer y={2}/>
      </React.Fragment>

      <Text h3>All commons</Text>

      <Table data={transformCommonsArray(data)} onRow={onCommonTableRow}>
        <Table.Column prop="icon" width={70}/>
        <Table.Column prop="name" label="Display Name"/>

        <Table.Column
          prop="raised"
          label="Total Raised"
          width={130}
        />

        <Table.Column
          prop="balance"
          label="Balance"
          width={130}
        />

        <Table.Column
          prop="members"
          label="Members"
          width={40}
        />

        <Table.Column
          prop="type"
          label="Common Type"
          width={150}
        />
      </Table>

      {statistics.data && statistics.data.getStatistics[0].commons > 10 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
          <Pagination count={Math.ceil(statistics.data.getStatistics[0].commons / 10)} onChange={onPageChange}>
            <Pagination.Next><ChevronRightCircleFill/></Pagination.Next>
            <Pagination.Previous><ChevronLeftCircleFill/></Pagination.Previous>
          </Pagination>
        </div>
      )}

    </React.Fragment>
  );
};

export default withPermission('admin.commons.*', {
  redirect: true
})(CommonsHomepage);