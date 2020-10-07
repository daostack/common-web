const firestore = require('@google-cloud/firestore');
const dateformat = require('dateformat');

const client = new firestore.v1.FirestoreAdminClient();

const { CommonError } = require('../util/errors');

/**
 * Util for creating a firestore backup for the current
 * firebase project
 *
 * @returns {Promise} - the result of the backup
 */
exports.backup = () => {
  const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
  const databaseName = client.databasePath(projectId, '(default)');

  const timestamp = dateformat(Date.now(), 'isoDateTime');
  const bucket = projectId === 'common-staging-50741'
    ? `gs://common-staging-50741.appspot.com/backup/${timestamp}`
    : projectId === 'common-daostack'
  && `gs://common-daostack.appspot.com/backup/${timestamp}`;

  if(!bucket) {
    throw new CommonError('EnvironmentCommonError: cannot find the current GCloud project!');
  }

  return client.exportDocuments({
    name: databaseName,
    outputUriPrefix: bucket,
    collectionIds: []
  });
}