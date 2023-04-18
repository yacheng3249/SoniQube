const { gql } = require("../node_modules/apollo-server");

const typeDefs = gql`
  type Query {
    song(id: Int): Song
    songs: [Song]
    user(id: Int): User
  }

  type Mutation {
    signUp(name: String, email: String!, password: String!): User
    login(email: String!, password: String!): Token
    updateUserInfo(userUpdateInput: UserUpdateInput): User
    deleteSong(id: Int): Response!
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

  type Response {
    success: Boolean!
    message: String
  }

  input UserUpdateInput {
    name: String
    password: String
  }
`;

module.exports = typeDefs;
