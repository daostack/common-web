import { sendMail } from './mailer';
import { env } from '../../constants';
import { CommonError } from '../../util/errors';

import { approvePayout } from './templates/approvePayout';
import { userCommonCreated } from './templates/userCommonCreated';
import { userJoinedSuccess } from './templates/userJoinedSuccess';
import { adminPayInSuccess } from './templates/adminPayInSuccess';
import { adminCommonCreated } from './templates/adminCommonCreated';
import { userCommonFeatured } from './templates/userCommonFeatured';
import { requestToJoinSubmitted } from './templates/requestToJoinSubmitted';
import { userFundingRequestAccepted } from './templates/userFundingRequestAccepted';
import { userJoinedButFailedPayment } from './templates/userJoinedButFailedPayment';
import { adminFundingRequestAccepted } from './templates/adminFundingRequestAccepted';
import { adminPreauthorizationFailed } from './templates/adminPreauthorizationFailed';
import { adminJoinedButPaymentFailed } from './templates/adminJoinedButFailedPayment';
import { subscriptionCanceled } from './templates/subscriptionCanceled';
import { subscriptionChargeFailed } from './templates/subscriptionChargeFailed';
import { subscriptionCharged } from './templates/subscriptionCharged';

const templates = {
  requestToJoinSubmitted,
  adminCommonCreated,
  adminFundingRequestAccepted,
  adminPreauthorizationFailed,
  userCommonCreated,
  userCommonFeatured,
  userFundingRequestAccepted,
  userJoinedButFailedPayment,
  userJoinedSuccess,
  adminJoinedButPaymentFailed,
  adminPayInSuccess,
  approvePayout,
  subscriptionCanceled,
  subscriptionCharged,
  subscriptionChargeFailed
};

const globalDefaultStubs = {
  supportChatLink: 'https://common.io/help'
};

const replaceAll = (string, search, replace) => {
  return string.split(search).join(replace);
};

const isNullOrUndefined = (val) =>
  val === null || val === undefined;

interface IStub {
  required: boolean;
  default?: string;
}

export interface IEmailTemplate {
  template: string;
  subject: string;

  emailStubs?: {
    [key: string]: IStub;
  };

  subjectStubs?: {
    [key: string]: IStub;
  };
}

interface ITemplatedEmail {
  body: string;
  subject: string;
}

// @todo Make the payload type based on the templateKey
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getTemplatedEmail = (templateKey: keyof typeof templates, payload: any): ITemplatedEmail => {
  let { template, subject } = templates[templateKey];
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { emailStubs, subjectStubs } = templates[templateKey];


  // @todo Logger is not definded here because the file is JS. Move it to TS
  // eslint-disable-next-line no-console
  console.debug('Email templating started');

  if (isNullOrUndefined(template)) {
    throw new CommonError(`The requested template (${templateKey}) cannot be found`);
  }

  // Validate and add default values for the email template
  for (const stub in emailStubs || {}) {
    // Check if the stub is required. If it is check is there is value either in the
    // global stubs, the default stubs or the user provided ones
    if (
      emailStubs[stub].required && (
        isNullOrUndefined(payload.emailStubs[stub]) &&
        isNullOrUndefined(emailStubs[stub].default) &&
        isNullOrUndefined(globalDefaultStubs[stub])
      )
    ) {
      throw new CommonError(`Required stub ${stub} was not provided for ${templateKey} template`);
    }

    // If there is a default value for the stub and has not been replaced add it here
    if (!isNullOrUndefined(emailStubs[stub].default) && isNullOrUndefined(payload.emailStubs[stub])) {
      template = template.replace(`{{${stub}}}`, emailStubs[stub]);
    } else if (!isNullOrUndefined(globalDefaultStubs[stub]) && isNullOrUndefined(payload.emailStubs[stub])) {
      template = template.replace(`{{${stub}}}`, globalDefaultStubs[stub]);
    }
  }

  // Replace all provided stubs in the template
  for (const stub in payload.emailStubs) {
    template = replaceAll(template, `{{${stub}}}`, payload.emailStubs[stub]);
  }

  // Validate the email subject
  for (const stub in subjectStubs) {
    if (subjectStubs[stub].required && isNullOrUndefined(payload.subjectStubs[stub])) {
      throw new CommonError(`Required stub ${stub} was not provided for subject template`);
    }
  }

  for (const stub in payload.subjectStubs) {
    subject = replaceAll(subject, `{{${stub}}}`, payload.subjectStubs[stub]);
  }

  // eslint-disable-next-line no-console
  console.debug(`Email templating finished for template ${templateKey}`);

  return {
    body: template,
    subject
  };
};

export interface ISendTemplatedEmailData {
  templateKey: keyof typeof templates,
  emailStubs?: any,
  subjectStubs?: any,
  to: string | string[]
}

type SendTemplatedEmail = (data: ISendTemplatedEmailData) => Promise<void>;

export const sendTemplatedEmail: SendTemplatedEmail = async ({ templateKey, emailStubs, subjectStubs, to }) => {
  to === 'admin' && (to = env.mail.adminMail);

  const { body, subject } = getTemplatedEmail(templateKey, { emailStubs, subjectStubs });

  if (Array.isArray(to)) {
    const emailPromises = [];

    to.forEach((emailTo) => {
      // eslint-disable-next-line no-console
      console.log(`Sending ${templateKey} to ${emailTo}.`);

      emailPromises.push(sendMail(
        emailTo,
        subject,
        body
      ));
    });

    await Promise.all(emailPromises);
  } else {
    // eslint-disable-next-line no-console
    console.log(`Sending ${templateKey} to ${to}.`);

    await sendMail(
      to,
      subject,
      body
    );
  }


  // eslint-disable-next-line no-console
  console.log('Templated email send successfully');
};

export default {
  getTemplatedEmail,
  sendTemplatedEmail
};
