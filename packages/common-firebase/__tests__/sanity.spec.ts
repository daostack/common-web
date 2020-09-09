import { runTest } from '@helpers/runTest';
import axios from "axios"
import { env } from '@env';
import { arc, jsonRpcProvider } from '@functions/settings';

import '@functions';

runTest((funcs) => {
  it('check if we are using development settings', () => {
    expect(env.environment).toEqual("dev")
    expect(arc.graphqlHttpProvider).toEqual('http://127.0.0.1:8000/subgraphs/name/daostack')
    expect(jsonRpcProvider).toEqual('http://127.0.0.1:8545')
  })

  it("check if services are running", async () => {
    // Ganache should be running on jsonRPCPRovider url - it response (with a 400 error)
    // if it is not, perhaps try `docker-compose up`
    try {
      await axios.get(jsonRpcProvider)
    } catch (e) {
      expect(e.response.status).toEqual(400)
    }

    // the graph should be running, and responds with a redirect code on a get request
    try {
      await axios.get(arc.graphqlHttpProvider)
    } catch (e) {
      expect(e.response.status).toEqual(400)
    }
  })
})