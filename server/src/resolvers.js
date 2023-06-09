const { ForbiddenError } = require("apollo-server-lambda");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const store = new PrismaClient();
const nodemailer = require("nodemailer");
const { DateTime, Interval } = require("luxon");
const axios = require("axios");
const fs = require("fs");
// Define the number of saltRounds required for bcrypt encryption.
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
// Define the secret required for JWT (JSON Web Token) authentication.
const SECRET = process.env.JWT_SECRET;

// helper functions
const hash = (text) => bcrypt.hash(text, SALT_ROUNDS);

const createToken = ({ id, email, name }) =>
  jwt.sign({ id, email, name }, SECRET, {
    expiresIn: "1d",
  });

const isAuthenticated = (resolverFunc) => (parent, args, context) => {
  if (!context.user) throw new ForbiddenError("Please log in to SoniQube.");
  return resolverFunc.apply(null, [parent, args, context]);
};

const sendEmail = async (email, subject, content) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Outlook",
      auth: {
        user: process.env.SENDER_EMAIL_ADDRESS,
        pass: process.env.SENDER_EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL_ADDRESS,
      to: email,
      subject,
      html: content,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    return { success: false, message: error };
  }
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
        const isUserEmailDuplicate = await store.user.findUnique({
          where: { email },
        });
        if (isUserEmailDuplicate) {
          return {
            success: false,
            message:
              "That email address is already in use, please use a different email address.",
          };
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
          user: newUser,
        };
      } catch (error) {
        console.error(error);
        return { success: false, message: "Server Error" };
      }
    },

    login: async (root, { email, password }) => {
      try {
        // 1. Find the user corresponding to the given email.
        const user = await store.user.findFirst({ where: { email } });
        if (!user)
          return {
            success: false,
            message: "The email account does not exists.",
          };

        // 2. Compare the given password with the password stored in the database for the user.
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid)
          return { success: false, message: "Wrong Password" };

        // 3. Return a token if successful.
        const token = createToken(user);
        user.token = token;
        return { success: true, user };
      } catch (error) {
        console.error(error);
        return { success: false, message: "Server Error" };
      }
    },

    updateUserInfo: isAuthenticated(
      async (parent, { userUpdateInput }, { user }) => {
        try {
          //Filter empty values.
          const data = Object.keys(userUpdateInput).reduce((obj, key) => {
            if (userUpdateInput[key]) obj[key] = userUpdateInput[key];
            return obj;
          }, {});

          if ("newPassword" in data) {
            if ("oldPassword" in data) {
              const userInfo = await store.user.findUnique({
                where: { id: user.id },
              });
              if (
                !(await bcrypt.compare(data.oldPassword, userInfo.password))
              ) {
                return {
                  success: false,
                  message: "The old password is incorrect.",
                };
              }
            } else {
              return {
                success: false,
                message: "The old password is required.",
              };
            }

            data["password"] = await hash(data["newPassword"], SALT_ROUNDS);
            delete data.oldPassword;
            delete data.newPassword;
          }

          await store.user.update({
            where: { id: user.id },
            data: data,
          });
          return { success: true };
        } catch (error) {
          console.error(error);
          return { success: false, message: "Server Error" };
        }
      }
    ),

    checkEmail: async (parent, { email }) => {
      try {
        const existUser = await store.user.findUnique({
          where: { email },
        });

        return existUser
          ? { success: true }
          : { success: false, message: "This email is not valid." };
      } catch (error) {
        console.error(error);
        return { success: false, message: "Server Error" };
      }
    },

    sendVerificationCode: async (parent, { email }) => {
      try {
        const verificationCode = Array.from({ length: 6 })
          .map(() => "0123456789".substr(Math.random() * 10, 1))
          .join("");
        await store.verificationCode.create({
          data: {
            email,
            code: verificationCode,
          },
        });

        const response = await sendEmail(
          email,
          "Email Verification",
          `<h2>SoniQube Verification Code</h2><p>${verificationCode}</p>`
        );

        if (response.success) {
          return { success: true };
        } else {
          return { success: false, message: response.message };
        }
      } catch (error) {
        console.error(error);
        return { success: false, message: "Server Error" };
      }
    },

    checkVerificationCode: async (parent, { email, verificationCode }) => {
      try {
        const verificationInfo = await store.verificationCode.findFirst({
          where: { email },
          orderBy: [{ id: "desc" }],
        });

        if (!verificationInfo || verificationInfo.code !== verificationCode)
          return {
            success: false,
            message: "Wrong code, please try again",
          };

        if (
          Interval.fromDateTimes(
            DateTime.fromJSDate(verificationInfo.createdAt),
            DateTime.now().toJSDate()
          ).length("minutes") > 10
        ) {
          return {
            success: false,
            message: "This code has expired. Please request another code.",
          };
        }

        return { success: true };
      } catch (error) {
        console.error(error);
        return { success: false, message: "Server Error" };
      }
    },

    resetPassword: async (parent, { email, password }) => {
      try {
        await store.user.update({
          where: { email },
          data: { password: await hash(password, SALT_ROUNDS) },
        });
        return { success: true };
      } catch (error) {
        console.error(error);
        return { success: false, message: "Server Error" };
      }
    },

    deleteSong: isAuthenticated(async (_, { id }) => {
      try {
        await store.userSong.delete({
          where: { id },
        });
        return { success: true };
      } catch (error) {
        console.error(error);
        return { success: false, message: "Server Error" };
      }
    }),

    addSong: isAuthenticated(async (_, { songInput }, { user }) => {
      try {
        const { name, artist, cover, audio } = songInput;
        // // Download MP3 file.
        // const response = await axios({
        //   url: audio,
        //   method: "GET",
        //   responseType: "stream",
        // });
        // const fileName = name.replace(/\s+/g, "_");
        // const filePath = `${fileName}.mp3`;
        // // Create a writable stream to write music data to a file.
        // const writer = fs.createWriteStream(filePath);
        // response.data.pipe(writer);
        // await new Promise((resolve, reject) => {
        //   writer.on("finish", resolve);
        //   writer.on("error", reject);
        // });

        await store.userSong.create({
          data: {
            userId: user.id,
            name,
            artist,
            cover,
            audio,
          },
        });
        return { success: true };
      } catch (error) {
        console.error(error);
        return { success: false, message: "Server Error" };
      }
    }),
  },
};
