import React from 'react';
import { NextPage } from 'next';

import { gql } from '@apollo/client/core';
import { Text, Breadcrumbs, Spacer, Table, Tag, useToasts, User } from '@geist-ui/react';

import { Link } from '@components/Link';
import { useGetReportsQuery } from '@core/graphql';
import { IPaginate, DefaultPaginate } from '@helpers';
import { FullWidthLoader } from '@components/FullWidthLoader';
import { useRouter } from 'next/router';


const ReportsQuery = gql`
  query getReports($pagination: PaginateInput!) {
    reports(pagination: $pagination) {
      id

      status
      type

      reporter {
        id
        photo

        displayName
      }

    }
  }
`;

const ReportsPage: NextPage = () => {
  const router = useRouter();

  const [toasts, setToast] = useToasts();
  const [pagination, setPagination] = React.useState<IPaginate>(DefaultPaginate);

  const { loading, data, error } = useGetReportsQuery({
    variables: {
      pagination
    }
  });

  const transformForTable = () => {
    if (loading || !data) {
      return Array(10).fill({
        reporter: FullWidthLoader,
        type: FullWidthLoader,
        status: FullWidthLoader
      });
    }

    return data.reports.map((r) => ({
      id: r.id,

      status: (
        <Tag
          type={r.status === 'Active' ? 'success' : 'error'}
        >
          {r.status}
        </Tag>
      ),

      reporter: (
        <Link to={`/users/details/${r.reporter.id}`}>
          <User
            src={r.reporter.photo}
            name={r.reporter.displayName}
          />
        </Link>
      ),

      type: (
        <Tag>{r.type}</Tag>
      )
    }));
  };

  const onRow = async (data: { id: string }): Promise<void> => {
    await router.push(`/reports/details/${data.id}`);
  };

  React.useEffect(() => {
    if (error) {
      setToast({
        type: 'error',
        text: 'Error occurred. Check the console for more info'
      });

      console.error(error);
    }
  }, [error]);

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

      <Table data={transformForTable()} onRow={onRow}>
        <Table.Column prop="reporter" label="Reporter" width={200}/>
        <Table.Column prop="status" label="Status"/>
        <Table.Column prop="type" label="Report type"/>
      </Table>
    </div>
  );
};

export default ReportsPage;