import { NextPage } from 'next';
import { withPermission } from '../../../../helpers/hoc/withPermission';
import { Link } from '@components/Link';
import React from 'react';
import { Breadcrumbs, Card, Grid, Spacer, Text, useToasts } from '@geist-ui/react';
import { useRouter } from 'next/router';
import { gql } from '@apollo/client';

const PayoutDetailsData = gql`
  query GetPayoutDetails($payoutId: ID!) {
    payout(id: $payoutId) {
      status

      proposals {
        id

        funding {
          amount
        }

        title
        description
      }

    }
  }
`;

const PayoutDetailsPage: NextPage = () => {
  const router = useRouter();

  const [toasts, setToast] = useToasts();

  const data = useGetPayoutDetailsQuery({
    variables: {
      payoutId: router.query.payoutId as string
    }
  });


  React.useEffect(() => {
    if (data.previousData) {
      if (data.data.payout.executed && !data.previousData.payout.executed) {
        setToast({
          text: 'The payout was executed',
          delay: 5000
        });
      }
    }
  }, [data]);

  return (
    <React.Fragment>
      {/* --- Header --- */}
      <React.Fragment>
        <Text h1 style={{ display: 'flex', alignItems: 'center' }}>Payout Details</Text>
        <Breadcrumbs>
          <Breadcrumbs.Item>Home</Breadcrumbs.Item>

          <Breadcrumbs.Item>
            <Link to="/financials">Financials</Link>
          </Breadcrumbs.Item>

          <Breadcrumbs.Item>
            <Link to="/financials/payouts">Payouts</Link>
          </Breadcrumbs.Item>

          <Breadcrumbs.Item>
            Details
          </Breadcrumbs.Item>

          <Breadcrumbs.Item>
            [{router.query.payoutId}]
          </Breadcrumbs.Item>
        </Breadcrumbs>

        <Spacer y={2}/>
      </React.Fragment>

      {data.data && (
        <React.Fragment>
          <Grid.Container gap={1}>
            {/*{data.data.payout.security.map((security) => (*/}
            {/*  <Grid xs={24} md={6}>*/}
            {/*    <Card hoverable>*/}
            {/*      <Text h5>Security {security.id}</Text>*/}

            {/*      <Divider/>*/}

            {/*      <Text h5>Claimed: {security.redeemed ? 'Yes' : 'No'}</Text>*/}
            {/*      <Text h5>Claim Attempts: {security.redemptionAttempts}</Text>*/}
            {/*    </Card>*/}
            {/*  </Grid>*/}
            {/*))}*/}
          </Grid.Container>

          <Spacer y={2}/>

          <Text h4>Proposals, part of this payout</Text>

          {data.data.payout.proposals.map((proposal) => (
            <Card key={proposal.id} style={{ margin: '20px 0' }}>
              <Grid.Container>
                <Grid xs={20}>
                  <Text h3 style={{ marginBottom: 0 }}>{proposal.title}</Text>
                  <Text b>
                    {(proposal.funding.amount / 100).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    })}
                  </Text>
                </Grid>
              </Grid.Container>


              <Text p>{proposal.description}</Text>
            </Card>
          ))}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default withPermission('admin.financials.payouts.read', {
  redirect: true
})(PayoutDetailsPage);