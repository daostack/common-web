import './util/logger';

import * as cron from './crons';
import * as event from './event';
import * as notification from './notification';
import * as messageTriggers from './discussionMessage/triggers';
// import * as commonTriggers from './common';

import { circlePayApp, circlePayCrons } from './circlepay';
import { commonsApp } from './common';
import { proposalCrons, proposalTriggers, proposalsApp } from './proposals';
import { subscriptionsApp } from './subscriptions';
import { payoutTriggers } from './circlepay/payouts/triggers';

// --- Express apps
export const commons = commonsApp;
export const circlepay = circlePayApp;
export const proposals = proposalsApp;
export const subscriptions = subscriptionsApp;


// --- Triggers and Subscriptions
exports.eventSub = event;
exports.notificationSub = notification;
exports.proposalCrons = proposalCrons;
exports.messageTriggers = messageTriggers;
exports.proposalTriggers = proposalTriggers;
exports.payoutTriggers = payoutTriggers;
// exports.commonTriggers = commonTriggers;

exports.cronJobs = cron;
exports.circlePayCrons = circlePayCrons;
