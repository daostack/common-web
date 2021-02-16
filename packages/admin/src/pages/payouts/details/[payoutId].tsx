import { NextPage } from 'next';
import { withPermission } from '../../../helpers/hoc/withPermission';
import { Link } from '@components/Link';
import React from 'react';
import { Breadcrumbs, Card, Divider, Grid, Spacer, Text, Tag, useToasts } from '@geist-ui/react';
import { useRouter } from 'next/router';
import { gql } from '@apollo/client';
import { useGetPayoutDetailsQuery } from '@graphql';

const PayoutDetailsData = gql`
  query GetPayoutDetails($payoutId: ID!) {
    payout(id: $payoutId) {
      voided
      executed

      status

      proposals {
        id
        
        fundingRequest {
          amount
        }
        
        description {
          title
          description
        }
      }

      security {
        id
        redeemed
        redemptionAttempts
      }
    }
  }
`;

const PayoutDetailsPage: NextPage = () => {
  const router = useRouter();

  const [toasts, setToast] = useToasts();

  const data = useGetPayoutDetailsQuery({
    pollInterval: 5 * 1000,
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
        <Text h1 style={{ display: 'flex', alignItems: 'center' }}>Payout Details {data.data && (
          <Tag style={{ marginLeft: 15 }}>
            {data.data.payout.executed
              ? data.data.payout.status
              : data.data.payout.voided
                ? 'Voided'
                : 'Pending Approval'
            }
          </Tag>
        )}</Text>
        <Breadcrumbs>
          <Breadcrumbs.Item>Home</Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <Link to="/payouts">Payouts</Link>
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
            {data.data.payout.security.map((security) => (
              <Grid xs={24} md={6}>
                <Card hoverable>
                  <Text h5>Security {security.id}</Text>

                  <Divider/>

                  <Text h5>Claimed: {security.redeemed ? 'Yes' : 'No'}</Text>
                  <Text h5>Claim Attempts: {security.redemptionAttempts}</Text>
                </Card>
              </Grid>
            ))}
          </Grid.Container>

          <Spacer y={2} />

          <Text h4>Proposals, part of this payout</Text>

          {data.data.payout.proposals.map((proposal) => (
            <Card key={proposal.id} style={{ margin: '20px 0' }}>
              <Grid.Container>
                <Grid xs={20}>
                  <Text h3 style={{ marginBottom: 0 }}>{proposal.description.title}</Text>
                  <Text b>
                    {(proposal.fundingRequest.amount / 100).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    })}
                  </Text>
                </Grid>
              </Grid.Container>


              <Text p>{proposal.description.description}</Text>
            </Card>
          ))}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default withPermission('admin.payouts.read.details', {
  redirect: true
})(PayoutDetailsPage);