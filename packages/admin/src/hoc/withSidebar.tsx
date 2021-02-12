import { Grid, Page } from '@geist-ui/react';
import React from 'react';
import { Sidebar } from '../components/Sidebar';

export const withSidebar = (Component: React.ComponentType): React.ComponentType => {
  return (props): React.ReactElement => (
    // <Row justify="end">
    //   <Col span={8}>
    //     <Sidebar/>
    //   </Col>
    //   <Col span={8}>
    //     <Page>
    //       <Component {...props} />
    //     </Page>
    //   </Col>
    //   <Col span={8}></Col>
    // </Row>

    <Grid.Container>
      <Grid xs={24} md={6} justify="flex-end" style={{ display: 'flex' }}>
        <div style={{ width: 130, marginTop: 100 }}>
           <Sidebar/>
        </div>
      </Grid>
      <Grid xs={24} md={12}>
        <Page dotBackdrop>
          <Component {...props} />
        </Page>
      </Grid>
    </Grid.Container>
  );
};