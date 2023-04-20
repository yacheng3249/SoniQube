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
    // 1. 取出
    const token = req.headers.authorization;
    if (token && token.startsWith("Bearer ")) {
      try {
        // 2. 檢查 token + 取得解析出的資料
        const user = await jwt.verify(token.slice(7), context.secret);
        // 3. 放進 context
        return { ...context, user };
      } catch (e) {
        throw new Error("Your session expired. Sign in again.");
      }
    }
    // 如果沒有 token 就回傳空的 context 出去
    return context;
  },
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

console.log(server.context);
