import React, { useState } from 'react';
import { NextPage } from 'next';

import { gql } from '@apollo/client';
import {
  Text,
  Breadcrumbs,
  Loading,
  Select,
  Input,
  Textarea,
  Button,
  Tooltip,
  Divider,
  Spinner,
  useToasts
} from '@geist-ui/react';

import { Link } from '@components/Link';

import {
  useNotificationOptionsQuery,
  NotificationType,
  NotificationLanguage,
  NotificationTemplateType,
  useCreateNotificationTemplateMutation
} from '@core/graphql';
import lodash from 'lodash';
import { PlusCircle, CheckCircle, XCircle } from '@geist-ui/react-icons';

const GetNotificationTemplateOptions = gql`
  query NotificationOptions {
    notificationTemplate: notificationTemplateOptions {
      languages
      templateTypes
      notificationTypes
    }
  }
`;

const CreateNotificationTemplate = gql`
  mutation CreateNotificationTemplate($input: CreateNotificationTemplateInput!) {
    createNotificationTemplate(input: $input) {
      id
    }
  }
`;

interface Template {
  language: NotificationLanguage;
  templateType: NotificationTemplateType;

  subject: '';
  content: '';

  status: 'notCreated' | 'creating' | 'created' | 'errored'
}

const CreateNotificationTemplatePage: NextPage = () => {
  const [, setToasts] = useToasts();

  const { loading, data: options } = useNotificationOptionsQuery();
  const [createNotificationTemplate] = useCreateNotificationTemplateMutation();

  // State
  const [creating, setCreating] = useState<boolean>(false);
  const [templateType, setTemplateType] = useState<NotificationType>();
  const [variants, setVariants] = useState<Template[]>([]);

  // Helpers
  const timer = (ms: number) => new Promise(res => setTimeout(res, ms));

  // Actions
  const onNotificationTemplateTypeSelected = (type: NotificationType) => {
    setTemplateType(type);

    if (!variants.length) {
      onAddVariant();
    }
  };

  const onAddVariant = () => {
    setVariants((variants) => ([
      ...variants, {
        language: NotificationLanguage.En,
        templateType: NotificationTemplateType.PushNotification,
        subject: '',
        content: '',
        status: 'notCreated'
      }
    ]));
  };

  const onVariantUpdate = (index: number, item: keyof Template) => {
    return (value: any) => {
      setVariants((v) => {
        const variants = Array.from(v);

        if (typeof value === 'string') {
          variants[index] = {
            ...v[index],
            [item]: value
          };
        } else {
          if (value?.target?.value) {
            variants[index] = {
              ...v[index],
              [item]: value.target.value
            };
          }
        }

        return variants;
      });
    };
  };

  const onCreate = async () => {
    setCreating(true);

    for (const variant of variants) {
      onVariantUpdate(variants.indexOf(variant), 'status')('creating');

      await timer(1500);

      try {
        const result = await createNotificationTemplate({
          variables: {
            input: {
              forType: templateType,
              fromEmail: undefined,
              fromName: undefined,
              content: variant.content,
              language: variant.language,
              subject: variant.subject,
              templateType: variant.templateType
            }
          }
        });

        onVariantUpdate(variants.indexOf(variant), 'status')('created');
      } catch (e) {
        setToasts({
          type: 'error',
          text: 'Error occurred while creating the template. Please consult the console for more info'
        });

        onVariantUpdate(variants.indexOf(variant), 'status')('errored');
      }
    }

    setCreating(false);
  };

  return (
    <React.Fragment>
      <Text h1>Notification Template</Text>

      <Breadcrumbs>
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Link to="/notifications">Notifications</Link>
        </Breadcrumbs.Item>

        <Breadcrumbs.Item>
          <Link to="/notifications/templates">Notification Templates</Link>
        </Breadcrumbs.Item>

        <Breadcrumbs.Item>
          <Link to="/notifications/templates/create">Create</Link>
        </Breadcrumbs.Item>
      </Breadcrumbs>

      {loading && (
        <Loading/>
      )}


      {(!loading && options) && (
        <React.Fragment>
          <div style={{ margin: '1.5rem 0' }}>
            <Text h2>General settings</Text>

            <Text style={{ marginBottom: 0 }}>Notification Type</Text>
            <Select
              value={templateType}
              onChange={onNotificationTemplateTypeSelected}
              placeholder="Select Notification Type"
              width="100%"
            >
              {options.notificationTemplate.notificationTypes.map((n) => (
                <Select.Option value={n} key={n}>{n}</Select.Option>
              ))}
            </Select>

            <Text style={{ marginBottom: 0 }}>From email (for email notifications)</Text>
            <Input placeholder="From Email" width="100%"/>

            <Text style={{ marginBottom: 0 }}>From name (for email notifications)</Text>
            <Input placeholder="From Name" width="100%"/>
          </div>

          {!!variants.length && (
            <React.Fragment>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1.5rem 0' }}>
                <Text h2>Notification Template Variants</Text>

                <Tooltip
                  enterDelay={500}
                  text="Add new variant for the notification"
                  style={{
                    cursor: 'pointer'
                  }}
                >
                  <PlusCircle onClick={onAddVariant}/>
                </Tooltip>
              </div>

              {variants.map((v, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Text h4 style={{ marginRight: '1rem', marginBottom: 0 }}>
                      Variant {i + 1}: {lodash.startCase(v.templateType)} in {v.language}
                    </Text>

                    {v.status === 'creating' && (
                      <Spinner/>
                    )}

                    {v.status === 'created' && (
                      <CheckCircle color="green"/>
                    )}

                    {v.status === 'errored' && (
                      <XCircle color="red"/>
                    )}
                  </div>

                  <Text style={{ marginBottom: 0 }}>Language</Text>
                  <Select
                    width="100%"
                    value={v.language}
                    onChange={onVariantUpdate(i, 'language')}
                  >
                    {options.notificationTemplate.languages.map((l, i) => (
                      <Select.Option value={l} key={i}>{l}</Select.Option>
                    ))}
                  </Select>

                  <Text style={{ marginBottom: 0 }}>Template Type</Text>
                  <Select
                    width="100%"
                    value={v.templateType}
                    onChange={onVariantUpdate(i, 'templateType')}
                  >
                    {options.notificationTemplate.templateTypes.map((tt, i) => (
                      <Select.Option value={tt} key={i}>{lodash.startCase(tt)}</Select.Option>
                    ))}
                  </Select>

                  <Text style={{ marginBottom: 0 }}>Notification Subject</Text>
                  <Input
                    width="100%"
                    value={variants[i].subject}
                    placeholder="Notification Subject"
                    onChange={onVariantUpdate(i, 'subject')}
                  />

                  <Text style={{ marginBottom: 0 }}>Notification content</Text>
                  <Textarea
                    width="100%"
                    value={variants[i].content}
                    onChange={onVariantUpdate(i, 'content')}
                    placeholder="This is the content of the notification. It can contain stubs, but some stubs may be unavailable depending on the notification type"
                  />

                  {(i < variants.length - 1) && (
                    <Divider/>
                  )}
                </div>
              ))}

              <div
                style={{
                  margin: '2rem 0',
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}
              >
                <Button loading={creating} onClick={onCreate}>
                  Create templates
                </Button>
              </div>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default CreateNotificationTemplatePage;