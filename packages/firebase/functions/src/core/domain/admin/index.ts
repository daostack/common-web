// import * as functions from 'firebase-functions';
// import { ApolloServer } from 'apollo-server-express';
//
// import { schema } from './adminSchema';
// import { commonApp } from '../../../util';
import { runtimeOptions } from '../../../constants';
// import { UnauthorizedError } from '../../../util/errors';
//
//
// export const server = new ApolloServer({
//   schema,
// });
//
// const app = commonApp(null, {
//   unauthenticatedRoutes: [
//     // '/graphql',
//   ],
// });
//
// const allowedIds = [
//   'H5ZkcKBX5eXXNyBiPaph8EHCiax2',
// ];
//
// app.use((req, res, next) => {
//   if (!allowedIds.includes(req.user.uid)) {
//     throw new UnauthorizedError();
//   } else {
//     return next();
//   }
// });
//
// server.applyMiddleware({
//   app,
// });
//
// export const adminApp = functions
//   .runWith(runtimeOptions)
//   .https.onRequest(app);