import React from 'react';
import { NextPage } from 'next';

import { gql } from '@apollo/client/core';
import { Card, Grid, Spacer, Table, Text } from '@geist-ui/react';

import { useGetDashboardDataQuery } from '@graphql';
import { HasPermission } from '@components/HasPermission';

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


      {data.data && (
        <React.Fragment>
          <HasPermission permission="admin.dashboard.read.overview">
            <Text h3>Today's overview</Text>

            <Grid.Container gap={2} alignItems="stretch" style={{ display: 'flex' }}>
              <Grid sm={24} md={12}>
                <Card hoverable>
                  <Text h1 type="error">
                    {data.data.today.newCommons}
                  </Text>
                  <Text p>Commons created</Text>
                </Card>
              </Grid>

              <Grid sm={24} md={12}>
                <Card hoverable>
                  <Text h1 type="error">

                    {data.data.today.newJoinRequests + data.data.today.newFundingRequests}
                  </Text>
                  <Text p>Proposals created</Text>
                </Card>
              </Grid>

              <Grid sm={24} md={12}>
                <Card hoverable>
                  <Text h1 type="error">
                    {data.data.today.newDiscussions}
                  </Text>
                  <Text p>Discussions started</Text>
                </Card>
              </Grid>

              <Grid sm={24} md={12}>
                <Card hoverable>
                  <Text h1 type="error">
                    {data.data.today.newDiscussionMessages}
                  </Text>
                  <Text p>Discussion messages send</Text>
                </Card>
              </Grid>
            </Grid.Container>

            <Spacer y={2}/>
          </HasPermission>

          <HasPermission permission="admin.dashboard.read.events">
            <Text h3>Latest events</Text>

            <Table data={data.data.events} hover>
              <Table.Column prop="createdAt" label="Occurred at"/>
              <Table.Column prop="type" label="Event Type"/>
              <Table.Column prop="userId" label="User ID"/>
              <Table.Column prop="objectId" label="Object ID"/>
            </Table>
          </HasPermission>
        </React.Fragment>
      )}

    </React.Fragment>
  );
};

export default DashboardHomePage;