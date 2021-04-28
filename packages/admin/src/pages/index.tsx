import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import firebase from 'firebase/app';
import { useAuthState } from 'react-firebase-hooks/auth';


const IndexPage: NextPage = () => {
  const router = useRouter();

  const [user, loading, error] = useAuthState(firebase.auth());

  React.useEffect(() => {
    if(!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/auth');
      }
    }
  }, [loading]);

  return (<div/>);
};

export default IndexPage;