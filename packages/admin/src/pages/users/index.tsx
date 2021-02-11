import { Breadcrumbs, Card, Grid, Spacer, Text } from '@geist-ui/react';
import { NextPage } from 'next';
import React from 'react';
import { Link } from '../../components/Link';

const UsersHomepage: NextPage = () => {
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
                    9672
                  </Text>
                  <Text p>Total users</Text>
                </Card>
              </Grid>

              <Grid sm={24} md={8}>
                <Card hoverable>
                  <Text h1>
                    123
                  </Text>
                  <Text p>Users joined last week</Text>
                </Card>
              </Grid>

              <Grid sm={24} md={8}>
                <Card hoverable>
                  <Text h1>
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
    </React.Fragment>
  );
};

export default UsersHomepage;