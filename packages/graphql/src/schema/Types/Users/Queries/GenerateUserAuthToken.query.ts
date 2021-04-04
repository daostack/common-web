import { extendType, nonNull, stringArg } from 'nexus';
import admin from 'firebase-admin';
import axios from 'axios';


export const GenerateUserAuthTokenQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.string('generateUserAuthToken', {
      args: {
        authId: nonNull(stringArg())
      },
      resolve: async (root, args) => {
        const customToken = await admin
          .auth()
          .createCustomToken(args.authId);

        const res = await axios.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${process.env['Firebase.ApiKey']}`, {
          token: customToken,
          returnSecureToken: true
        });

        return res.data.idToken;
      }
    });
  }
});