import { NextPage } from 'next';

import { Text } from '@geist-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

const UnauthorizedPage: NextPage = () => {
  const router = useRouter();

  React.useEffect(() => {
    // @todo Log the unauthorized calls

    console.error(`The permission you are lacking is [${router.query.failedPermission}]. You can request it by`)
  }, []);

  return (
    <div>
      <Text h1 type="error" style={{ textAlign: 'center' }}>You are not authorized to view the selected content</Text>
    </div>
  );
};

export default UnauthorizedPage;