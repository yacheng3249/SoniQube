const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const store = new PrismaClient();
// Define the number of saltRounds required for bcrypt encryption.
const SALT_ROUNDS = 2;
// Define the secret required for JWT (JSON Web Token) authentication.

// helper functions
const hash = (text) => bcrypt.hash(text, SALT_ROUNDS);

const express = require("express");
const { ApolloServer } = require("../node_modules/apollo-server");
const typeDefs = require("./schema");
// const resolvers = require("./resolvers");
const app = express();
const SECRET = "just_a_random_secret";

const createToken = ({ id, email, name }) =>
  jwt.sign({ id, email, name }, SECRET, {
    expiresIn: "1d",
  });

const users = [
  {
    id: 1,
    email: "fong@test.com",
    password: "$2b$04$wcwaquqi5ea1Ho0aKwkZ0e51/RUkg6SGxaumo8fxzILDmcrv4OBIO", // 123456
    name: "Fong",
  },
  {
    id: 2,
    email: "kevin@test.com",
    passwrod: "$2b$04$uy73IdY9HVZrIENuLwZ3k./0azDvlChLyY1ht/73N4YfEZntgChbe", // 123456
    name: "Kevin",
  },
  {
    id: 3,
    email: "mary@test.com",
    password: "$2b$04$UmERaT7uP4hRqmlheiRHbOwGEhskNw05GHYucU73JRf8LgWaqWpTy", // 123456
    name: "Mary",
  },
];

const findUserByUserId = (userId) =>
  users.find((user) => user.id === Number(userId));

const resolvers = {
  Query: {
    song: async (_, { id }) => {
      return store.song.findUnique({ where: { id } });
    },
    songs: async () => {
      return store.song.findMany();
    },
    user: (root, args, context) => {
      if (!context.user) throw new Error("Please log in.");
      return store.user.findUnique({ where: { id: context.user.id } });
    },
    // user: (root, args, { user }) => {
    //   console.log(user);
    //   if (!user) throw new Error("Plz Log In First");
    //   return findUserByUserId(user.id);
    // },
  },
  Mutation: {
    signUp: async (root, { name, email, password }, context) => {
      // 1. Check if the email has been registered before.
      const isUserEmailDuplicate = await store.user.findFirst({
        where: { email },
      });
      if (isUserEmailDuplicate) {
        throw new Error(
          "That email address is already in use, please use a different email address."
        );
      }

      // 2. Encrypt(加密) the password before storing it.
      const hashedPassword = await hash(password, SALT_ROUNDS);
      // 3. Create new user
      // return addUser({ name, email, password: hashedPassword });
      return store.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
    },

    login: async (root, { email, password }, context) => {
      // 1. Find the user corresponding to the given email.
      const user = await store.user.findFirst({ where: { email } });
      if (!user) throw new Error("The email account does not exists.");

      // 2. Compare the given password with the password stored in the database for the user.
      const passwordIsValid = await bcrypt.compare(password, user.password);
      if (!passwordIsValid) throw new Error("Wrong Password");

      // 3. Return a token if successful.
      const token = await createToken(user);
      return { token };
    },
    // login: async (root, { email, password }, context) => {
    //   // 1. 透過 email 找到相對應的 user
    //   const user = users.find((user) => user.email === email);
    //   if (!user) throw new Error("Email Account Not Exists");

    //   // 2. 將傳進來的 password 與資料庫存的 user.password 做比對
    //   const passwordIsValid = await bcrypt.compare(password, user.password);
    //   if (!passwordIsValid) throw new Error("Wrong Password");

    //   // 3. 成功則回傳 token
    //   return { token: await createToken(user) };
    // },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    // 1. 取出
    const token = req.headers["token"];
    if (token) {
      try {
        // 2. 檢查 token + 取得解析出的資料
        const user = await jwt.verify(token, SECRET);
        console.log("index:" + user);
        // 3. 放進 context
        return { user };
      } catch (e) {
        throw new Error("Your session expired. Sign in again.");
      }
    }
    // 如果沒有 token 就回傳空的 context 出去
    return {};
  },
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
