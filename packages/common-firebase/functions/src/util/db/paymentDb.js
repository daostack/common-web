// @ts-ignore
const { db } = require('../../settings');
const { getPayment } = require('../../circlepay/circlepay');
const { Utils } = require('../util');

const COLLECTION_NAME = 'payments';

const polling = async ({validate, interval, paymentId}) => {
	console.log('start polling');
	let attempts = 0;
	
	const executePoll = async (resolve, reject) => {
    console.log(`- poll #${attempts}`);
    const {data: {data}} = await getPayment(paymentId);
    attempts++;

    if (validate(data)) {
      return resolve(data);
    } else if (data.status === 'failed') {
      return reject({err: new Error('Payment failed'), payment: data});
    } else {
      return setTimeout(executePoll, interval * 2, resolve, reject);
    }
  };

  return new Promise(executePoll);
}

const pollPaymentStatus = async (paymentData) => (
	polling({
      validate: (payment) => payment.status === 'confirmed',
      interval: 10000,
      paymentId: paymentData.id
    })
      .then(async (payment) => {  
        return await updateStatus(paymentData.id, 'confirmed');
      })
      .catch(async ({error, payment}) => {
      	console.error('Polling error', error);
      	// burn user's rep
        return await updateStatus(paymentData.id, 'failed');
      })
);

const updateStatus = async(paymentId, status) => {
  let currentPayment = await Utils.getPaymentById(paymentId);
  currentPayment.status = status;
  updatePayment(paymentId, currentPayment);
}

const updatePayment = async (paymentId, doc) => (
  await db.collection(COLLECTION_NAME)
    .doc(paymentId)
    .set(
        doc,
        {
            merge: true
        }
    )
)

module.exports = {
  updatePayment,
  pollPaymentStatus
}