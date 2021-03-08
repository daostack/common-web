import React from 'react';
import { NextPage } from 'next';

import { gql } from '@apollo/client';
import {
  Breadcrumbs,
  Card,
  Col,
  Divider,
  Note,
  Row,
  Spacer,
  Spinner,
  Tag,
  Text,
  User,
  useTheme,
  useToasts
} from '@geist-ui/react';

import { withPermission } from '../../../helpers/hoc/withPermission';
import {
  useGetPaymentsHomeScreenDataQuery,
  useGetPaymentDetailsLazyQuery,
  useUpdatePaymentDataMutation
} from '@graphql';
import { Link } from '@components/Link';
import { Centered } from '@components/Centered';
import { ChevronDownCircle, ChevronLeftCircle, ChevronRightCircle, ChevronUpCircle, Zap } from '@geist-ui/react-icons';
import { useRouter } from 'next/router';
import { PaymentsTable } from '@components/tables/PaymentsTable';

const GetPaymentsHomepageData = gql`
  query GetPaymentsHomeScreenData {
    hangingPayments: payments(hanging: true) {
      id

      createdAt
      updatedAt

      status
    }
  }
`;

const UpdatePaymentDataMutation = gql`
  mutation UpdatePaymentData($paymentId: ID!) {
    updatePaymentData(id: $paymentId)
  }
`;

export const PaymentsHomepage: NextPage = () => {

  const [, setToast] = useToasts();

  const [updatingPayment, setUpdatingPayment] = React.useState<string>();


  // --- Data fetching
  const { data: payments } = useGetPaymentsHomeScreenDataQuery();

  const [updatePayment] = useUpdatePaymentDataMutation();



  const onUpdatePaymentClick = (paymentId: string): () => Promise<void> => {
    return async () => {
      setUpdatingPayment(paymentId);

      const result = await updatePayment({
        variables: {
          paymentId
        }
      });

      if (result.data) {
        await updatePayments();

        setToast({
          type: 'success',
          text: 'Payment updated!'
        });
      } else {
        setToast({
          type: 'error',
          text: 'An error occurred while updating the payment!'
        });
      }

      setUpdatingPayment(null);
    };
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
        {(!!payments?.hangingPayments?.length) && (
          <React.Fragment>
            <Note type="error">There are hanging payments. Please, take a look!</Note>

            <Spacer/>

            <Text h3>Hanging payments ({payments?.hangingPayments})</Text>

            {(payments?.hangingPayments).map((payment) => (
              <React.Fragment key={payment.id}>
                <Card>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <Centered vertical>
                        <Text h5>Payment #{payment.id}</Text>
                      </Centered>
                    </div>

                    <div>
                      <Centered horizontal>
                        {(updatingPayment !== payment.id) ? (
                          <div
                            onClick={onUpdatePaymentClick(payment.id)}
                            style={{
                              cursor: updatingPayment
                                ? 'not-allowed'
                                : 'pointer'
                            }}
                          >
                            <Zap/>
                          </div>
                        ) : (
                          <div style={{ cursor: 'not-allowed' }}>
                            <Spinner/>
                          </div>
                        )}
                      </Centered>
                    </div>
                  </div>

                </Card>

                <Spacer/>
              </React.Fragment>
            ))}
          </React.Fragment>
        )}


        <Text h3>Payments</Text>

        <Spacer y={.5}/>

        <PaymentsTable />


      </React.Fragment>
    </React.Fragment>
  );
};

export default withPermission('admin.payments.*', {
  redirect: true
})(PaymentsHomepage);