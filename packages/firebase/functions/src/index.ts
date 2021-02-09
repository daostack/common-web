import './util/logger';

import * as cron from './crons';
import * as event from './event';
import * as notification from './notification';
import * as messageTriggers from './discussionMessage/triggers';
import * as commonTriggers from './common/triggers';
import * as discussionTriggers from './discussion/triggers';

import { circlePayApp, circlePayCrons } from './circlepay';
import { commonsApp } from './common';
import { proposalCrons, proposalTriggers, proposalsApp } from './proposals';
import { subscriptionsApp } from './subscriptions';
import { payoutTriggers } from './circlepay/payouts/triggers';
import { backofficeApp, circleBalanceCrons } from './backoffice';
import { metadataApp } from './metadata';
import { discussionApp } from './discussion';
import { adminApp } from './core/admin';

// --- Express apps
export const commons = commonsApp;
export const metadata = metadataApp;
export const circlepay = circlePayApp;
export const proposals = proposalsApp;
export const subscriptions = subscriptionsApp;
export const backoffice = backofficeApp;
export const discussions = discussionApp;
export const admin = adminApp;

// --- Triggers and Subscriptions
exports.eventSub = event;
exports.notificationSub = notification;
exports.proposalCrons = proposalCrons;
exports.messageTriggers = messageTriggers;
exports.proposalTriggers = proposalTriggers;
exports.payoutTriggers = payoutTriggers;
exports.commonTriggers = commonTriggers;
exports.discussionTriggers = discussionTriggers;

exports.cronJobs = cron;
exports.circlePayCrons = circlePayCrons;
exports.circleBalanceCrons = circleBalanceCrons;
