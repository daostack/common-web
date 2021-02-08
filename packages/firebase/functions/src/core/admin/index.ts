import { ApolloServer } from 'apollo-server';
import { schema } from './adminSchema';


export const server = new ApolloServer({
  schema
});

server.listen({ port: 2000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});