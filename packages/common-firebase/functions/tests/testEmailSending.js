const { db } = require('../settings.js');
const emailClient = require('../email');
const { Utils } = require('../util/util');

const {getTemplatedEmail} = require('../email');
const {sendMail} = require('../mailer');

const usersCollection = 'users';
const commonsCollection = 'daos';
const proposalCollection = 'proposals';

const testEmailSending = async (req) => {
  const {to, subject, message, template} = req.query;

  if (!to) {
    throw new Error("Email is not provided!");
  }

  if (!template) {
    await sendMail(
      to,
      subject || "Test email",
      message || "This is test email for testing the email sending capabilities of the application."
    );

    return "Email sent successfully!";
  }

  const templatedEmail = getTemplatedEmail('requestToJoinSubmitted', {
    emailStubs: {
      name: "Test Email",
      commonName: "New",
      link: "https://www.google.com/?client=safari",
      // supportChatLink: "https://www.google.com/?client=safari"
    }
  })

  await sendMail(
    to,
    templatedEmail.subject,
    templatedEmail.template
  );

  return "Templated email sent successfully!";
};

const testDaoCreationEmails = async (req) => {
  const {to} = req.query;

  const newDao = (await db.collection('daos').doc("0x1d169610875b37d39ea71868b75b6160146a2c9d").get()).data();
  const userId = newDao.members[0].userId;
  const userData = await Utils.getUserById(userId);
  const daoName = newDao.name;

  const commonLink = `https://app.common.io/common/${newDao.id}`;

  await Promise.all([
    emailClient.sendTemplatedEmail({
      to,
      templateKey: "userCommonCreated",
      emailStubs: {
        commonLink,
        name: userData.displayName,
        commonName: daoName,
      }
    }),

    emailClient.sendTemplatedEmail({
      to,
      templateKey: "adminCommonCreated",
      emailStubs: {
        userId,
        commonLink,
        userName: userData.displayName,
        userEmail: userData.email,
        commonCreatedOn: new Date().toDateString(),
        log: 'Successfully created common',
        commonId: newDao.id,
        commonName: newDao.name,
        description: newDao.metadata.description,
        about: newDao.metadata.byline,
        paymentType: 'one-time',
        minContribution: newDao.minFeeToJoin
      }
    }),

    await emailClient.sendTemplatedEmail({
      to,
      templateKey: 'adminWalletCreationFailed',
      emailStubs: {
        commonName: daoName,
        commonId: newDao.id
      }
    })
  ]);

  return "Templated email sent successfully!";
}

const testPreauthFailedEmails = async (req) => {
  const {to} = req.query;

  const preAuthId = '85337215';

  const proposalsSnapshot = await db.collection(proposalCollection)
    .where('description.preAuthId', '==', preAuthId)
    .get()

  const proposal = proposalsSnapshot.docs.map(doc => doc.data())[0];

  if(!proposal) {
    throw new Error("Proposal not found for preauth id " + preAuthId);
  }

  const common = (await db.collection(commonsCollection)
    .doc(proposal.dao)
    .get())
    .data();

  const requester = (await db.collection(usersCollection)
    .doc(proposal.join.proposedMemberId)
    .get())
    .data()
  
  await emailClient.sendTemplatedEmail({
    to,
    templateKey: "adminPreauthorizationFailed",
    emailStubs: {
      commonName: common.name,
      membershipRequestId: proposal.id,
      userId: requester.uid,
      userEmail: requester.email,
      userFullName: requester.displayName,
      paymentAmount: proposal.join.funding,
      submittedOn: new Date(proposal.executedAt * 1000).toDateString(),
      failureReason: 'Unknown'
    }
  });

  return "Templated email sent successfully!";
}

// const testEmailProposalsEmails = async (req) => {
//   const {to, proposalId} = req.query;
//
//   const data = (await db.collection(proposalCollection).doc(proposalId || "0x015056f2499f40f09ef36e588adcbead8d06aea64652772ff12d5706bc65ae67").get()).data();
//   const userData = await Utils.getUserById(data.proposerId);
//   let daoData = await Utils.getCommonById(data.dao);
//
//   const preAuthId = data.description.preAuthId;
//   const amount = data.description.funding;
//
//
//   await Promise.all([
//     emailClient.sendTemplatedEmail({
//       to,
//       templateKey: 'adminWalletCreationFailed',
//       emailStubs: {
//         commonName: dao.Name,
//         commonId: newDao.id
//       }
//     }),
//     sendMail(
//       env.mail.adminMail,
//       'Successfull pay-In',
//       `Pay-In successfull for Proposal with ID ${data.id}`
//     ),
//     sendMail(
//       userData.email,
//       'Successfull payment',
//       `Your request to join has been approved and the amount of ${data.join.funding}$ was charged.`
//     ),
//     sendMail(
//       env.mail.adminMail,
//       'Failed pay-In',
//       `Pay-In failed for Proposal with ID ${data.id}`
//     )
//   ]);
// }

module.exports = {
  testEmailSending,
  testDaoCreationEmails,
  testPreauthFailedEmails
};
