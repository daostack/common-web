import React from 'react';
import { Page, Spacer } from '@geist-ui/react';

import { Header } from '@components/Header';

export const AuthenticatedLayout: React.FC<React.PropsWithChildren<any>> = ({ children, ...rest }) => {
  return (
    <Page>
      <Header/>

      <Page.Body style={{ paddingTop: 0 }}>
        <Spacer y={1}/>

        {React.isValidElement(children) && React.cloneElement(children, { ...rest })}
      </Page.Body>
    </Page>
  );
};