import './util/logger';
import * as functions from 'firebase-functions';
import { runtimeOptions } from './constants';

import * as cron from './crons';
import * as event from './event';
import * as notification from './notification';
import * as messageTriggers from './discussionMessage/triggers';
import * as commonTriggers from './common/triggers';
import * as discussionTriggers from './discussion/triggers';
import * as permissionTriggers from './permissions/triggers';

import { circlePayApp, circlePayCrons } from './circlepay';
import { commonsApp } from './common';
import { proposalCrons, proposalTriggers, proposalsApp } from './proposals';
import { subscriptionsApp } from './subscriptions';
import { payoutTriggers } from './circlepay/payouts/triggers';
import { backofficeApp, circleBalanceCrons } from './backoffice';
import { metadataApp } from './metadata';
import { discussionApp } from './discussion';
import { graphApp } from './core';
// import { adminApp } from './core/domain/admin';
import { permissionApp } from './permissions';
import { dailySubscriptionCron } from './subscriptions/cron/dailySubscriptionCron';

// --- Express apps
export const commons = commonsApp;
export const metadata = metadataApp;
export const circlepay = circlePayApp;
export const proposals = proposalsApp;
export const subscriptions = subscriptionsApp;
export const backoffice = backofficeApp;
export const discussions = discussionApp;
// export const admin = adminApp;
export const permissions = permissionApp;
export const graph = functions
  .runWith(runtimeOptions)
  .https.onRequest(graphApp);

// --- Triggers and Subscriptions
exports.eventSub = event;
exports.notificationSub = notification;
exports.proposalCrons = proposalCrons;
exports.messageTriggers = messageTriggers;
exports.proposalTriggers = proposalTriggers;
exports.payoutTriggers = payoutTriggers;
exports.commonTriggers = commonTriggers;
exports.discussionTriggers = discussionTriggers;
exports.permissionTriggers = permissionTriggers;
exports.dailySubscriptionsCron = dailySubscriptionCron;

exports.cronJobs = cron;
exports.circlePayCrons = circlePayCrons;
exports.circleBalanceCrons = circleBalanceCrons;
