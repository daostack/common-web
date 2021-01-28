import axios from 'axios';
import { env } from '../constants';
import { CommonError } from './errors';

const sendErrorToSlack = async (error: CommonError, requestId: string): Promise<void> => {
  await axios.post(env.slack.errorWebhook, {
    text: `${error.errorCode} occurred`,
    attachments: [
      {
        color: '#f4c2c2',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `${error.errorCode} occurred`,
              emoji: true
            }
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: '*When:*\n' + new Date().toTimeString()
              }
            ]
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: '*ErrorId:*\n' + error.errorId
              },
              {
                type: 'mrkdwn',
                text: '*ErrorCode:*\n' + error.errorCode
              }
            ]
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*Error message:*\n' + error.message
            }
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'View error logs',
                  emoji: true
                },
                url: `${env.firebase.logsUrl}?search=${error.errorId}&&severity=DEBUG`
              },
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'View all request logs',
                  emoji: true
                },
                url: `${env.firebase.logsUrl}?search=${requestId}&&severity=DEBUG`
              }
            ]
          }
        ]
      }
    ]
  });
};

export const slackClient = {
  sendError: sendErrorToSlack
};