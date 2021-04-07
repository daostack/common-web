import { FirebaseToolkit } from './domain/toolkits/index';

// Initialize the Firebase before exporting anything that may use it
FirebaseToolkit.InitializeFirebase();

export { prisma } from './domain/toolkits/index';
export { logger } from './domain/utils/logger';


// Services
export { cardService } from './services/cards';
export { voteService } from './services/votes';
export { userService } from './services/users';
export { eventService } from './services/events';
export { commonService } from './services/commons';
export { paymentService } from './services/payments';
export { proposalService } from './services/proposals';

export { FirebaseToolkit };