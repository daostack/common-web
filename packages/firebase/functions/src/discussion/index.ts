import * as functions from 'firebase-functions';
import { commonApp, commonRouter } from '../util';
import { responseExecutor } from '../util/responseExecutor';
import { updateDiscussion } from './business';
const discussions = commonRouter();

const runtimeOptions = {
  timeoutSeconds: 540
};

discussions.post('/update', async (req, res, next) => (
  await responseExecutor(
    async () => {
      return await updateDiscussion({
        ...req.body,
        userId: req.user.uid
      });
    }, {
      req,
      res,
      next,
      successMessage: 'Discussion updated successfully'
    })
));

export const discussionApp = functions
  .runWith(runtimeOptions)
  .https.onRequest(commonApp(discussions));