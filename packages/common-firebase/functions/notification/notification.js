const admin = require('firebase-admin');
const messaging = admin.messaging();

module.exports = new class Notification {
  send(tokens, title, body, image = '', options = {
    contentAvailable: true,
    mutable_content: true,
    priority: 'high'
  }, data = {}) {
    const payload = {
      notification: {
        title,
        body,
        image
      },
      data
    };

    // @question Ask about this rule "promise/always-return". It is kinda useless so we may disable it globally?
    // eslint-disable-next-line promise/always-return
    messaging.sendToDevice(tokens, payload, options).then(() => {
      console.log('Send Success');
    }).catch(e => {
      console.error(e);
    });
  }
};
