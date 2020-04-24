const admin = require('firebase-admin');
admin.initializeApp();
const messaging = admin.messaging();

module.exports = new class Notification {
    send(tokens, title, body, options={contentAvailable: true, priority: 'high',}, data) {
        const payload = {
            notification: {
              title,
              body,
            },
            data
        };
        return messaging.sendToDevice(tokens, payload, options);
    }
};