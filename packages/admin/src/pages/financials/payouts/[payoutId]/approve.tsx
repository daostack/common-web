import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { gql } from '@apollo/client';
import { Breadcrumbs, Spacer, Text, Button, useToasts, Table } from '@geist-ui/react';

import { Link } from '@components/Link';
import { FullWidthLoader } from '@components/FullWidthLoader';
import { useGetApprovePayoutDataQuery, useApprovePayoutMutation, PayoutApproverResponse } from '@core/graphql';

const ApprovePayoutData = gql`
  query GetApprovePayoutData($payoutId: ID!) {
    payout(id: $payoutId) {
      amount
      description

      wire {
        description
      }

      proposals {
        title
        description

        user {
          firstName
          lastName
        }

        funding {
          amount
          fundingState
        }
      }
    }
  }

  mutation ApprovePayout($payoutId: ID!, $outcome: PayoutApproverResponse!) {
    approvePayout(payoutId: $payoutId, outcome: $outcome) {
      id
    }
  }
`;

const ApprovePayoutPage: NextPage = () => {
  const router = useRouter();
  const [, setToast] = useToasts();

  const [approve, { loading: approving }] = useApprovePayoutMutation();
  const { data } = useGetApprovePayoutDataQuery({
    variables: {
      payoutId: router.query.payoutId as string
    }
  });

  // Actions
  const onClick = (outcome: PayoutApproverResponse) => {
    return async () => {
      await approve({
        variables: {
          payoutId: router.query.payoutId as string,
          outcome
        }
      });

      setToast({
        text: `Successfully ${outcome} proposal`
      });

      await router.back();
    };
  };

  const getTableData = () => {
    return [{
      prop: 'Description',
      data: data ? (
        data.payout.description
      ) : (
        FullWidthLoader
      )
    }, {
      prop: 'Total Amount',
      data: data ? (
        `${data.payout.amount / 100} USD`
      ) : (
        FullWidthLoader
      )
    }, {
      prop: 'Wire',
      data: data ? (
        data.payout.wire.description
      ) : (
        FullWidthLoader
      )
    }, {
      prop: 'Description',
      data: data ? (
        data.payout.description
      ) : (
        FullWidthLoader
      )
    }];
  };

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%'
      }}
    >
      {/* --- Header --- */}
      <React.Fragment>
        <Text h1 style={{ display: 'flex', alignItems: 'center' }}>Approve Payout</Text>
        <Breadcrumbs>
          <Breadcrumbs.Item>Home</Breadcrumbs.Item>

          <Breadcrumbs.Item>
            <Link to="/financials">Financials</Link>
          </Breadcrumbs.Item>

          <Breadcrumbs.Item>
            <Link to="/financials/payouts">Payouts</Link>
          </Breadcrumbs.Item>

          <Breadcrumbs.Item>
            Approve
          </Breadcrumbs.Item>

          <Breadcrumbs.Item>
            [{router.query.payoutId}]
          </Breadcrumbs.Item>
        </Breadcrumbs>

        <Spacer y={2}/>
      </React.Fragment>

      <Table data={getTableData()}>
        <Table.Column width={150} prop="prop" label="What?"/>
        <Table.Column prop="data" label="Value"/>
      </Table>

      <Spacer/>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end'
        }}
      >
        <Button
          ghost
          type="error"
          onClick={onClick(PayoutApproverResponse.Declined)}
          style={{
            marginRight: '1rem'
          }}
        >
          Reject
        </Button>

        <Button
          ghost
          type="success"
          onClick={onClick(PayoutApproverResponse.Approved)}
        >
          Approve
        </Button>
      </div>

      {/*<div*/}
      {/*  style={{*/}
      {/*    width: '100vw',*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <img*/}
      {/*    src="/assets/img/approve.png"*/}
      {/*    alt="Approve"*/}
      {/*    style={{*/}
      {/*      maxHeight: '40vh',*/}
      {/*      display: 'block',*/}
      {/*      position: 'relative',*/}
      {/*      bottom: 0,*/}
      {/*      right: 0*/}
      {/*    }}*/}
      {/*  />*/}
      {/*</div>*/}
    </div>
  );
};

export default ApprovePayoutPage;