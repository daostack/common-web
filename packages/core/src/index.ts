import { FirebaseToolkit, SendgridToolkit } from '@toolkits';

// Initialize the Firebase before exporting anything that may use it
FirebaseToolkit.InitializeFirebase();
SendgridToolkit.InitializeSendgrid();

export { prisma, pubSub } from '@toolkits';
export { logger } from '@logger';

// Domain
export { CommonError } from '@errors';


// Services
export { cardService } from './services/cards';
export { voteService } from './services/votes';
export { userService } from './services/users';
export { eventService } from './services/events';
export { commonService } from './services/commons';
export { reportService } from './services/reports';
export { paymentService } from './services/payments';
export { proposalService } from './services/proposals';
export { discussionService } from './services/discussions';
export { notificationService } from './services/notifications';
export { authorizationService } from './services/authorization';

export { FirebaseToolkit };