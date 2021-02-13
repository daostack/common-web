import React from 'react';
import { NextPage } from 'next';

import { gql } from '@apollo/client';
import { withAuthUser, withAuthUserSSR } from 'next-firebase-auth';

import { Card, Grid, Spacer, Table, Text } from '@geist-ui/react';

import { useGetDashboardDataQuery } from '../../graphql';

const GetDashboardDataQuery = gql`
  query getDashboardData {
    today {
      newCommons
      newJoinRequests
      newFundingRequests

      newDiscussions
      newDiscussionMessages
    }

    events(last: 10) {
      id

      createdAt
      updatedAt

      userId
      objectId

      type
    }
  }
`;

const DashboardHomePage: NextPage = () => {
  const data = useGetDashboardDataQuery();

  return (
    <React.Fragment>
      <Text h1>Dashboard</Text>


      <Spacer y={2}/>


      <Text h3>Today's overview</Text>

      <Grid.Container gap={2} alignItems="stretch" style={{ display: 'flex' }}>
        <Grid sm={24} md={12}>
          <Card hoverable>
            <Text h1>
              {data.loading ? (
                'Loading...'
              ) : (
                <React.Fragment>
                  {data.data.today.newCommons}
                </React.Fragment>
              )}
            </Text>
            <Text p>Commons created</Text>
          </Card>
        </Grid>

        <Grid sm={24} md={12}>
          <Card hoverable>
            <Text h1>

              {data.loading ? (
                'Loading...'
              ) : (
                <React.Fragment>
                  {data.data.today.newJoinRequests + data.data.today.newFundingRequests}
                </React.Fragment>
              )}
            </Text>
            <Text p>Proposals created</Text>
          </Card>
        </Grid>

        <Grid sm={24} md={12}>
          <Card hoverable>
            <Text h1>
              {data.loading ? (
                'Loading...'
              ) : (
                <React.Fragment>
                  {data.data.today.newDiscussions}
                </React.Fragment>
              )}
            </Text>
            <Text p>Discussions started</Text>
          </Card>
        </Grid>

        <Grid sm={24} md={12}>
          <Card hoverable>
            <Text h1>
              {data.loading ? (
                'Loading...'
              ) : (
                <React.Fragment>
                  {data.data.today.newDiscussionMessages}
                </React.Fragment>
              )}
            </Text>
            <Text p>Discussion messages send</Text>
          </Card>
        </Grid>
      </Grid.Container>

      <Spacer y={2}/>

      <Text h3>Latest events</Text>

      <Table data={data.loading ? [] : data.data.events} hover>
        <Table.Column prop="createdAt" label="Occurred at"/>
        <Table.Column prop="type" label="Event Type"/>
        <Table.Column prop="userId" label="User ID"/>
        <Table.Column prop="objectId" label="Object ID"/>
      </Table>

    </React.Fragment>
  );
};


export const getServerSideProps = withAuthUserSSR()(async (ctx) => {
  const { AuthUser } = ctx;

  console.log(AuthUser)

  if (!AuthUser || !AuthUser.id) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false
      }
    };
  }

  return {
    props: {
      email: AuthUser.email,
      emailVerified: AuthUser.emailVerified,
      someOtherProp: 'any other data can be added'
    }
  };
});

export default withAuthUser()(DashboardHomePage);

// export default DashboardHomePage;