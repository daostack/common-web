import admin from 'firebase-admin';

export const db = admin.firestore();

// ---- Reexports
export { externalRequestExecutor } from './externalRequestExecutor';
export { commonApp, commonRouter } from './commonApp';

