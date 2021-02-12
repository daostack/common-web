import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import firebase from 'firebase/app';

const IndexPage: NextPage = () => {
  const router = useRouter();

  React.useEffect(() => {
    return firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/auth');
      }
    });
  }, []);

  return (<div/>);
};

export default IndexPage;