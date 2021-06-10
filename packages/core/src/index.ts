import { FirebaseToolkit, SendgridToolkit } from '@toolkits';

// Initialize the Firebase before exporting anything that may use it
FirebaseToolkit.InitializeFirebase();
SendgridToolkit.InitializeSendgrid();

export { logger } from '@logger';
export { circleClient } from '@clients';
export { prisma, pubSub } from '@toolkits';
export { allPermissions } from './domain/validation/permissions';

// Domain
export { CommonError } from '@errors';

// Services
export { roleService } from './services/roles';
export { cardService } from './services/cards';
export { voteService } from './services/votes';
export { userService } from './services/users';
export { wireService } from './services/wires';
export { eventService } from './services/events';
export { commonService } from './services/commons';
export { reportService } from './services/reports';
export { payoutsService } from './services/payouts';
export { paymentService } from './services/payments';
export { proposalService } from './services/proposals';
export { statisticService } from './services/statistics';
export { discussionService } from './services/discussions';
export { notificationService } from './services/notifications';
export { subscriptionService } from './services/subscriptions';
export { authorizationService } from './services/authorization';

export { FirebaseToolkit };