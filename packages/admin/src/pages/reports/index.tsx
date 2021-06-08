import React from 'react';
import { NextPage } from 'next';

import { gql } from '@apollo/client/core';
import { Text, Breadcrumbs, Spacer, Table, Tag } from '@geist-ui/react';

import { Link } from '@components/Link';
import { useGetReportsQuery } from '@core/graphql';
import { IPaginate, DefaultPaginate } from '@helpers';
import { FullWidthLoader } from '@components/FullWidthLoader';


const ReportsQuery = gql`
  query getReports($pagination: PaginateInput!) {
    reports(pagination: $pagination) {
      id

      status
      type

    }
  }
`;

const ReportsPage: NextPage = () => {
  const [pagination, setPagination] = React.useState<IPaginate>(DefaultPaginate);

  const { loading, data } = useGetReportsQuery({
    variables: {
      pagination
    }
  });

  const transformForTable = () => {
    if (loading) {
      return Array(10).fill({
        status: FullWidthLoader
      });
    }

    return data.reports.map((r) => ({
      status: (
        <Tag
          type={r.status === 'Active' ? 'success' : 'error'}
        >
          {r.status}
        </Tag>
      )
    }));
  };

  return (
    <div>
      <Text h1>Reports</Text>
      <Breadcrumbs>
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Link to="/reports">Reports</Link>
        </Breadcrumbs.Item>
      </Breadcrumbs>

      <Spacer y={2}/>

      <Table data={transformForTable()}>
        <Table.Column prop="status" label="Status"/>
      </Table>
    </div>
  );
};

export default ReportsPage;