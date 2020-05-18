const admin = require('firebase-admin');
const messaging = admin.messaging();

module.exports = new class Notification {
    send(tokens, title, body, options={contentAvailable: true, priority: 'high'}, data={}) {
        const payload = {
            notification: {
              title,
              body,
            },
            data
        };
        messaging.sendToDevice(tokens, payload, options).then(()=> {
            console.log('Send Success')
        }).catch( e => {
            console.log(e)
        });
    }
};
