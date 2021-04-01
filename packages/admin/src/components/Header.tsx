import React from 'react';
import { Avatar, Divider, Link, Page, Tabs, Tooltip, Text } from '@geist-ui/react';
import { HasPermission } from '@components/HasPermission';
import { useCreateIntentionMutation, IntentionType } from '@graphql';
import { useAuthContext } from '@context';
import { useRouter } from 'next/router';
import firebase from 'firebase/app';

export const Header: React.FC = () => {
  const [createIntention] = useCreateIntentionMutation();

  const [currentTab, setCurrentTab] = React.useState<string>('dashboard');
  const authContext = useAuthContext();


  // Hooks
  const router = useRouter();

  // Effects
  React.useEffect(() => {
    setCurrentTab(router.pathname.split('/')[1]);
  });

  React.useEffect(() => {
    if (authContext.loaded) {
      if (!authContext.authenticated && router.pathname !== '/auth') {
        router.push('/auth');
      }
    }
  }, [authContext]);

  // Actions
  const onTabChange = (value: string): void => {
    setCurrentTab(value);

    router.push(`/${value}`);
  };

  const onSignOut = async (): Promise<void> => {
    await firebase.auth().signOut();

    router.push('/');
  };

  const commitIntention = (intention: string) => {
    return () => {
      createIntention({
        variables: {
          type: IntentionType.Request,
          intention
        }
      });
    };
  };


  return (
    <Page.Header>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginTop: '2.5vh'
        }}
      >
        <Text p style={{ margin: 0 }}>{authContext.userInfo.displayName}</Text>
        <Tooltip
          trigger="click"
          placement="bottomEnd"
          text={(
            <div style={{ minWidth: '10vw' }}>
              <b onClick={commitIntention('admin.theme.toggle')}>Theme </b> <br/>
              <b onClick={commitIntention('admin.notification.toggle')}>Notifications </b>

              <Divider y={0.5}/>

              <Link onClick={onSignOut}>
                <b>Sign Out</b>
              </Link>
            </div>
          )}
          style={{
            marginLeft: 10
          }}
        >
          <div style={{ cursor: 'pointer' }}>
            <Avatar src={authContext.userInfo.photoURL}/>
          </div>
        </Tooltip>
      </div>

      <HasPermission permission="admin.*">
        <Tabs value={currentTab} onChange={onTabChange} hideDivider>
          <Tabs.Item value="dashboard" label="Dashboard"/>
          <Tabs.Item value="commons" label="Commons"/>
          <Tabs.Item value="proposals" label="Proposals"/>
          <Tabs.Item value="users" label="Users"/>
          <Tabs.Item value="financials" label="Financials"/>
          <Tabs.Item value="events" label="Events"/>
          {/*<Tabs.Item value="development/playground" label="Playground"/>*/}
        </Tabs>
      </HasPermission>
    </Page.Header>
  );
};