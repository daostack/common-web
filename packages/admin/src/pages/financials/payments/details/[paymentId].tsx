// import { NextPage } from 'next';
// import { useRouter } from 'next/router';
// import { useGetPaymentDetailsLazyQuery } from '@graphql';
// import React from 'react';
// import { Link } from '@components/Link';
// import { gql } from '@apollo/client';
// import { Breadcrumbs, Grid, Tag, Text } from '@geist-ui/react';
//
// const GetPaymentDetailsData = gql`
//   query GetPaymentDetails($paymentId: ID!) {
//     payment(id: $paymentId) {
//       id
//
//       amount {
//         amount
//         currency
//       }
//
//       type
//       status
//
//       user {
//         firstName
//         lastName
//
//         email
//         photoURL
//       }
//
//       card {
//         metadata {
//           digits
//           network
//         }
//       }
//
//       proposal {
//         id
//
//         description {
//           title
//           description
//         }
//
//         join {
//           funding
//           fundingType
//         }
//       }
//     }
//   }
// `;
//
//
// const PaymentDetailsPage: NextPage = () => {
//   const router = useRouter();
//   const [getPayment, { loading, error, data: payment }] = useGetPaymentDetailsLazyQuery();
//
//   React.useEffect(() => {
//     getPayment({
//       variables: {
//         paymentId: router.query.paymentId as string
//       }
//     });
//   }, [router.query.paymentId]);
//
//   return (
//     <React.Fragment>
//       <div style={{ display: 'flex', alignItems: 'center' }}>
//         <Text h1>Payment Details</Text>
//
//         {payment && (
//           <Tag style={{ marginLeft: '20px' }}>
//             <b>{payment.payment.status.toUpperCase()}</b>
//           </Tag>
//         )}
//       </div>
//
//       <Breadcrumbs>
//         <Breadcrumbs.Item>Home</Breadcrumbs.Item>
//         <Breadcrumbs.Item>
//           <Link to="/financials">Financials</Link>
//         </Breadcrumbs.Item>
//         <Breadcrumbs.Item>
//           <Link to="/financials/payments">Payments</Link>
//         </Breadcrumbs.Item>
//
//         <Breadcrumbs.Item>
//           [{router.query.paymentId}]
//         </Breadcrumbs.Item>
//       </Breadcrumbs>
//
//       {payment && (
//         <React.Fragment>
//           <Text>
//
//           </Text>
//         </React.Fragment>
//       )}
//     </React.Fragment>
//   )
// };
//
// export default PaymentDetailsPage;
