const requestToJoinSubmitted = require('./templates/requestToJoinSubmitted');
const adminCommonCreated = require('./templates/adminCommonCreated');
const adminFundingRequestAccepted = require('./templates/adminFundingRequestAccepted');
const adminPreauthorizationFailed = require('./templates/adminPreauthorizationFailed');
const userCommonCreated = require('./templates/userCommonCreated');
const userCommonFeatured = require('./templates/userCommonFeatured');
const userFundingRequestAccepted = require('./templates/userFundingRequestAccepted');
const userJoinedButFailedPayment = require('./templates/userJoinedButFailedPayment');
const userJoinedSuccess = require('./templates/userJoinedSuccess');
const adminWalletCreationFailed = require('./templates/adminWalletCreationFailed');

const mailer = require("../mailer");

const templates = {
  requestToJoinSubmitted,
  adminCommonCreated,
  adminFundingRequestAccepted,
  adminPreauthorizationFailed,
  adminWalletCreationFailed,
  userCommonCreated,
  userCommonFeatured,
  userFundingRequestAccepted,
  userJoinedButFailedPayment,
  userJoinedSuccess
}

const globalDefaultStubs = {
  supportChatLink: 'https://common.io/help'
};

const replaceAll = (string, search, replace) => {
  return string.split(search).join(replace);
}

const isNullOrUndefined = (val) =>
  val === null || val === undefined;


/***
 *
 * @param {
 *  'requestToJoinSubmitted',
 *  'adminCommonCreated',
 *  'adminFundingRequestAccepted',
 *  'adminPreauthorizationFailed' ,
 *  'userCommonCreated',
 *  'userCommonFeatured',
 *  'userFundingRequestAccepted',
 *  'userJoinedButFailedPayment',
 *  'userJoinedSuccess',
 *  'adminWalletCreationFailed'
 * } templateKey
 *
 * @param {{
 *   emailStubs: object
 *   subjectStubs: object
 * }} payload
 *
 * @return {{
 *   template: string The templated body
 *   subject: string The templated subject
 * }}
 */
const getTemplatedEmail = (templateKey, payload) => {
  let {template, subject, emailStubs, subjectStubs} = templates[templateKey];

  if (isNullOrUndefined(template)) {
    throw new Error(`The requested template (${templateKey}) cannot be found`);
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
      throw new Error(`Required stub ${stub} was not provided for email template`)
    }

    // If there is a default value for the stub and has not been replaced add it here
    if (!isNullOrUndefined(emailStubs[stub].default) && isNullOrUndefined(payload.emailStubs[stub])) {
      template = template.replace(`{{${stub}}}`, emailStubs[stub])
    } else if (!isNullOrUndefined(globalDefaultStubs[stub]) && isNullOrUndefined(payload.emailStubs[stub])) {
      template = template.replace(`{{${stub}}}`, globalDefaultStubs[stub])
    }
  }

  // Replace all provided stubs in the template
  for (const stub in payload.emailStubs) {
    template = replaceAll(template, `{{${stub}}}`, payload.emailStubs[stub])
  }

  // Validate the email subject
  for (const stub in subjectStubs) {
    if (subjectStubs[stub].required && isNullOrUndefined(payload.subjectStubs[stub])) {
      throw new Error(`Required stub ${stub} was not provided for subject template`)
    }
  }

  for (const stub in payload.subjectStubs) {
    subject = replaceAll(subject, `{{${stub}}}`, payload.subjectStubs[stub])
  }

  return {
    template,
    subject
  };
}

/***
 *
 * @param {
 *  'requestToJoinSubmitted',
 *  'adminCommonCreated',
 *  'adminFundingRequestAccepted',
 *  'adminPreauthorizationFailed' ,
 *  'userCommonCreated',
 *  'userCommonFeatured',
 *  'userFundingRequestAccepted',
 *  'userJoinedButFailedPayment',
 *  'userJoinedSuccess',
 *  'adminWalletCreationFailed'
 * } templateKey
 *
 * @param { object } emailStubs
 * @param { object } subjectStubs
 *
 * @param { string } to
 */
const sendTemplatedEmail = async ({ templateKey, emailStubs, subjectStubs, to}) => {
  const {template, subject} = getTemplatedEmail(templateKey, { emailStubs, subjectStubs });

  await mailer.sendMail(
    to,
    subject,
    template
  );
}

module.exports = {
  getTemplatedEmail,
  sendTemplatedEmail
}
