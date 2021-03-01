import { NextPage } from 'next';
import React from 'react';
import { Link } from '@components/Link';
import { Breadcrumbs, Card, Grid, Note, Spacer, Text } from '@geist-ui/react';
import { gql } from '@apollo/client';
import { useGetFinancialsDataQuery } from '@graphql';
import { Centered } from '@components/Centered';
import { ExternalLink } from '@geist-ui/react-icons';

const GetFinancialsData = gql`
  query GetFinancialsData {
    balance {
      available {
        amount
        currency
      }

      unsettled {
        amount
        currency
      }
    }

    hangingPayments: payments(hanging: true) {
      id

      createdAt
      updatedAt

      status
    }
  }
`;

const FinancialsHomePage: NextPage = () => {
  const { data } = useGetFinancialsDataQuery();

  return (
    <React.Fragment>
      {/* --- Header --- */}
      <React.Fragment>
        <Text h1>Financials</Text>

        <Breadcrumbs>
          <Breadcrumbs.Item>Home</Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <Link to="/financials">Financials</Link>
          </Breadcrumbs.Item>
        </Breadcrumbs>

        <Spacer y={2}/>
      </React.Fragment>


      {data && (
        <React.Fragment>
          <React.Fragment>
            <Text h3>Current circle balances</Text>

            <Grid.Container gap={2} alignItems="stretch" style={{ display: 'flex' }}>
              <Grid sm={24} md={12}>
                <Card hoverable>
                  <Text h1>
                    {data.balance.available.amount} {data.balance.available.currency}
                  </Text>
                  <Text p>Available funds</Text>
                </Card>
              </Grid>

              <Grid sm={24} md={12}>
                <Card hoverable>
                  <Text h1>
                    {data.balance.unsettled?.amount || '0.00'} {data.balance.unsettled?.currency || 'USD'}
                  </Text>
                  <Text p>Unsettled funds</Text>
                </Card>
              </Grid>
            </Grid.Container>

            <Spacer y={2}/>
          </React.Fragment>

          {(!!data?.hangingPayments?.length) && (
            <React.Fragment>
              <Note type="error">There are hanging payments. Please, take a look!</Note>

              <Spacer/>

              <Text h3 style={{ display: 'flex', alignItems: 'center' }}>
                Hanging payments ({(data?.hangingPayments).length})

                  <Link to={'/financials/payment'}>
                    <ExternalLink style={{ paddingLeft: 10 }}/>
                  </Link>
              </Text>


              {(data?.hangingPayments).map((payment) => (
                <React.Fragment key={payment.id}>
                  <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <Centered vertical>
                          <Text h5>Payment #{payment.id}</Text>
                        </Centered>
                      </div>
                    </div>

                  </Card>

                  <Spacer/>
                </React.Fragment>
              ))}
            </React.Fragment>
          )}

        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default FinancialsHomePage;