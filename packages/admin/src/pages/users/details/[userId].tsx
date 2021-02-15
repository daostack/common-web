import { gql } from '@apollo/client';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useGetUserDetailsQueryQuery, GetUserDetailsQueryQueryResult } from '@graphql';
import React from 'react';
import { Link } from '../../../components/Link';
import { Breadcrumbs, Text, Image, Grid, Card, Spacer, Table, Tag, Tooltip } from '@geist-ui/react';
import { XCircle as Cancel, Function, Clock, CheckCircle, ExternalLink } from '@geist-ui/react-icons';


const UserDetailsDataQuery = gql`
  query getUserDetailsQuery($userId: ID!) {
    user(id: $userId) {
      id

      firstName
      lastName

      email

      createdAt

      photoURL

      proposals {
        id

        type
        
        state
        paymentState

        description {
          title

        }
      }

      subscriptions {
        id

        amount

        metadata {
          common {
            id
            name
          }
        }

        status
        revoked

        createdAt
        updatedAt

        lastChargedAt
        dueDate
      }
    }
  }
`;

const UserDetailsPage: NextPage = () => {
  const router = useRouter();
  const data = useGetUserDetailsQueryQuery({
    variables: {
      userId: router.query.userId as string
    }
  });

  // Helpers
  const getActiveSubscriptionCount = () => {
    return data.data
      ? data.data.user.subscriptions
        .filter((subscription) =>
          subscription.status === 'active' ||
          subscription.status === 'paymentFailed').length
      : 'Loading';
  };

  const getPaymentProblemSubscriptions = () => {
    return data.data
      ? data.data.user.subscriptions
        .filter((subscription) =>
          subscription.status === 'paymentFailed').length
      : 'Loading';
  };

  const transformSubscriptionForTable = (data: GetUserDetailsQueryQueryResult) => {
    const subscriptions = data.data.user.subscriptions;

    return subscriptions.map((subscription) => {
      const { common } = subscription.metadata;

      return {
        status: (
          <Tag>{subscription.status}</Tag>
        ),

        amount: (subscription.amount / 100)
          .toLocaleString('en-US', { style: 'currency', currency: 'USD' }),

        commonName: (
          <Link to={`/commons/details/${common.id}`}>{common.name}</Link>
        ),

        actions: (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
            {(subscription.status === 'active' || subscription.status === 'paymentFailed') && (
              <Tooltip text="Cancel user's subscription">
                <Cancel/>
              </Tooltip>
            )}
          </div>
        ),

        started: (
          new Date(subscription.createdAt).toLocaleDateString()
        ),

        due: (
          new Date(subscription.dueDate).toLocaleDateString()
        ),

        card: 'notimplemented'
      };
    });
  };

  const transformProposalsForTable = (data: GetUserDetailsQueryQueryResult) => {
    const proposals = data.data.user.proposals;

    return proposals.map((proposal) => {
      return {
        icon: (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Tooltip text={proposal.id}>
              <Function/>
            </Tooltip>
          </div>
        ),

        type: proposal.type === 'fundingRequest' ? (
          <Tag type="success">Funding Request</Tag>
        ) : (
          <Tag type="warning">Join Request</Tag>
        ),

        status: proposal.state,

        paymentStatus: (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            {(proposal.paymentState === 'notAttempted' || proposal.paymentState === 'notRelevant') && (
              <Tooltip text="The payment is either not relevant for this proposal or was not attempted">
                <div style={{ cursor: 'default' }}>
                  {"-"}
                </div>
              </Tooltip>
            )}

            {proposal.paymentState === 'pending' && (
              <Tooltip text="The payment on this proposal is still pending">
                <Clock />
              </Tooltip>
            )}

            {proposal.paymentState === 'failed' && (
              <Tooltip text="The payment on this proposal is failed">
                <Cancel />
              </Tooltip>
            )}

            {proposal.paymentState === 'confirmed' && (
              <Tooltip text="The payment on this proposal was successful">
                <CheckCircle />
              </Tooltip>
            )}
          </div>
        ),

        actions: (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Tooltip text={'Go to proposal\'s details'} enterDelay={1000}>
              <Link to={`/proposals/details/${proposal.id}`} Icon={ExternalLink}/>
            </Tooltip>
          </div>
        )
      };
    });
  };

  return (
    <React.Fragment>
      {data.data && (
        <React.Fragment>
          <React.Fragment>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text h1>
                {data.data.user.firstName}'s details
              </Text>

              <div>
                <Image
                  src={data.data.user.photoURL}
                  width={100}
                  height={100}
                  style={{
                    borderRadius: '50%',
                    objectFit: 'cover',
                    height: 100,
                    width: 100
                  }}
                />
              </div>
            </div>
            <Breadcrumbs>
              <Breadcrumbs.Item>Home</Breadcrumbs.Item>
              <Breadcrumbs.Item>
                <Link to="/user">Users</Link>
              </Breadcrumbs.Item>
              <Breadcrumbs.Item>[{data.data.user.firstName} {data.data.user.lastName[0]}.]</Breadcrumbs.Item>
            </Breadcrumbs>

            <Spacer y={2}/>
          </React.Fragment>

          {/* --- Vitals --- */}
          <React.Fragment>
            <Text h3>Vitals</Text>

            <Grid.Container gap={2} alignItems="stretch" style={{ display: 'flex' }}>
              <Grid sm={24} md={8}>
                <Card hoverable>
                  <Text h1>
                    12
                  </Text>
                  <Text p>Member of commons</Text>
                </Card>
              </Grid>

              <Grid sm={24} md={8}>
                <Card hoverable>
                  <Text h1>
                    {getActiveSubscriptionCount()}
                  </Text>
                  <Text p>Active subscriptions</Text>
                </Card>
              </Grid>

              <Grid sm={24} md={8}>
                <Card hoverable>
                  <Text h1>
                    12
                  </Text>
                  <Text p>Open request</Text>
                </Card>
              </Grid>
            </Grid.Container>

            <Spacer y={2}/>
          </React.Fragment>

          {/* --- User Details --- */}
          <React.Fragment>
            <Text h3>User Details</Text>

            <Table data={[
              { item: 'Registered', value: new Date(data.data.user.createdAt).toLocaleString() },
              { item: 'User Identifier', value: data.data.user.id },
              { item: 'First Name', value: data.data.user.firstName },
              { item: 'Last Name', value: data.data.user.lastName },
              { item: 'Email', value: data.data.user.email }
            ]}>
              <Table.Column prop="item" label="Property" width={250}/>
              <Table.Column prop="value" label="Value"/>
            </Table>

            <Spacer y={2}/>
          </React.Fragment>

          {/* --- Subscriptions --- */}
          <React.Fragment>
            <Text h3>Subscriptions</Text>

            <Grid.Container gap={2} alignItems="stretch" style={{ display: 'flex', alignContent: 'stretch' }}>
              <Grid sm={24} md={8}>
                <Card hoverable style={{ height: '100%' }}>
                  <Text h1>
                    {data.data.user.subscriptions.length}
                  </Text>
                  <Text p>All time subscriptions</Text>
                </Card>
              </Grid>

              <Grid sm={24} md={8}>
                <Card hoverable style={{ height: '100%' }}>
                  <Text h1>
                    {getActiveSubscriptionCount()}
                  </Text>
                  <Text p>Active subscriptions</Text>
                </Card>
              </Grid>

              <Grid sm={24} md={8}>
                <Card hoverable style={{ height: '100%' }}>
                  <Text h1>
                    {getPaymentProblemSubscriptions()}
                  </Text>
                  <Text p>Subscriptions with payment problems</Text>
                </Card>
              </Grid>
            </Grid.Container>

            <Spacer y={1}/>

            <Table data={transformSubscriptionForTable(data)}>
              <Table.Column prop="commonName" label="Common Name"/>
              <Table.Column prop="started" label="Started on"/>
              <Table.Column prop="amount" label="Amount"/>
              <Table.Column prop="due" label="Due date"/>
              <Table.Column prop="card" label="Card"/>
              <Table.Column prop="status" label="Status" width={170}/>
              <Table.Column prop="actions">
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  Actions
                </div>
              </Table.Column>
            </Table>

            <Spacer y={2}/>
          </React.Fragment>

          {/* --- Proposals --- */}
          <React.Fragment>
            <Text h3>Proposals</Text>

            <Spacer y={1}/>

            <Table data={transformProposalsForTable(data)}>
              <Table.Column prop="icon" label="" width={70}/>
              <Table.Column prop="type" label="Type" />

              <Table.Column prop="status" label="Status" />
              <Table.Column prop="paymentStatus" label="Payment Status" width={130} />

              <Table.Column prop="actions">
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  Actions
                </div>
              </Table.Column>
            </Table>

            {/* @todo Pagination */}

            <Spacer y={2}/>
          </React.Fragment>

          {/* --- Commons --- */}
          {/* --- @todo --- */}
        </React.Fragment>
      )}

    </React.Fragment>
  );
};

export default UserDetailsPage;