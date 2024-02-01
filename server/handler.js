process.env.SERVERLESS = true;
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const { ApolloServer } = require("apollo-server-lambda");
const typeDefs = require("./src/schema");
const resolvers = require("./src/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ event, context, express }) => {
    const token = event.headers["Authorization"];
    if (token && token.startsWith("Bearer ")) {
      try {
        const user = await jwt.verify(token.slice(7), process.env.JWT_SECRET);
        return {
          headers: event.headers,
          functionName: context.functionName,
          event,
          context,
          expressRequest: express.req,
          user,
        };
      } catch (e) {
        throw new Error("Your session expired. Sign in again.");
      }
    }
    return {
      headers: event.headers,
      functionName: context.functionName,
      event,
      context,
      expressRequest: express.req,
    };
  },
  playground: {
    endpoint: "/dev/graphql",
  },
});

exports.graphqlHandler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true,
  },
});
