import React from 'react';
import { NextPage } from 'next';
import { Breadcrumbs, Spacer, Text, useToasts } from '@geist-ui/react';

import { Link } from '@components/Link';
import { PaymentsTable } from '@components/tables/PaymentsTable';

import { withPermission } from '../../../helpers/hoc/withPermission';


export const PaymentsHomepage: NextPage = () => {

  const [, setToast] = useToasts();

  const [updatingPayment, setUpdatingPayment] = React.useState<string>();


  // --- Data fetching
  return (
    <React.Fragment>
      <Text h1>Payments</Text>
      <Breadcrumbs>
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Link to="/financials/payments">Financials</Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Link to="/financials/payments">Payments</Link>
        </Breadcrumbs.Item>
      </Breadcrumbs>

      <Spacer y={2}/>

      <React.Fragment>
        <Text h3>Payments</Text>

        <Spacer y={.5}/>

        <PaymentsTable />
      </React.Fragment>
    </React.Fragment>
  );
};

export default withPermission('admin.financials.payments.*', {
  redirect: true
})(PaymentsHomepage);