import React, { FC } from "react";
import classNames from "classnames";
import { useField } from "formik";
import { CheckboxProps } from "../../Checkbox";
import { Checkbox } from "../Checkbox";
import { TextField, TextFieldProps } from "../TextField";
import styles from "./NotionIntegration.module.scss";

export interface NotionIntegrationProps {
  name: string;
  className?: string;
  isEnabled: CheckboxProps;
  token: TextFieldProps;
  databaseId: TextFieldProps;
}

const NotionIntegration: FC<NotionIntegrationProps> = (props) => {
  const { className: outerClassName, isEnabled, token, databaseId } = props;
  const [
    { value: isNotionIntegrationEnabled },
    { initialValue: initialIsNotionIntegrationEnabled },
  ] = useField(isEnabled.name);

  const linkToNotionIntegrationsEl = (
    <a
      className={styles.link}
      href="https://www.notion.so/my-integrations"
      target="_blank"
      rel="noopener noreferrer"
    >
      https://www.notion.so/my-integrations
    </a>
  );

  return (
    <>
      <Checkbox {...isEnabled} className={outerClassName} />
      {isNotionIntegrationEnabled && (
        <>
          <div>
            <span className={styles.integrationGuidanceText}>
              To set up an integration between a Notion database and this space,
              please follow the following steps:
            </span>
            <ol className={styles.integrationGuidanceSteps}>
              <li
                className={classNames(
                  styles.integrationGuidanceStep,
                  styles.integrationGuidanceText,
                )}
              >
                Go to {linkToNotionIntegrationsEl}, choose{" "}
                <b>New integration</b>, fill it up and submit. You will need to
                log-in to your Notion account if you're not already logged-in.
                You'll need to choose the Notion workspace that this DB is
                placed in if you have several workspaces. You'll need to name it
                (e.g. Common), and you can optionally add a logo for the
                integration.
              </li>
              <li
                className={classNames(
                  styles.integrationGuidanceStep,
                  styles.integrationGuidanceText,
                )}
              >
                In the next page, copy the <b>Internal Integration Secret</b>{" "}
                (click Show first) and paste it here in the first field below.
              </li>
              <li
                className={classNames(
                  styles.integrationGuidanceStep,
                  styles.integrationGuidanceText,
                )}
              >
                In the same page under <b>Capabilities</b>, change User
                Capabilities permission to include the read of user information
                including email addresses, and save changes.
              </li>
              <li
                className={classNames(
                  styles.integrationGuidanceStep,
                  styles.integrationGuidanceText,
                )}
              >
                Make sure to include in the Notion database you would like to
                bridge with this space the following properties: Title,
                Description (Text type), Common (URL type). Optionally you can
                include also the built-in Notion properties: Created time,
                Created by, and Notion ID (those properties exist and will be
                used anyhow).
              </li>
              <li
                className={classNames(
                  styles.integrationGuidanceStep,
                  styles.integrationGuidanceText,
                )}
              >
                Within the database page, in the 3-dots menu (top-right corner
                of the screen) choose
                <b> Add connection</b>, followed by the name of your newly
                created integration (e.g. Common) and confirm.
              </li>
              <li className={styles.integrationGuidanceText}>
                Click <b>Share</b> in the Notion database and copy the link to
                this database. From the link you should be able to extract the
                database ID and paste it here in the second field below. The
                database ID is the 32-characters string between the prefix
                https://www.notion.so/_workspaceName/ and the question mark.
              </li>
            </ol>
          </div>
          <TextField
            {...token}
            className={outerClassName}
            disabled={initialIsNotionIntegrationEnabled}
            styles={{
              input: { default: styles.textFieldDisabled },
            }}
          />
          <TextField
            {...databaseId}
            className={outerClassName}
            disabled={initialIsNotionIntegrationEnabled}
            styles={{
              input: { default: styles.textFieldDisabled },
            }}
          />
        </>
      )}
    </>
  );
};

export default NotionIntegration;
