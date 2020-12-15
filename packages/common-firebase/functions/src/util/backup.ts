import moment from 'moment';
import { firestore } from 'firebase-admin';
import { env } from '../constants';

const client = new firestore.v1.FirestoreAdminClient();

/**
 * Util for creating a firestore backup for the current
 * firebase project
 *
 * @returns - the result of the backup
 */
export const backup = (): Promise<any> => {
  const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
  const databaseName = client.databasePath(projectId, '(default)');

  const date = moment(new Date());

  const bucketPrefix = `${env.storage.bucket}/backup/${date.format()}`;


  return client.exportDocuments({
    name: databaseName,
    outputUriPrefix: bucketPrefix,
    collectionIds: []
  });
};