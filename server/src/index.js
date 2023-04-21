const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const { ApolloServer } = require("../node_modules/apollo-server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const context = {
      secret: process.env.SECRET,
      saltRounds: Number(process.env.SALT_ROUNDS),
    };
    const token = req.headers.authorization;
    if (token && token.startsWith("Bearer ")) {
      try {
        // Check the token and retrieve the decoded data
        const user = await jwt.verify(token.slice(7), context.secret);
        // Put the data into the context
        return { ...context, user };
      } catch (e) {
        throw new Error("Your session expired. Sign in again.");
      }
    }
    return context;
  },
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

console.log(server.context);
