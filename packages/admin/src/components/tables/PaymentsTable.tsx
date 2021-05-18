import React from 'react';

import { Centered } from '@components/Centered';
import { Link } from '@components/Link';
import { Card, Row, Col, Text, Spacer, Tag, User, Divider, useTheme } from '@geist-ui/react';
import { ChevronLeftCircle, ChevronRightCircle, ChevronDownCircle, ChevronUpCircle } from '@geist-ui/react-icons';
import { gql } from '@apollo/client';
import { useGetPaymentDetailsLazyQuery, useGetPaymentsQuery } from '@core/graphql';


export const PaymentsTableQuery = gql`
  query GetPayments($page: Int = 1) {
    payments(page: $page) {
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

interface IPaymentTableProps {
  hideNavigation?: boolean;
}

export const PaymentsTable: React.FC<IPaymentTableProps> = ({ hideNavigation }) => {
  const theme = useTheme();

  // --- State
  const [page, setPage] = React.useState<number>(1);
  const [selectedPayment, setSelectedPayment] = React.useState<string>();


  const [getPayment, { data: payment, loading: paymentLoading }] = useGetPaymentDetailsLazyQuery();
  const { data: payments } = useGetPaymentsQuery({
    variables: {
      page
    }
  });

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


  return (
    <React.Fragment>
      <Card style={{ backgroundColor: theme.palette.accents_1, padding: 10 }}>
        <Card.Content style={{ paddingTop: 0, paddingBottom: 0 }}>
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

      <div style={{ margin: '1rem 0' }}>
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
                  <Divider y={0}/>

                  <Card.Content>
                    <Row>
                      {paymentLoading && (
                        <div/>
                      )}

                      {payment && (
                        <React.Fragment>
                          <Col span={12}>
                            <Text h4 style={{ margin: 0 }}>Billing Plan</Text>
                            <Text
                              h2
                              style={{ margin: 0 }}
                            >
                              {payment.payment.type === 'oneTime' ? 'One Time' : 'Subscription'} Payment
                            </Text>

                            <Text style={{ margin: 0 }}>
                              For {payment.payment.type === 'oneTime' ? 'joining' : 'participating in'}{' '}

                              <Link to={`/commons/details/${payment.payment.common.id}`}>
                                {payment.payment.common.name}
                              </Link>
                            </Text>

                            <div style={{ display: 'flex', marginTop: 15 }}>
                              <div>
                                <Text h6>Fees</Text>
                                <Text h4>
                                  {(payment.payment.fees.amount / 100).toLocaleString('en-US', {
                                    style: 'currency',
                                    currency: payment.payment.fees.currency
                                  })}
                                </Text>
                              </div>

                              <Spacer x={1}/>

                              <div>
                                <Text h6>Money left</Text>
                                <Text h4>
                                  {((payment.payment.amount.amount - payment.payment.fees.amount) / 100).toLocaleString('en-US', {
                                    style: 'currency',
                                    currency: payment.payment.fees.currency
                                  })}
                                </Text>
                              </div>
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

      {!hideNavigation && (
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
      )}

    </React.Fragment>
  )
}