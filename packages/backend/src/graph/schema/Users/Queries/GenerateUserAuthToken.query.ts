import rp from 'request-promise';
import admin from 'firebase-admin';
import { extendType, nonNull, stringArg } from 'nexus';


export const GenerateUserAuthTokenQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.string('generateUserAuthToken', {
      args: {
        authId: nonNull(stringArg())
      },
      resolve: async (root, args) => {
        // const customToken = admin
        //   .auth()
        //   .createCustomToken(args.authId);

        // const res = await axios.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${process.env['Firebase.ApiKey']}`, {
        //   token: customToken,
        //   returnSecureToken: true
        // })

        const customToken = await admin.auth().createCustomToken(args.authId);
        const res = await rp({
          url: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${process.env['Firebase.ApiKey']}`,
          method: 'POST',
          body: {
            token: customToken,
            returnSecureToken: true
          },
          json: true
        });

        console.log(res);

        return res.idToken;
      }
    });
  }
});