import React from 'react';
import { NextPage } from 'next';

import { withPermission } from '../../../helpers/hoc/withPermission';

export const EventDetailsPage: NextPage = () => {
  return (
    <div>Not Implemented</div>
  );
};

export default withPermission('admin.*', {
  redirect: true
})(EventDetailsPage);