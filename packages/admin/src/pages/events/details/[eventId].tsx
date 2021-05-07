import { NextPage } from 'next';
import { withPermission } from '../../../helpers/hoc/withPermission';
import { useCreateIntentionMutation, IntentionType } from '@core/graphql';
import React from 'react';

export const EventDetailsPage: NextPage = () => {
  const [createIntention, { data }] = useCreateIntentionMutation({
    variables: {
      type: IntentionType.Request,
      intention: 'common.admin.events.details'
    }
  });

  React.useEffect(() => {
    createIntention();
  }, [])

  return (
    <div>Not Implemented</div>
  );
};

export default withPermission('admin.events.read.details', {
  redirect: true
})(EventDetailsPage);