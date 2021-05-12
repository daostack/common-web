import { NextPage } from 'next';
import { gql } from '@apollo/client';
import { Breadcrumbs, Text, Loading, Spacer, Description, Divider, Table } from '@geist-ui/react';
import { Link } from '@components/Link';
import React from 'react';
import { useRouter } from 'next/router';
import { useAllTemplatesForTypeQuery } from '@core/graphql';
import { HasPermission } from '@components/HasPermission';
import { PlusCircle } from '@geist-ui/react-icons';

const GetAllTemplatedForType = gql`
  query allTemplatesForType($forType: NotificationType!) {
    notificationTemplates(where: {
      forType: $forType
    }) {
      templateType

      language

      subject
      content

      from
      fromName
    }
  }
`;

const TemplateDetailsPage: NextPage = () => {
  const router = useRouter();

  // State
  const [editMode, setEditMode] = React.useState();

  // Data fetching
  const { data, loading } = useAllTemplatesForTypeQuery({
    variables: {
      forType: router.query['templateForType'] as any
    }
  });

  return (
    <React.Fragment>
      <Text h1>Template Details</Text>
      <Breadcrumbs>
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Link to="/notifications">Notifications</Link>
        </Breadcrumbs.Item>

        <Breadcrumbs.Item>
          <Link to="/notifications/templates">Templates</Link>
        </Breadcrumbs.Item>

        <Breadcrumbs.Item>
          <Link
            to={`/notifications/templates/details/${router.query['templateForType']}`}>[{router.query['templateForType'] || 'details'}]</Link>
        </Breadcrumbs.Item>
      </Breadcrumbs>

      <Spacer/>

      {loading && (
        <Loading/>
      )}

      {data && (
        <React.Fragment>
          <Text h2>General template configuration</Text>

          <Table data={[{
            property: 'From Email',
            value: data.notificationTemplates[0].from || '-',
            actions: ''
          }, {
            property: 'From Name',
            value: data.notificationTemplates[0].fromName || '-',
            actions: ''
          }]}>


            <Table.Column prop="property" label="Property" width={200}/>
            <Table.Column prop="value" label="Value"/>
            <Table.Column prop="actions" label="Actions" width={150}/>
          </Table>

          <Spacer y={3}/>


          <React.Fragment>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text h2 style={{ margin: 0 }}>Push Notifications</Text>

              <div/>

              <HasPermission permission="admin.notification.setting.templates.create">
                <div
                  style={{
                    cursor: 'pointer'
                  }}
                >
                  <PlusCircle
                    strokeWidth={2}
                    color="blue"
                  />
                </div>
              </HasPermission>
            </div>
            <Divider style={{ marginTop: 0 }}/>


            {data.notificationTemplates.filter(x => x.templateType === 'PushNotification').map(n => (
              <React.Fragment>
                <Text h6>Localized push notification in {n.language}</Text>

                <Description
                  title={n.subject}
                  content={n.content}
                />

                <Spacer/>
              </React.Fragment>
            ))}</React.Fragment>

          <React.Fragment>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text h2 style={{ margin: 0 }}>Email Notifications</Text>

              <div/>


              <HasPermission permission="admin.notification.setting.templates.create">
                <div
                  style={{
                    cursor: 'pointer'
                  }}
                >
                  <PlusCircle
                    strokeWidth={2}
                    color="blue"
                  />
                </div>
              </HasPermission>
            </div>
            <Divider style={{ marginTop: 0 }}/>

            {!data.notificationTemplates.filter(x => x.templateType === 'EmailNotification').length && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  margin: '3rem'
                }}
              >
                <Text h4>No templates for email notifications</Text>
              </div>
            )}

            {data.notificationTemplates.filter(x => x.templateType === 'EmailNotification').map(n => (
              <React.Fragment>
                <Text>Localized email in {n.language}</Text>

                <Description
                  title={n.subject}
                  content={(
                    <div dangerouslySetInnerHTML={{
                      __html: n.content
                    }}/>
                  )}
                />

                <Spacer/>
              </React.Fragment>
            ))}
          </React.Fragment>
        </React.Fragment>
      )}

    </React.Fragment>
  );
};

export default TemplateDetailsPage;