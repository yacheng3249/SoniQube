const { gql } = require("apollo-server-lambda");

const typeDefs = gql`
  type Query {
    song(id: String): Song
    songs: [Song]
    user: User
  }

  type Mutation {
    signUp(name: String, email: String!, password: String!): UserResponse
    login(email: String!, password: String!): UserResponse
    updateUserInfo(userUpdateInput: UserUpdateInput): Response!
    checkEmail(email: String!): Response!
    sendVerificationCode(email: String!): Response!
    checkVerificationCode(email: String!, verificationCode: String!): Response!
    resetPassword(email: String!, password: String!): Response!
    deleteSong(id: String): Response!
    addSong(songInput: SongInput!): Response!
  }

  type Song {
    id: String
    name: String
    artist: String
    cover: String
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
    oldPassword: String
    newPassword: String
  }

  input SongInput {
    id: String
    name: String
    artist: String
    cover: String
    audio: String
    userId: String
  }
`;

module.exports = typeDefs;
