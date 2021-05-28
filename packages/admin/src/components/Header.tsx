import React from 'react';
import firebase from 'firebase/app';
import { useRouter } from 'next/router';

import { Avatar, Divider, Page, Tooltip, Text, Popover } from '@geist-ui/react';
import { HasPermission } from '@components/HasPermission';
import { useUserContext } from '@core/context';
import { SearchEverywhere } from '@components/modals/SearchEverywhere';
import { Link } from './Link';

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
    await router.push('/');
  };


  return (
    <Page.Header>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '2.5vh',
          marginBottom: '1.5vh'
        }}
      >
        <SearchEverywhere/>

        <div style={{ display: 'flex' }}>
          <Text p style={{ margin: 0 }}>{userContext.displayName}</Text>
          <Tooltip
            trigger="click"
            placement="bottomEnd"
            text={(
              <div style={{ minWidth: '10vw' }}>
                <Divider y={0.5}/>

                <div
                  style={{
                    cursor: 'pointer'
                  }}
                  onClick={onSignOut}
                >
                  <b>Sign Out</b>
                </div>
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
      </div>

      <HasPermission permission="admin.*">
        <div
          style={{
            display: 'flex'
          }}
        >
          <Link
            to="/"
            style={{
              margin: '0 .5em',
              marginLeft: '0'
            }}
          >
            Dashboard
          </Link>

          <HasPermission permission="admin.common.*">
            <Link
              to="/commons"
              style={{
                margin: '0 .5em'
              }}
            >
              Commons
            </Link>
          </HasPermission>

          <HasPermission permission="admin.proposals.*">
            <Link
              to="/proposals"
              style={{
                margin: '0 .5em'
              }}
            >
              Proposals
            </Link>
          </HasPermission>

          <HasPermission permission="admin.users.*">
            <Link
              to="/users"
              style={{
                margin: '0 .5em'
              }}
            >
              Users
            </Link>
          </HasPermission>

          <HasPermission permission="admin.payment.*">
            <Popover
              trigger="hover"
              content={(
                <React.Fragment>
                  <Popover.Item>
                    <Link to="/financials/payments">Payments</Link>
                  </Popover.Item>

                  <Popover.Item>
                    <Link to="/financials/payouts">Payouts</Link>
                  </Popover.Item>
                </React.Fragment>
              )}
            >
              <Text
                p
                style={{
                  margin: '0 .5em',
                  cursor: 'pointer'
                }}
              >
                Financials
              </Text>
            </Popover>

          </HasPermission>


          <HasPermission permission="admin.notifications.*">
            <Popover
              trigger="hover"
              content={(
                <React.Fragment>
                  <Popover.Item>
                    <Link to="/notifications/templates">Templates</Link>
                  </Popover.Item>

                  <Popover.Item>
                    <Link to="/notifications/settings">Settings</Link>
                  </Popover.Item>

                  <Popover.Item>
                    <Link to="/notifications/events">Event integrations</Link>
                  </Popover.Item>
                </React.Fragment>
              )}
            >
              <Text
                p
                style={{
                  margin: '0 .5em',
                  cursor: 'pointer'
                }}
              >
                Notifications
              </Text>
            </Popover>

          </HasPermission>

        </div>
      </HasPermission>
    </Page.Header>
  );
};