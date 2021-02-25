import { NextPage } from 'next';
import { withPermission } from '../../helpers/hoc/withPermission';
import { useCreateIntentionMutation, IntentionType } from '@graphql';
import React from 'react';

export const EventsHomePage: NextPage = () => {
  const [createIntention, { data }] = useCreateIntentionMutation({
    variables: {
      type: IntentionType.Request,
      intention: 'common.admin.events.homepage'
    }
  });

  React.useEffect(() => {
    createIntention();
  }, [])

  return (
    <div>Not Implemented</div>
  );
};

export default withPermission('admin.events.*', {
  redirect: true
})(EventsHomePage);