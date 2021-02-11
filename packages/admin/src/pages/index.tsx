import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withSidebar } from '../hoc/withSidebar';
import React from 'react';

const IndexPage: NextPage = () => {
  const router = useRouter();

  React.useEffect(() => {
    router.push('/dashboard');
  }, []);

  return (<div />);
}

export default IndexPage;