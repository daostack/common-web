import React from 'react';
import firebase from 'firebase/app';

import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { AuthEmission } from '@react-firebase/auth/dist/types';
import { CheckInCircleFill } from '@geist-ui/react-icons';
import { Button, Description, Grid, Text, Tooltip, useMediaQuery, useTheme, useToasts } from '@geist-ui/react';


interface IAuthenticatePageProps {
  auth: AuthEmission;
}

const LoginPage: NextPage<IAuthenticatePageProps> = () => {
  const theme = useTheme();
  const router = useRouter();
  const isLarge = useMediaQuery('md', { match: 'up' });
  const isSM = useMediaQuery('sm', { match: 'down' });

  const [toasts, setToasts] = useToasts();

  const singIn = (provider: firebase.auth.AuthProvider) => {
    return async () => {
      try {
        await firebase.auth()
          .signInWithPopup(provider);

        setToasts({
          type: 'success',
          text: 'Successfully authenticated',
          delay: 3000
        });

        await router.push('/dashboard');
      } catch (e) {
        if (e.code === 'auth/popup-closed-by-user') {
          setToasts({
            type: 'error',
            text: e.message
          });
        } else {
          setToasts({
            type: 'error',
            text: 'Something went wrong'
          });

          console.error(e);
        }
      }

    };
  };

  return (
    <React.Fragment>
      <Grid.Container style={{ height: '100vh' }}>
        <Grid
          md={12}
          style={{
            background: theme.palette.accents_1,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            ...(isSM && {
              display: 'none'
            })
          }}
        >
          <div style={{ width: '25vw', marginRight: '5vw' }}>
            <Text h2>Common Admin</Text>

            <div style={{ display: 'flex', marginTop: 30 }}>
              <div style={{ marginRight: 10 }}>
                <CheckInCircleFill color={theme.palette.success}/>
              </div>

              <Description
                title="Instant access to statistic"
                content="See statistics that count in almost real time from the common count to the open proposals and much more"
              />
            </div>

            <div style={{ display: 'flex', marginTop: 30 }}>
              <div style={{ marginRight: 10 }}>
                <CheckInCircleFill color={theme.palette.success}/>
              </div>

              <Description
                title="Users at a glance"
                content="See all the users, see their commons and proposals, and help them with their payments and subscriptions"
              />
            </div>

            <div style={{ display: 'flex', marginTop: 30 }}>
              <div style={{ marginRight: 10 }}>
                <CheckInCircleFill color={theme.palette.success}/>
              </div>

              <Description
                title="Commons management"
                content="See all the commons, see their members and proposals, remove common member upon request and more"
              />
            </div>
          </div>
        </Grid>

        <Grid
          xs={24}
          md={12} style={{
          background: theme.palette.background,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: '5vw'
        }}
        >
          <div style={{ ...(isLarge ? { width: '25vw' } : { width: '100%' }) }}>
            <Text
              h2
              style={isSM ? { textAlign: 'center' } : {}}
            >
              Sign in to continue
            </Text>

            <div style={{ margin: '10px 0' }}>
              <Button
                shadow
                onClick={singIn(new firebase.auth.GoogleAuthProvider())}
                style={{ width: '100%', margin: '5px 0' }}
              >
                Continue with Google
              </Button>

              <Tooltip text="Sign in with Apple is yet to be implemented" enterDelay={1000} style={{ width: '100%' }}>
                <Button style={{ width: '100%', margin: '5px 0', cursor: 'not-allowed' }} shadow type="secondary">
                  Continue with Apple
                </Button>
              </Tooltip>
            </div>

            <Text>
              By clicking continue, you agree to our Terms of Service and Privacy Policy.
            </Text>
          </div>
        </Grid>
      </Grid.Container>
    </React.Fragment>
  );
};

export default LoginPage;