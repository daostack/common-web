import React from 'react';
import firebase from 'firebase/app';
import { useRouter } from 'next/router';

import { Avatar, Divider, Link, Page, Tabs, Tooltip, Text } from '@geist-ui/react';
import { HasPermission } from '@components/HasPermission';
import { useUserContext } from '@core/context';

export const Header: React.FC = () => {
  const userContext = useUserContext();
  const [currentTab, setCurrentTab] = React.useState<string>('dashboard');


  // Hooks
  const router = useRouter();

  // Effects
  React.useEffect(() => {
    setCurrentTab(router.pathname.split('/')[1]);
  });

  // Actions
  const onTabChange = (value: string): void => {
    setCurrentTab(value);

    router.push(`/${value}`);
  };

  const onSignOut = async (): Promise<void> => {
    await firebase.auth().signOut();

    router.push('/');
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
        <Text p style={{ margin: 0 }}>{userContext.displayName}</Text>
        <Tooltip
          trigger="click"
          placement="bottomEnd"
          text={(
            <div style={{ minWidth: '10vw' }}>
              {/*<b onClick={commitIntention('admin.theme.toggle')}>Theme </b> <br/>*/}
              {/*<b onClick={commitIntention('admin.notification.toggle')}>Notifications </b>*/}

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
            <Avatar src={userContext.photo}/>
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