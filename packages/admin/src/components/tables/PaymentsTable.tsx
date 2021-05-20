import React from 'react';

import { Centered } from '@components/Centered';
import { Card, Row, Col, Text, Spacer, Tag, User, Divider, useTheme } from '@geist-ui/react';
import { ChevronLeftCircle, ChevronRightCircle, ChevronDownCircle, ChevronUpCircle } from '@geist-ui/react-icons';
import { gql } from '@apollo/client';
import { useGetPaymentsQuery } from '@core/graphql';


export const PaymentsTableQuery = gql`
  query GetPayments($paginate: PaginateInput) {
    payments(paginate: $paginate) {
      id

      type
      status

      amount

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


  // const [getPayment, { data: payment, loading: paymentLoading }] = useGetPaymentDetailsLazyQuery();
  const { data: payments } = useGetPaymentsQuery({
    variables: {
      page
    }
  });

  // Effects
  React.useEffect(() => {
    if (selectedPayment) {
      // getPayment({
      //   variables: {
      //     paymentId: selectedPayment
      //   }
      // });
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