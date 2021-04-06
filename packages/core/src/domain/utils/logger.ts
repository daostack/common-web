import winston from 'winston';
import SlackHook from 'winston-slack-webhook-transport';

const $logger = winston.createLogger({
  level: 'silly',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

$logger.add(
  new winston.transports.Console({
    format: winston.format.simple()
  })
);

// if (process.env['Logs.Slack.Webhook']) {
//   $logger.add(
//     new SlackHook({
//       webhookUrl: process.env['Logs.Slack.Webhook']
//     })
//   );
// }

export const logger = $logger;