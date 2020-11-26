import * as cron from './cron';
import * as event from './event';
import * as notification from './notification';
import * as messageTriggers from './discussionMessage/triggers';
import * as subscriptionsTriggers from './subscriptions/triggers';

import { circlepayApp } from './circlepay';
import { commonsApp } from './common';
import { proposalCrons, proposalTriggers, proposalsApp } from './proposals';
import { subscriptionsApp } from './subscriptions';

// --- Express apps
export const commons = commonsApp;
export const circlepay = circlepayApp;
export const proposals = proposalsApp;
export const subscriptions = subscriptionsApp;


// --- Triggers and Subscriptions
exports.eventSub = event;
exports.notificationSub = notification;
exports.proposalCrons = proposalCrons;
exports.messageTriggers = messageTriggers;
exports.proposalTriggers = proposalTriggers;
exports.subscriptionTriggers = subscriptionsTriggers;

exports.cronJobs = cron;
