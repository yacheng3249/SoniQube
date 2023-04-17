const { gql } = require("../node_modules/apollo-server");

const typeDefs = gql`
  type Query {
    song(id: Int): Song
    songs: [Song]
    user(id: Int): User
  }

  type Mutation {
    "register: email and passwrod are required."
    signUp(name: String, email: String!, password: String!): User
    login(email: String!, password: String!): Token
  }

  type Song {
    id: Int
    name: String
    artist: String
    cover: String
    active: Boolean
    audio: String
  }

  type User {
    id: Int
    email: String
    name: String
  }

  type Token {
    token: String!
  }
`;

module.exports = typeDefs;
