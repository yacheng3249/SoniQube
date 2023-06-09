process.env.SERVERLESS = true;
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const { ApolloServer } = require("apollo-server-lambda");
const typeDefs = require("./src/schema");
const resolvers = require("./src/resolvers");
const express = require("express");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ event, context, express }) => {
    const context = {
      secret: process.env.JWT_SECRET,
      saltRounds: Number(process.env.SALT_ROUNDS),
    };
    const token = event.headers.authorization;
    if (token && token.startsWith("Bearer ")) {
      try {
        // Check the token and retrieve the decoded data
        const user = await jwt.verify(token.slice(7), context.secret);
        // Put the data into the context
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
