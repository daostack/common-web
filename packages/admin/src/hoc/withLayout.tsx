import React from 'react';
import { useRouter } from 'next/router';

import { Page, Divider, Tabs } from '@geist-ui/react';

export const withLayout = (Component: React.ComponentType): React.ComponentType => {
  // State
  const [tab, setTab] = React.useState<string>();

  // Custom hooks
  const router = useRouter();

  // Effects
  React.useEffect(() => {
    const path = router.pathname;

    console.log(path);
  }, []);

  return (props): React.ReactElement => (
    <Page dotBackdrop>
      <Page.Header>
        <Tabs initialValue="1">
          <Tabs.Item label="evil rabbit" value="1"/>
          <Tabs.Item label="jumped" value="2" />
        </Tabs>
      </Page.Header>

      <Page.Body>
        <Component {...props} />
      </Page.Body>
    </Page>
  );
};