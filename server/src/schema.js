const { gql } = require("../node_modules/apollo-server");

const typeDefs = gql`
  type Query {
    song(id: String): Song
    songs: [Song]
    user: User
  }

  type Mutation {
    signUp(name: String, email: String!, password: String!): UserResponse
    login(email: String!, password: String!): UserResponse
    updateUserInfo(userUpdateInput: UserUpdateInput): User
    checkEmail(email: String!): Response!
    deleteSong(id: String): Response!
    addSong(songInput: SongInput!): Song
  }

  type Song {
    id: String
    name: String
    artist: String
    cover: String
    active: Boolean
    audio: String
  }

  type User {
    id: String
    name: String
    email: String
    token: String
    songs: [Song]
  }

  type Response {
    success: Boolean!
    message: String
  }

  type UserResponse {
    success: Boolean!
    message: String
    user: User
  }

  input UserUpdateInput {
    name: String
    password: String
  }

  input SongInput {
    id: String
    name: String
    artist: String
    cover: String
    active: Boolean
    audio: String
    userId: String
  }
`;

module.exports = typeDefs;
