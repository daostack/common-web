import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';


const IndexPage: NextPage = () => {
  const router = useRouter();

  React.useEffect(() => {
    router.push('/dashboard')
      .then(() => console.log('Redirected to dashboard'));
  }, []);

  return (<div/>);
};

export default IndexPage;