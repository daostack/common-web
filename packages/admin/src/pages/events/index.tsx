import React from 'react';
import { NextPage } from 'next';

import { withPermission } from '../../helpers/hoc/withPermission';

export const EventsHomePage: NextPage = () => {
  return (
    <div>Not Implemented</div>
  );
};

export default withPermission('admin.events.*', {
  redirect: true
})(EventsHomePage);