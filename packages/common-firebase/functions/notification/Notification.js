const admin = require('firebase-admin');
const messaging = admin.messaging();

module.exports = new class Notification {
    send(tokens, title, body, image='', options={contentAvailable: true, mutable_content: true, priority: 'high'}, data={}) {
        const payload = {
            notification: {
              title,
              body,
              image,
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
