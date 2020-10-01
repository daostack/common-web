import axios from 'axios';
import FormData from 'form-data';


import { env } from '@env';
import { runTest } from '@helpers/runTest';
import { getArc, jsonRpcProvider } from '@settings';

runTest((funcs) => {
  describe('the services', () => {
    it('check if we are using development settings', async () => {
      const arc = await getArc();
      expect(env.environment).toEqual('dev');
      expect(arc.graphqlHttpProvider).toEqual('http://127.0.0.1:8000/subgraphs/name/daostack');
      expect(jsonRpcProvider).toEqual('http://127.0.0.1:8545');
    });

    it('check if services are running', async () => {
      const arc = await getArc();
      // Ganache should be running on jsonRPCProvider url - it response (with a 400 error)
      // if it is not, perhaps try `docker-compose up`
      try {
        await axios.get(jsonRpcProvider);
      } catch (e) {
        expect(e.response.status).toEqual(400);
      }


      // The graph should be running, and responds with a redirect code on a get request
      try {
        await axios.get(arc.graphqlHttpProvider);
      } catch (e) {
        expect(e.response.status).toEqual(400);
      }
    });

    it('should have firebase running', async () => {
      const res = await axios.get(env.firebase.functions.endpoints.tests + '/ping');

      expect(res).not.toBe(undefined);
      expect(res).not.toBe(null);

      expect(res.status).toBe(200);
      expect(res.statusText).toBe('OK');

      expect(res.data).toBe('pong');
    });

    it('should have working ipfs', async () => {
      const bodyFormData = new FormData();

      bodyFormData.append('file', 'hello');

      const res = await axios.post(`${env.graphql.ipfsProvider}/add`, bodyFormData, {
        headers: bodyFormData.getHeaders()
      });

      expect(res.status).toBe(200);
      expect(res.statusText).toBe('OK');
    });
  });
});