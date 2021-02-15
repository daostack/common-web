import { Breadcrumbs, Card, Grid, Spacer, Text } from '@geist-ui/react';
import { NextPage } from 'next';
import React from 'react';
import { Link } from '../../components/Link';

const ProposalsHomepage: NextPage = () => {
  return (
    <React.Fragment>
      {(
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
                    1424
                  </Text>
                  <Text p>Open funding requests</Text>
                </Card>
              </Grid>

              <Grid sm={24} md={8}>
                <Card hoverable>
                  <Text h1>
                    98
                  </Text>
                  <Text p>Open join requests</Text>
                </Card>
              </Grid>

              <Grid sm={24} md={8}>
                <Card hoverable>
                  <Text h1>
                    432
                  </Text>
                  <Text p>Closed proposals in the last week</Text>
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

export default ProposalsHomepage;