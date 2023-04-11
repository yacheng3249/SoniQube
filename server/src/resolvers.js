const { PrismaClient } = require("@prisma/client");
const store = new PrismaClient();

module.exports = {
  Query: {
    song: async (_, { id }) => {
      return store.song.findUnique({ where: { id } });
    },
    songs: async () => {
      return store.song.findMany();
    },
  },
};
