import supertest from 'supertest';

import { runTest } from '@helpers/runTest';
import { env } from '@env';

import "@functions";


runTest((funcs) => {
  const graphql = supertest(funcs.graphql);

  describe('Settings endpoint', () => {
    it('should be able to get settings endpoint', async () => {
      const res = await graphql.get('/settings');

      expect(res.body.message).toMatchSnapshot();
      expect(res.status).toBe(200);
    });

    it('should match current settings',  async () => {
      const res = await graphql.get('/settings');


      expect(res.body.currentEnvironment).toMatch(env.environment);
      expect(res.body.graphql.subgraph).toBe(env.graphql.subgraphName);
    });
  });
});
