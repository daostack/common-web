import React from 'react';

import { gql } from '@apollo/client';
import { Card, Row, Col, Text, Spacer, Tag, User, Divider, useTheme } from '@geist-ui/react';
import { ChevronLeftCircle, ChevronRightCircle, ChevronDownCircle, ChevronUpCircle } from '@geist-ui/react-icons';

import { Centered } from '@components/Centered';
import { useGetPaymentsQuery } from '@core/graphql';
import { Link } from '@components/Link';
import Skeleton from 'react-loading-skeleton';


export const PaymentsTableQuery = gql`
  query GetPayments($paginate: PaginateInput) {
    payments(paginate: $paginate) {
      id

      type
      status

      amount

      type

      commonId

      fees

      user {
        id

        firstName
        lastName

        photo

        email
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


  const { data: payments } = useGetPaymentsQuery({
    variables: {
      paginate: {
        take: 10,
        skip: (page - 1) * 10
      }
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
        {(!payments?.payments) && (new Array(10).fill(null)).map(() => (
          <Skeleton height="5rem" style={{ margin: '.25rem 0' }}/>
        ))}

        {payments?.payments?.map((p) => {
          return (
            <Card key={p.id} style={{ margin: '.5rem 0' }}>
              <Card.Content>
                <Row style={{ padding: 0 }}>
                  <Col span={3}>
                    <Centered vertical>
                      <Text b>
                        {(p.amount / 100).toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        })}
                      </Text>
                    </Centered>
                  </Col>

                  <Col span={4}>
                    <Centered vertical>
                      {p.status === 'Pending' && (
                        <Tag type="warning" invert>
                          Pending
                        </Tag>
                      )}

                      {(p.status === 'Successful') && (
                        <Tag type="success" invert>
                          Successful
                        </Tag>
                      )}

                      {(p.status === 'Unsuccessful') && (
                        <Tag type="error" invert>
                          Failed
                        </Tag>
                      )}
                    </Centered>
                  </Col>

                  <Col span={6}>
                    <User
                      src={p.user.photo}
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
                      <React.Fragment>
                        <Col span={12}>
                          <Text h4 style={{ margin: 0 }}>Billing Plan</Text>
                          <Text
                            h2
                            style={{ margin: 0 }}
                          >
                            {p.type === 'OneTimePayment' ? 'One Time' : 'Subscription'} Payment
                          </Text>

                          <Text style={{ margin: 0 }}>
                            For {p.type === 'OneTimePayment' ? 'joining' : 'participating in'}{' '}

                            <Link to={`/commons/details/${p.commonId}`}>
                              Common
                            </Link>
                          </Text>

                          <div style={{ display: 'flex', marginTop: 15 }}>
                            <div>
                              <Text h6>Fees</Text>
                              <Text h4>
                                {(p.fees / 100).toLocaleString('en-US', {
                                  style: 'currency',
                                  currency: 'USD'
                                })}
                              </Text>
                            </div>

                            <Spacer x={1}/>

                            <div>
                              <Text h6>Money left</Text>
                              <Text h4>
                                {((p.amount - p.fees) / 100).toLocaleString('en-US', {
                                  style: 'currency',
                                  currency: 'USD'
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
                                  {(p.amount / 100).toLocaleString('en-US', {
                                    style: 'currency',
                                    currency: 'USD'
                                  })}
                                </Text>
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </React.Fragment>
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
  );
};