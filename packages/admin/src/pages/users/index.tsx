import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { gql } from '@apollo/client';
import { ChevronLeftCircleFill, ChevronRightCircleFill } from '@geist-ui/react-icons';
import { Avatar, Breadcrumbs, Card, Grid, Pagination, Spacer, Table, Text } from '@geist-ui/react';

import { Link } from '@components/Link';
import { Centered } from '@components/Centered';
import {
  useGetUsersHomepageDataQuery,
  User,
  useAllTimeStatisticsQuery,
  GetUsersHomepageDataQuery
} from '@core/graphql';
import Skeleton from 'react-loading-skeleton';

const UsersHomepageData = gql`
  query getUsersHomepageData($paginate: PaginateInput!, $where: UserWhereInput) {
    users(
      paginate: $paginate,
      where: $where
    ) {
      id

      photo
      email

      firstName
      lastName

      createdAt
    }
  }
`;


const UsersHomepage: NextPage = () => {
  const router = useRouter();

  const [page, setPage] = React.useState<number>(1);
  const [perPage, setPerPage] = React.useState<number>(10);

  const statistics = useAllTimeStatisticsQuery();
  const { data, loading } = useGetUsersHomepageDataQuery({
    variables: {
      paginate: {
        skip: (page - 1) * perPage,
        take: perPage
      }
    }
  });

  // --- Actions

  const onUserRowClick = (rowData: { user: User }): void => {
    router.push({
      pathname: `/users/details/${rowData.user.id}`
    });
  };

  const onPageChange = (page: number): void => {
    setPage(page);
  };

  // --- Transformers
  const transformDataForTable = (data: GetUsersHomepageDataQuery) => {
    const { users } = data;

    if (loading || !users) {
      const FullWidthLoader = (
        <div style={{ width: '100%' }}>
          <Skeleton/>
        </div>
      );

      return Array(10).fill({
        user: FullWidthLoader,
        avatar: FullWidthLoader,
        name: FullWidthLoader,
        email: FullWidthLoader,
        registeredOn: FullWidthLoader
      });
    }

    return users.map((user) => ({
      user: user,

      avatar: (
        <Centered>
          <div style={{ cursor: 'pointer' }}>
            <Avatar src={user.photo}/>
          </div>
        </Centered>
      ),

      name: (
        <Text>
          {user.firstName} {user.lastName}
        </Text>
      ),

      email: (
        <Text>
          {user.email}
        </Text>
      ),

      registeredOn: (
        <Text>
          {new Date(user.createdAt).toDateString()}
        </Text>
      )
    }));
  };

  return (
    <React.Fragment>
      {(
        <React.Fragment>
          <Text h1>Users</Text>
          <Breadcrumbs>
            <Breadcrumbs.Item>Home</Breadcrumbs.Item>
            <Breadcrumbs.Item>
              <Link to="/users">Users</Link>
            </Breadcrumbs.Item>
          </Breadcrumbs>

          <Spacer y={2}/>

          <React.Fragment>
            <Text h3>Users in a nutshell</Text>

            <Grid.Container gap={2} alignItems="stretch" style={{ display: 'flex' }}>
              <Grid sm={24} md={8}>
                <Card hoverable>
                  <Text h1>
                    {statistics.data && (
                      statistics.data.statistics[0].users
                    )}

                    {!statistics.data && (
                      <Skeleton/>
                    )}
                  </Text>
                  <Text p>Total users</Text>
                </Card>
              </Grid>

              <Grid sm={24} md={8}>
                <Card hoverable>
                  <Text h1 type="error">
                    123
                  </Text>
                  <Text p>Users joined last week</Text>
                </Card>
              </Grid>

              <Grid sm={24} md={8}>
                <Card hoverable>
                  <Text h1 type="error">
                    7621
                  </Text>
                  <Text p>Users active last week</Text>
                </Card>
              </Grid>
            </Grid.Container>

            <Spacer y={2}/>
          </React.Fragment>
        </React.Fragment>
      )}

      {data && (
        <React.Fragment>
          <Text h3>Common users</Text>

          <Table data={transformDataForTable(data)} onRow={onUserRowClick}>
            <Table.Column prop="avatar" width={70}/>
            <Table.Column prop="name" label="Name" width={200}/>
            <Table.Column prop="email" label="Email Address"/>
            <Table.Column prop="registeredOn" label="Registered on" width={200}/>
          </Table>

          {statistics.data && (
            <Centered>
              <div style={{ margin: '20px 0' }}>
                <Pagination
                  count={Math.ceil(statistics.data.statistics[0].users / 10)}
                  onChange={onPageChange}
                >
                  <Pagination.Next>
                    <ChevronRightCircleFill/>
                  </Pagination.Next>

                  <Pagination.Previous>
                    <ChevronLeftCircleFill/>
                  </Pagination.Previous>
                </Pagination>
              </div>
            </Centered>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default UsersHomepage;