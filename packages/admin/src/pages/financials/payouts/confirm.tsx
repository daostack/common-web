import { gql } from '@apollo/client';
import { useRouter } from 'next/router';
import { useGetConfirmPayoutDataLazyQuery, useApprovePayoutMutation } from '@graphql';
import React from 'react';
import { Link } from '@components/Link';
import { Breadcrumbs, Button, Spacer, Text, useToasts } from '@geist-ui/react';
import Skeleton from 'react-loading-skeleton';

const ConfirmPayoutPageData = gql`
  query GetConfirmPayoutData($payoutId: ID!) {
    payout(id: $payoutId) {
      amount

      proposals {
        id
        
        description {
          title
          description
        }

        fundingRequest {
          amount
        }
      }
    }
  }
`;

const ApprovePayout = gql`
  mutation ApprovePayout($payoutId: ID!, $token: String!, $index: Int!) {
    approvePayout(
      payoutId: $payoutId,
      token: $token,
      index: $index
    )
  }
`;

const ConfirmPayoutPage = () => {
  const router = useRouter();

  const [toasts, setToast] = useToasts();
  const [loadData, { data }] = useGetConfirmPayoutDataLazyQuery();
  const [approvePayout, { data: approvePayoutResult, loading: approveLoading }] = useApprovePayoutMutation();

  React.useEffect(() => {
    if (router.query.payoutId) {
      loadData({
        variables: {
          payoutId: router.query.payoutId as string
        }
      });
    }
  }, [router.query.payoutId]);

  const onPayoutApprove = async () => {
    const { payoutId, index, token } = router.query;

    if (
      typeof payoutId === 'undefined' ||
      typeof index === 'undefined' ||
      typeof token === 'undefined'
    ) {
      setToast({
        text: 'Invalid approve payout request! There is missing data',
        type: 'error'
      });

      return;
    }

    const res = await approvePayout({
      variables: {
        payoutId: payoutId as string,
        token: token as string,
        index: Number(index)
      }
    });

    if (res) {
      setToast({
        text: 'Successfully approved payout'
      });
    }

    router.push(`/financials/payouts/details/${payoutId}`);
  };


  return (
    <React.Fragment>
      <Text h1>Confirm Payout</Text>

      <Breadcrumbs>
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>

        <Breadcrumbs.Item>
          <Link to="/financials">Financials</Link>
        </Breadcrumbs.Item>

        <Breadcrumbs.Item>
          <Link to="/financials/payouts">Payouts</Link>
        </Breadcrumbs.Item>

        <Breadcrumbs.Item>
          Confirm
        </Breadcrumbs.Item>

        <Breadcrumbs.Item>
          [{router.query.payoutId}]
        </Breadcrumbs.Item>
      </Breadcrumbs>

      <Text>In Total: {!data
        ? <Skeleton/>
        : (data.payout.amount / 100).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        })}
      </Text>

      <Text h4>Proposals in this payout:</Text>

      {data && (
        <React.Fragment>
          {data.payout.proposals.map((p, i) => (
            <Link to={`/proposals/details/${p.id}`} key={i}>
              <Text>{i + 1}. {p.description.title}: {(p.fundingRequest.amount / 100).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
              })}</Text>
            </Link>
          ))}
        </React.Fragment>
      )}

      <Text h4>
        Actions
      </Text>

      <Button
        ghost
        // onClick={onPayoutApprove}
        loading={approveLoading}
        type="error"
      >
        Void payout
      </Button>

      <Button
        style={{
          marginLeft: '1rem'
        }}

        ghost
        onClick={onPayoutApprove}
        loading={approveLoading}
        type="success"
      >
        Approve payout
      </Button>
    </React.Fragment>
  );
};

export default ConfirmPayoutPage;