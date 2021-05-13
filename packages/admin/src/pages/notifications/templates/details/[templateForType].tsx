import { NextPage } from 'next';
import { gql } from '@apollo/client';
import {
  Breadcrumbs,
  Text,
  Loading,
  Spacer,
  Divider,
  Table,
  Note,
  Modal,
  Button,
  Input,
  Textarea
} from '@geist-ui/react';
import { Link } from '@components/Link';
import React from 'react';
import { useRouter } from 'next/router';
import { useAllTemplatesForTypeQuery, NotificationTemplate, useUpdateTemplateMutation } from '@core/graphql';
import { HasPermission } from '@components/HasPermission';
import { PlusCircle, Edit3 } from '@geist-ui/react-icons';

const GetAllTemplatedForType = gql`
  query allTemplatesForType($forType: NotificationType!) {
    notificationSettings(where: {
      type: $forType
    }) {
      sendEmail
      sendPush

      showInUserFeed
    }

    notificationTemplates(where: {
      forType: $forType
    }) {
      id

      templateType

      language

      subject
      content

      from
      fromName
    }
  }
`;

const UpdateTemplate = gql`
  mutation UpdateTemplate($input: UpdateNotificationTemplateInput!) {
    updateNotificationTemplate(input: $input) {
      id
    }
  }
`;

const TemplateDetailsPage: NextPage = () => {
  const router = useRouter();

  // State
  const [editMode, setEditMode] = React.useState<NotificationTemplate>();

  // API access
  const { data, loading, refetch } = useAllTemplatesForTypeQuery({
    variables: {
      forType: router.query['templateForType'] as any
    }
  });

  const [update, { loading: updating }] = useUpdateTemplateMutation();

  // Action

  const onOpenEdit = (templateId: string) => {
    return () => {
      setEditMode(
        data.notificationTemplates
          .find(x => x.id === templateId) as any
      );
    };
  };

  const onCloseEdit = () => {
    setEditMode(null);
  };

  const onEditValueChange = (key: 'subject' | 'content') => {
    return (value) => {
      setEditMode(e => ({
        ...e,
        [key]: value?.target?.value
      }));
    };
  };

  const onSaveUpdate = async () => {
    await update({
      variables: {
        input: {
          id: editMode.id,

          subject: editMode.subject,
          content: editMode.content
        }
      }
    });

    await refetch();

    onCloseEdit();
  };

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
          <Modal open={!!editMode} onClose={onCloseEdit} width="40vw">
            <Modal.Content>
              <Text h4>Edit localized {editMode?.templateType} in {editMode?.language}</Text>


              <Text b>Subject</Text>
              <Input
                width="100%"
                onChange={onEditValueChange('subject')}
                value={editMode?.subject}
              />

              <Spacer y={.7}/>

              <Text b>Content</Text>
              <Textarea
                width="100%"
                onChange={onEditValueChange('content')}
                value={editMode?.content}
              />

              <Spacer y={1}/>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}
              >
                <Button
                  onClick={onSaveUpdate}
                  loading={updating}
                >
                  Save Changes
                </Button>
              </div>
            </Modal.Content>
          </Modal>

          {data.notificationSettings[0]?.sendEmail && (!data.notificationTemplates.some(x => x.templateType === 'EmailNotification')) && (
            <Note type="error">
              The notification is configured to send email notifications, but there is no template for that
            </Note>
          )}

          {data.notificationSettings[0]?.sendPush && (!data.notificationTemplates.some(x => x.templateType === 'PushNotification')) && (
            <Note type="error" style={{ margin: '1rem 0' }}>
              The notification is configured to send push notifications, but there is no template for that
            </Note>
          )}

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
              <div style={{ marginBottom: '2rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}
                >
                  <Text
                    h3
                    style={{ margin: '0 1rem 0 0' }}
                  >
                    Localized push notification in {n.language}
                  </Text>

                  <div
                    onClick={onOpenEdit(n.id)}
                    style={{
                      cursor: 'pointer'
                    }}
                  >
                    <Edit3/>
                  </div>
                </div>


                <Text h5>{n.subject}</Text>
                <Text
                  p
                  dangerouslySetInnerHTML={{
                    __html: n.content
                  }}
                />

                <Spacer/>
              </div>
            ))}
          </React.Fragment>

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
                <Text h3>Localized email in {n.language}</Text>


                <Text h5>{n.subject}</Text>
                <Text
                  p
                  dangerouslySetInnerHTML={{
                    __html: n.content
                  }}
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