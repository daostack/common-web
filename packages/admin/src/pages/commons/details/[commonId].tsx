import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { Spacer, Text, Grid, Card, Breadcrumbs } from '@geist-ui/react';

const CommonDetailsPage: NextPage = () => {
  const router = useRouter();

  console.log(router);

  return (
    <React.Fragment>
      <Spacer y={1}/>

      <Text h1>{'{Common\'s name} details'}</Text>
      <Breadcrumbs>
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item>Commons</Breadcrumbs.Item>
        <Breadcrumbs.Item>[{router.query.commonId}]</Breadcrumbs.Item>
      </Breadcrumbs>

      <Spacer y={3} />

      <Text h3>Financials</Text>

      <Grid.Container gap={2} alignItems="stretch" style={{ display: 'flex' }}>
        <Grid sm={24} md={12}>
          <Card hoverable>
            <Text h1>$1320.98</Text>
            <Text p>Current common balance</Text>
          </Card>
        </Grid>

        <Grid sm={24} md={12}>
          <Card hoverable>
            <Text h1>$34252.32</Text>
            <Text p>Total raised by the common</Text>
          </Card>
        </Grid>
      </Grid.Container>

      <Spacer y={2} />
    </React.Fragment>
  );
};

export default CommonDetailsPage;