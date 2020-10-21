import supertest from 'supertest';

import { runTest } from '../helpers/runTest';

import "../../functions/src";


runTest((funcs) => {
  const graphql = supertest(funcs.graphql);

  describe('Update dao by id ', () => {
    it('should fail if no id is provided', async () => {
      const res = await graphql.get('/update-dao-by-id');

      expect(res.ok).toBeFalsy();
      expect(res.status).toBe(500);

      expect(res.body.error).not.toBe(null);
      expect(res.body).toMatchSnapshot();
    });
  });
});
