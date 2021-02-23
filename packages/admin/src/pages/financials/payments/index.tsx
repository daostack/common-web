import React from 'react';
import { NextPage } from 'next';

import { gql } from '@apollo/client';
import { Breadcrumbs, Card, Col, Note, Row, Spacer, Table, Tag, Text, useTheme } from '@geist-ui/react';

import { withPermission } from '../../../helpers/hoc/withPermission';
import { useGetPaymentsHomeScreenDataQuery } from '@graphql';
import { Link } from '@components/Link';
import { Centered } from '@components/Centered';
import { CheckCircle, ChevronLeftCircle, ChevronRightCircle, Clock, DollarSign, XCircle } from '@geist-ui/react-icons';
import { FullWidthLoader } from '@components/FullWidthLoader';
import { PaymentDetailsModal } from '@components/modals/PaymentDetailsModal';
import { useRouter } from 'next/router';

const GetPaymentsHomepageData = gql`
  query GetPaymentsHomeScreenData($page: Int = 1) {
    hangingPayments: payments(hanging: true) {
      id

      createdAt
      updatedAt

      status
    }

    payments: payments(page: $page) {
      id

      proposalId
      subscriptionId

      type
      status

      user {
        id

        firstName
        lastName
      }

      amount {
        amount
        currency
      }
    }
  }
`;

export const PaymentsHomepage: NextPage = () => {
  const router = useRouter();
  const theme = useTheme();

  // --- State
  const [page, setPage] = React.useState<number>(1);
  const [selectedPayment, setSelectedPayment] = React.useState<string>();


  // --- Data fetching
  const { data: payments, previousData } = useGetPaymentsHomeScreenDataQuery({
    variables: {
      page
    }
  });

  // --- Actions
  const onNextPage = () => {
    setPage((currentPage) => {
      if (payments.payments.length === 10) {
        return currentPage + 1;
      }

      return currentPage;
    });
  };

  const onPreviousPage = () => {
    setPage((currentPage) => {
      if (currentPage > 1) {
        return currentPage - 1;
      }

      return currentPage;
    });
  };

  const onPaymentDetailsOpen = (paymentId: string) => {
    setSelectedPayment(paymentId);
  };

  const onPaymentDetailsClose = () => {
    setSelectedPayment(null);
  };

  const onRow = (row: { id: string }) => {
    router.push(`/financials/payments/details/${row.id}`);
  }

  // --- Transformers
  const transformPaymentsForTable = () => {
    if (!payments) {
      return Array(10).fill({
        icon: FullWidthLoader,
        amount: FullWidthLoader,
        type: FullWidthLoader,
        user: FullWidthLoader,
        status: FullWidthLoader
      });
    }

    return payments.payments.map((p) => {
      const { amount, type, status, user } = p;


      return {
        id: p.id,

        icon: (
          <Centered>
            <DollarSign/>
          </Centered>
        ),

        amount: (
          <Text>
            {amount.amount / 100} {amount.currency}
          </Text>
        ),

        type: (
          <Tag type={type === 'oneTime' ? 'warning' : 'success'}>
            {type === 'oneTime'
              ? 'One Time'
              : 'Subscription'}
          </Tag>
        ),

        user: (
          <Link to={`/users/details/${user.id}`}>
            {user.firstName} {user.lastName}
          </Link>
        ),

        status: (
          <React.Fragment>
            {status === 'pending' && (
              <Text type="warning" style={{ margin: 0, display: 'flex', alignContent: 'center' }}>
                <Clock/> <Spacer x={0.2}/> Pending
              </Text>
            )}

            {status === 'failed' && (
              <Text type="error" style={{ margin: 0, display: 'flex', alignContent: 'center' }}>
                <XCircle/> <Spacer x={0.2}/> Failed
              </Text>
            )}

            {(status === 'paid' || status === 'confirmed') && (
              // <Tooltip text={status}>
              <Text type="success" style={{ margin: 0, display: 'flex', alignContent: 'center' }}>
                <CheckCircle/> <Spacer x={0.2}/> Successful
              </Text>
              // </Tooltip>
            )}
          </React.Fragment>
        )
      };
    });
  };

  return (
    <React.Fragment>
      <Text h1>Payments</Text>
      <Breadcrumbs>
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Link to="/financials">Financials</Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Link to="/financials/payments">Payments</Link>
        </Breadcrumbs.Item>
      </Breadcrumbs>

      <Spacer y={2}/>

      {selectedPayment && (
        <PaymentDetailsModal
          open={!!selectedPayment}
          paymentId={selectedPayment}
          onClose={onPaymentDetailsClose}
        />
      )}

      <React.Fragment>
        {(!!payments?.hangingPayments?.length || !!previousData?.hangingPayments?.length) && (
          <React.Fragment>
            <Note type="error">There are hanging payments. Please, take a look!</Note>

            <Spacer/>

            <Text h3>Hanging payments ({(payments?.hangingPayments || previousData?.hangingPayments).length})</Text>

            {(payments?.hangingPayments || previousData?.hangingPayments).map((payment) => (
              <React.Fragment key={payment.id}>
                <Card>
                  <Text h5>Payment #{payment.id}</Text>
                </Card>

                <Spacer/>
              </React.Fragment>
            ))}
          </React.Fragment>
        )}


        <Text h3>Payments</Text>
        <Table data={transformPaymentsForTable()} onRow={onRow}>
          <Table.Column width={70} prop="icon"/>

          <Table.Column prop="amount" label="Payment amount" width={150}/>
          <Table.Column prop="user" label="User"/>
          <Table.Column prop="type" label="Payment type"/>
          <Table.Column prop="status" label="Payment status"/>
        </Table>

        <Spacer/>

        <Card style={{ backgroundColor: theme.palette.accents_1, padding: 10 }}>
          <Card.Content style={{ padding: 0 }}>
            <Row style={{ padding: 0 }}>
              <Col span={2} />
              <Col span={6}>
                <Text small style={{ margin: 0 }}>Payment Amount</Text>
              </Col>

              <Col span={6}>
                <Text small style={{ margin: 0 }}>User</Text>
              </Col>

              <Col span={6}>
                <Text small style={{ margin: 0 }}>Payment Type</Text>
              </Col>
            </Row>
          </Card.Content>
        </Card>

        <div style={{ margin: '2rem 0' }}>
          {payments?.payments?.map((p) => {
            return (
              <div key={p.id}>
                <Row style={{ padding: 0 }}>
                  <Col span={2} />
                  <Col span={6}>
                    <Text small style={{ margin: 0 }}>Payment Amount</Text>
                  </Col>

                  <Col span={6}>
                    <Text small style={{ margin: 0 }}>User</Text>
                  </Col>

                  <Col span={6}>
                    <Text small style={{ margin: 0 }}>Payment Type</Text>
                  </Col>
                </Row>
              </div>
            )
          })}
        </div>

        <Centered>
          <div style={{ display: 'flex', alignContent: 'center' }}>
            <div style={{ cursor: page > 1 ? 'pointer' : 'not-allowed' }} onClick={onPreviousPage}>
              <ChevronLeftCircle/>
            </div>

            <Spacer x={0.8}/>

            <Text b>Page {page}</Text>

            <Spacer x={0.8}/>

            <div style={{ cursor: payments?.payments.length === 10 ? 'pointer' : 'not-allowed' }} onClick={onNextPage}>
              <ChevronRightCircle/>
            </div>
          </div>
        </Centered>
      </React.Fragment>
    </React.Fragment>
  );
};

export default withPermission('admin.payments.*', {
  redirect: true
})(PaymentsHomepage);