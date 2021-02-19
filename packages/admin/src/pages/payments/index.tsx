import React from 'react';
import { NextPage } from 'next';

import { withPermission } from '../../helpers/hoc/withPermission';
import { useCreateIntentionMutation, IntentionType } from '@graphql';

export const EventsHomePage: NextPage = () => {
  const [createIntention, { data }] = useCreateIntentionMutation({
    variables: {
      type: IntentionType.Request,
      intention: 'common.admin.payments.homepage'
    }
  });

  React.useEffect(() => {
    createIntention();
  }, [])

  return (
    <div>Not Implemented. Intention ID: {data?.createIntention?.id}</div>
  );
};

export default withPermission('admin.payments.*', {
  redirect: true
})(EventsHomePage);