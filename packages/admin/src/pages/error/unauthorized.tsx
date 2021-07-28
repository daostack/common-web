import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import firebase from 'firebase/app';
import { Text } from '@geist-ui/react';

const UnauthorizedPage: NextPage = () => {
  const router = useRouter();

  React.useEffect(() => {
    (async () => {
      if (router.query.failedPermission) {
        console.error(
          `The permission you are lacking is [${router.query.failedPermission}].` +
          `You can request it by asking to look up intention with ID `
        );
      }
    })();
  }, [router.query]);

  const onClickSwitch = async () => {
    await firebase.auth()
      .signOut();
  };

  return (
    <div>
      <Text h1 type="error" style={{ textAlign: 'center' }}>
        You are not authorized to view the selected content
      </Text>

      <Text p style={{ textAlign: 'center' }}>
        Wrong account?{' '}
        <span onClick={onClickSwitch} style={{ cursor: 'pointer' }}>Click here to switch it</span>
      </Text>
    </div>
  );
};

export default UnauthorizedPage;