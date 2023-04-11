const { gql } = require("../node_modules/apollo-server");

const typeDefs = gql`
  type Query {
    song(id: Int): Song
    songs: [Song]
  }

  type Song {
    id: Int
    name: String
    artist: String
    cover: String
    active: Boolean
    audio: String
  }
`;

module.exports = typeDefs;
