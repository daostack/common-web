import { FirebaseToolkit } from '@common/core';

FirebaseToolkit.InitializeFirebase();

export const db = FirebaseToolkit.getDb();

export const ProposalsCollection = db.collection('proposals');
export const PaymentsCollection = db.collection('payments');
export const CardsCollection = db.collection('cards');
export const UsersCollection = db.collection('users');
