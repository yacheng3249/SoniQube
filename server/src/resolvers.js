const { ForbiddenError } = require("apollo-server");
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

const isAuthenticated = (resolverFunc) => (parent, args, context) => {
  if (!context.user) throw new ForbiddenError("Please log in.");
  return resolverFunc.apply(null, [parent, args, context]);
};

// resolvers
module.exports = {
  Query: {
    song: async (_, { id }) => {
      return store.userSong.findUnique({ where: { id } });
    },
    songs: isAuthenticated((_, args, { user }) => {
      return store.userSong.findMany({ where: { userId: user.id } });
    }),
    user: isAuthenticated((root, args, { user }) => {
      return store.user.findUnique({ where: { id: user.id } });
    }),
  },
  Mutation: {
    signUp: async (root, { name, email, password }) => {
      try {
        // Check if the email has been registered before.
        const isUserEmailDuplicate = await store.user.findFirst({
          where: { email },
        });
        if (isUserEmailDuplicate) {
          throw new Error(
            "That email address is already in use, please use a different email address."
          );
        }

        // Encrypt(加密) the password before storing it.
        const hashedPassword = await hash(password, SALT_ROUNDS);

        // Create new user
        const newUser = await store.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        });

        // Generate a token for the new user
        newUser.token = createToken(newUser);
        return {
          success: true,
          message: null,
          user: newUser,
        };
      } catch (error) {
        return { success: false, message: error };
      }
    },

    login: async (root, { email, password }) => {
      try {
        // 1. Find the user corresponding to the given email.
        const user = await store.user.findFirst({ where: { email } });
        if (!user) throw new Error("The email account does not exists.");

        // 2. Compare the given password with the password stored in the database for the user.
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) throw new Error("Wrong Password");

        // 3. Return a token if successful.
        const token = createToken(user);
        user.token = token;
        return { success: true, message: `Successfully login!`, user };
      } catch (error) {
        return { success: false, message: error };
      }
    },

    updateUserInfo: isAuthenticated(
      async (parent, { userUpdateInput }, { user }) => {
        //Filter empty values.
        const data = Object.keys(userUpdateInput).reduce((obj, key) => {
          if (userUpdateInput[key]) obj[key] = userUpdateInput[key];
          return obj;
        }, {});

        if ("password" in data) {
          const hashedPassword = await hash(data["password"], SALT_ROUNDS);
          data["password"] = hashedPassword;
        }

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
