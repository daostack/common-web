import React from 'react';

import { gql } from '@apollo/client';
import { Modal, Text } from '@geist-ui/react';

import { useGetPaymentDetailsLazyQuery } from '@graphql';

interface IPaymentDetailsModalProps {
  paymentId: string;

  open: boolean;

  onClose: () => void;
}

const GetPaymentDetailsData = gql`
  query GetPaymentDetails($paymentId: ID!) {
    payment(id: $paymentId) {
      id

      amount {
        amount
        currency
      }

      type
      status

      user {
        firstName
        lastName

        email
        photoURL
      }

      card {
        metadata {
          digits
          network
        }
      }

      proposal {
        id

        description {
          title
          description
        }

        join {
          funding
          fundingType
        }
      }
    }
  }
`;

export const PaymentDetailsModal: React.FC<IPaymentDetailsModalProps> = ({ paymentId, open, onClose }) => {
  const [getPayment, { loading, error, data: payment }] = useGetPaymentDetailsLazyQuery();

  React.useEffect(() => {
    if (paymentId && open) {
      getPayment({
        variables: {
          paymentId
        }
      });
    }
  }, [paymentId, open]);

  return (
    <Modal open={open} onClose={onClose} width="60vw">
      <Modal.Content>
        {error && (
          <React.Fragment>
            Something went wrong
          </React.Fragment>
        )}

        {payment && (
          <React.Fragment>
            <Text h1>Payment Details</Text>
          </React.Fragment>
        )}
      </Modal.Content>
    </Modal>
  );
};