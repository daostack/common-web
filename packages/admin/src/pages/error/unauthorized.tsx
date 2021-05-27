import { NextPage } from 'next';

import { Text } from '@geist-ui/react';
import { useRouter } from 'next/router';
import firebase from 'firebase/app';
import React from 'react';
import { gql } from '@apollo/client';
import { useCreateIntentionMutation, IntentionType } from '@graphql';
import { usePermissionsContext, useAuthContext } from '@context';

const CreateIntentionMutation = gql`
  mutation createIntention($type: IntentionType!, $intention: String!) {
    createIntention(
      input: {
        type: $type,
        intention: $intention
      }
    ) {
      id
    }
  }
`;

const UnauthorizedPage: NextPage = () => {
  const router = useRouter();
  const permissionsContext = usePermissionsContext();
  const authContext = useAuthContext();

  const [createIntention] = useCreateIntentionMutation();

  React.useEffect(() => {
    (async () => {
      if (router.query.failedPermission) {
        const { data } = await createIntention({
          variables: {
            type: IntentionType.Access,
            intention: router.query.failedPermission as string
          }
        });

        console.error(
          `The permission you are lacking is [${router.query.failedPermission}].` +
          `You can request it by asking to look up intention with ID ${data.createIntention.id}`
        );
      }

      const { data } = await createIntention({
        variables: {
          type: IntentionType.Access,
          intention: JSON.stringify({ permissionsContext, authContext })
        }
      });
    })();
  }, [router.query]);

  const onClickSwitch = async () => {
    await firebase.auth().signOut();
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