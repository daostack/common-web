import { withLayout } from '@hoc';
import { NextPage } from 'next';
import React from 'react';

import { Card, Divider, Grid, Spacer, Table, Text } from '@geist-ui/react';

const DashboardHomePage: NextPage = () => {
  const events = [
    {type: 'newUserCreated', userId: '97303146-5e95-429f-9d13-d4ee9c754c15', objectId: '97303146-5e95-429f-9d13-d4ee9c754c15'},
    {type: 'newUserCreated', userId: '97303146-5e95-429f-9d13-d4ee9c754c15', objectId: '97303146-5e95-429f-9d13-d4ee9c754c15'},
    {type: 'newUserCreated', userId: '97303146-5e95-429f-9d13-d4ee9c754c15', objectId: '97303146-5e95-429f-9d13-d4ee9c754c15'},
    {type: 'newUserCreated', userId: '97303146-5e95-429f-9d13-d4ee9c754c15', objectId: '97303146-5e95-429f-9d13-d4ee9c754c15'},
    {type: 'newUserCreated', userId: '97303146-5e95-429f-9d13-d4ee9c754c15', objectId: '97303146-5e95-429f-9d13-d4ee9c754c15'},
    {type: 'newUserCreated', userId: '97303146-5e95-429f-9d13-d4ee9c754c15', objectId: '97303146-5e95-429f-9d13-d4ee9c754c15'},
    {type: 'newUserCreated', userId: '97303146-5e95-429f-9d13-d4ee9c754c15', objectId: '97303146-5e95-429f-9d13-d4ee9c754c15'},
    {type: 'newUserCreated', userId: '97303146-5e95-429f-9d13-d4ee9c754c15', objectId: '97303146-5e95-429f-9d13-d4ee9c754c15'}
  ];

  return (
    <React.Fragment>
      <Spacer y={1} />

      <Text h1>Dashboard</Text>


      <Text h3>Today's overview</Text>

      <Grid.Container gap={2} alignItems="stretch" style={{ display: 'flex' }}>
        <Grid sm={24} md={12}>
          <Card hoverable>
            <Text h1>13</Text>
            <Text p>Commons created</Text>
          </Card>
        </Grid>

        <Grid sm={24} md={12}>
          <Card hoverable>
            <Text h1>133</Text>
            <Text p>Proposals created</Text>
          </Card>
        </Grid>

        <Grid sm={24} md={12}>
          <Card hoverable>
            <Text h1>28</Text>
            <Text p>Discussions started</Text>
          </Card>
        </Grid>

        <Grid sm={24} md={12}>
          <Card hoverable>
            <Text h1>23124</Text>
            <Text p>Discussion messages send</Text>
          </Card>
        </Grid>
      </Grid.Container>

      <Spacer y={2} />

      <Text h3>Latest events</Text>

      <Table data={events} hover>
        <Table.Column prop="type" label="Event Type" />
        <Table.Column prop="userId" label="User ID" />
        <Table.Column prop="objectId" label="Object ID" />
      </Table>
    </React.Fragment>
  )
}

export default DashboardHomePage;