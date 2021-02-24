import React from 'react';
import { NextPage } from 'next';

import { gql } from '@apollo/client';
import { Breadcrumbs, Card, Col, Divider, Note, Row, Spacer, Tag, Text, User, useTheme } from '@geist-ui/react';

import { withPermission } from '../../../helpers/hoc/withPermission';
import { useGetPaymentsHomeScreenDataQuery, useGetPaymentDetailsLazyQuery } from '@graphql';
import { Link } from '@components/Link';
import { Centered } from '@components/Centered';
import {
  CheckCircle,
  ChevronDownCircle,
  ChevronLeftCircle,
  ChevronRightCircle,
  ChevronUpCircle,
  Clock,
  DollarSign,
  XCircle
} from '@geist-ui/react-icons';
import { FullWidthLoader } from '@components/FullWidthLoader';
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

            type
            status

            user {
                id

                firstName
                lastName

                photoURL

                email
            }

            amount {
                amount
                currency
            }
        }
    }
`;

const GetPaymentDetailsQuery = gql`
    query GetPaymentDetails($paymentId: ID!) {
        payment(id: $paymentId) {
            type

            common {
                id

                name
            }

            amount {
                amount
                currency
            }

            fees {
                amount
                currency
            }

            card {
                id

                metadata {
                    digits
                    network
                }
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

  const [getPayment, { data: payment, loading: paymentLoading }] = useGetPaymentDetailsLazyQuery();

  // Effects
  React.useEffect(() => {
    if (selectedPayment) {
      getPayment({
        variables: {
          paymentId: selectedPayment
        }
      });
    }
  }, [selectedPayment]);


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

  const toggleSelectedPayment = (paymentId: string): () => void => {
    return () => {
      setSelectedPayment((currentPayment) => {
        if (paymentId !== currentPayment) {
          return paymentId;
        }
      });
    };
  };

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
        {/*<Table data={transformPaymentsForTable()} onRow={onRow}>*/}
        {/*  <Table.Column width={70} prop="icon"/>*/}

        {/*  <Table.Column prop="amount" label="Payment amount" width={150}/>*/}
        {/*  <Table.Column prop="user" label="User"/>*/}
        {/*  <Table.Column prop="type" label="Payment type"/>*/}
        {/*  <Table.Column prop="status" label="Payment status"/>*/}
        {/*</Table>*/}

        <Spacer/>

        <Card style={{ backgroundColor: theme.palette.accents_1, padding: 10 }}>
          <Card.Content style={{ padding: 0 }}>
            <Row style={{ padding: 0 }}>
              <Col span={3}>
                <Text small style={{ margin: 0 }}>Amount</Text>
              </Col>

              <Col span={4}>
                <Text small style={{ margin: 0 }}>Status</Text>
              </Col>


              <Col span={6}>
                <Text small style={{ margin: 0 }}>User</Text>
              </Col>
            </Row>
          </Card.Content>
        </Card>

        <div style={{ margin: '2rem 0' }}>
          {payments?.payments?.map((p) => {
            return (
              <Card key={p.id} style={{ margin: '.5rem 0' }}>
                <Card.Content>
                  <Row style={{ padding: 0 }}>
                    <Col span={3}>
                      <Centered vertical>
                        <Text b>
                          {(p.amount.amount / 100).toLocaleString('en-US', {
                            style: 'currency',
                            currency: p.amount.currency
                          })}
                        </Text>
                      </Centered>
                    </Col>

                    <Col span={4}>
                      <Centered vertical>
                        {p.status === 'pending' && (
                          <Tag type="warning" invert>
                            Pending
                          </Tag>
                        )}

                        {(p.status === 'confirmed' || p.status === 'paid') && (
                          <Tag type="success" invert>
                            Successful
                          </Tag>
                        )}

                        {(p.status === 'failed') && (
                          <Tag type="error" invert>
                            Failed
                          </Tag>
                        )}
                      </Centered>
                    </Col>

                    <Col span={6}>
                      <User
                        src={p.user.photoURL}
                        name={`${p.user.firstName} ${p.user.lastName}`}
                      >
                        <User.Link href={`mailto:${p.user.email}`}>{p.user.email}</User.Link>
                      </User>
                    </Col>

                    <Col span={8}/>

                    <Col span={3}>
                      <Centered vertical>
                        <div style={{ cursor: 'pointer' }} onClick={toggleSelectedPayment(p.id)}>
                          {selectedPayment !== p.id ? (
                            <ChevronDownCircle/>
                          ) : (
                            <ChevronUpCircle/>
                          )}
                        </div>
                      </Centered>
                    </Col>
                  </Row>
                </Card.Content>

                {selectedPayment === p.id && (
                  <React.Fragment>
                    <Divider/>

                    <Card.Content>
                      <Row>
                        {paymentLoading && (
                          <div/>
                        )}

                        {payment && (
                          <React.Fragment>
                            <Col span={12}>
                              <Text h4 style={{ margin: 0 }}>Billing Plan</Text>
                              <Text h2
                                    style={{ margin: 0 }}>{payment.payment.type === 'oneTime' ? 'One Time' : 'Subscription'} Payment</Text>

                              <Text style={{ margin: 0 }}>
                                For {payment.payment.type === 'oneTime' ? 'joining' : 'participating in'}{' '}
                                <Link to={`/commons/details/${payment.payment.common.id}`}>{payment.payment.common.name}</Link>
                              </Text>

                              <div style={{ marginTop: 15 }}>
                                <Row>
                                  <Col span={12}>
                                    <Text h6>Fees</Text>
                                    <Text h4>
                                      {(payment.payment.fees.amount / 100).toLocaleString('en-US', {
                                        style: 'currency',
                                        currency: payment.payment.fees.currency
                                      })}
                                    </Text>
                                  </Col>

                                  <Col span={12}>
                                    <Text h6>Money left</Text>
                                    <Text h4>
                                      {((payment.payment.amount.amount - payment.payment.fees.amount) / 100).toLocaleString('en-US', {
                                        style: 'currency',
                                        currency: payment.payment.fees.currency
                                      })}
                                    </Text>
                                  </Col>
                                </Row>
                              </div>
                            </Col>

                            <Col span={12}>
                              <Row>
                                <Col span={16}>
                                  {/*<Row>*/}
                                  {/*  <Col span={24}>*/}
                                  {/*    <Text h6>Payment Instrument</Text>*/}
                                  {/*    <Text h4>{payment.payment.card.metadata.network} {payment.payment.card.metadata.digits}</Text>*/}
                                  {/*  </Col>*/}
                                  {/*</Row>*/}
                                </Col>

                                <Col span={8}>
                                  <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'flex-end' }}>
                                    <Text h4>Amount due</Text>
                                    <Text h2>
                                      {(payment.payment.amount.amount / 100).toLocaleString('en-US', {
                                        style: 'currency',
                                        currency: payment.payment.amount.currency
                                      })}
                                    </Text>
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                          </React.Fragment>
                        )}
                      </Row>
                    </Card.Content>
                  </React.Fragment>
                )}
              </Card>
            );
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