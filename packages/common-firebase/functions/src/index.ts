import { env } from './env';
import { tests } from './tests';
import * as cron from './cron';
import graphqlTriggers from './graphql/util/triggers';
import * as notification from './notification';
import * as event from './event';
import * as circlepayTriggers from './circlepay/triggers';
import * as emailTriggers from './email/triggers';

import { createApp } from './creation';
import { graphqlApp } from './graphql';
import { relayerApp } from './relayer';
import { circlepayApp } from './circlepay';

// Add the __tests__ endpoints only if enabled
if(env.tests.enabled) {
  exports.tests = tests;
}

// --- Express apps
exports.create = createApp;
exports.relayer = relayerApp;
exports.graphql = graphqlApp;
exports.circlepay = circlepayApp;


// --- Triggers and Subscriptions
exports.graphqlSubs = graphqlTriggers;
exports.notificationSub = notification;
exports.eventSub = event;
exports.circlepayTriggers = circlepayTriggers;
exports.emailTriggers = emailTriggers

exports.cronJobs = cron.crons;
