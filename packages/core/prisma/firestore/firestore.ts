import { FirebaseToolkit } from '@common/core';

FirebaseToolkit.InitializeFirebase();

export const db = FirebaseToolkit.getDb();