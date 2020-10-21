import { env } from './env';
import { tests } from './tests';
import * as cron from './cron';
import * as relayer from './relayer';
import * as graphql from './graphql';
import graphqlTriggers from './graphql/util/triggers';
import * as notification from './notification';
import * as event from './event';
import * as create from './creation';
import * as circlepay from './circlepay';
import * as circlepayTriggers from './circlepay/triggers';
import * as emailTriggers from './email/triggers';

// Add the __tests__ endpoints only if enabled
if(env.tests.enabled) {
  exports.tests = tests;
}

exports.relayer = relayer.relayer;
exports.graphql = graphql.graphql;
exports.graphqlSubs = graphqlTriggers;
exports.create = create.create;
exports.notificationSub = notification;
exports.eventSub = event;
exports.circlepay = circlepay.circlepay;
exports.circlepayTriggers = circlepayTriggers;
exports.emailTriggers = emailTriggers

exports.cronJobs = cron.crons;
