const { context } = require("./index.js");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const store = new PrismaClient();
// Define the number of saltRounds required for bcrypt encryption.
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
// Define the secret required for JWT (JSON Web Token) authentication.
const SECRET = process.env.SECRET;

// helper functions
const hash = (text) => bcrypt.hash(text, SALT_ROUNDS);

const createToken = ({ id, email, name }) =>
  jwt.sign({ id, email, name }, SECRET, {
    expiresIn: "1d",
  });

const { ForbiddenError } = require("../node_modules/apollo-server");
const isAuthenticated = (resolverFunc) => (parent, args, context) => {
  if (!context.user) throw new ForbiddenError("Please log in.");
  return resolverFunc.apply(null, [parent, args, context]);
};

module.exports = {
  Query: {
    song: async (_, { id }) => {
      return store.song.findUnique({ where: { id } });
    },
    songs: async () => {
      return store.song.findMany();
    },
    user: isAuthenticated((root, args, { user }) => {
      console.log(`resolver檔: ${user}`);
      return store.user.findUnique({ where: { id: user.id } });
    }),
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

    updateUserInfo: isAuthenticated(
      async (parent, { userUpdateInput }, context) => {
        //Filter empty values.
        const data = Object.keys(userUpdateInput).reduce((obj, key) => {
          if (userUpdateInput[key]) obj[key] = userUpdateInput[key];
          return obj;
        }, {});

        if ("password" in data) {
          const hashedPassword = await hash(data["password"], SALT_ROUNDS);
          data["password"] = hashedPassword;
        }
        const { user } = context;
        return store.user.update({
          where: { id: user.id },
          data: data,
        });
      }
    ),

    deleteSong: isAuthenticated(async (_, { id }) => {
      try {
        await store.song.delete({
          where: { id },
        });
        return { success: true, message: `Song(id: ${id}) has been deleted.` };
      } catch (error) {
        return { success: false, message: error };
      }
    }),
  },
};
