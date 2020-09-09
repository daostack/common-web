const emailClient = require('./index');

const db = require('firebase-admin').firestore();
const { env } = require('@env');

module.exports = async (preAuthId, failureReason = 'Unknown') => {
  const proposalsSnapshot = await db.collection('proposals')
    .where('description.preAuthId', '==', preAuthId)
    .get()

  const proposal = proposalsSnapshot.docs.map(doc => doc.data())[0];

  if (!proposal) {
    throw new Error("Proposal not found for preauth id " + preAuthId);
  }

  const common = (await db.collection('daos')
    .doc(proposal.dao)
    .get())
    .data();

  const requester = (await db.collection('users')
    .doc(proposal.join.proposedMemberId)
    .get())
    .data()

  await emailClient.sendTemplatedEmail({
    to: env.mail.adminMail,
    templateKey: "adminPreauthorizationFailed",
    emailStubs: {
      failureReason,
      commonName: common.name,
      membershipRequestId: proposal.id,
      userId: requester.uid,
      userEmail: requester.email,
      userFullName: requester.displayName,
      paymentAmount: proposal.join.funding,
      submittedOn: new Date(proposal.executedAt * 1000).toDateString()
    }
  });
};
