import * as cron from './cron';
import * as event from './event';
import * as notification from './notification';
import * as circlepayTriggers from './circlepay/triggers';

import { circlepayApp } from './circlepay';
import { commonsApp } from './common';
import { proposalCrons, proposalsApp } from './proposals';

// --- Express apps
export const commons = commonsApp;
export const circlepay = circlepayApp;
export const proposals = proposalsApp;

// --- Triggers and Subscriptions
exports.eventSub = event;
exports.notificationSub = notification;
exports.circlepayTriggers = circlepayTriggers;
exports.proposalCrons = proposalCrons;

exports.cronJobs = cron;
