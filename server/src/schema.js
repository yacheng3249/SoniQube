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
    deleteSong(id: Int): Response!
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
    "成功"
    success: Boolean!
    "訊息"
    message: String
    "會員"
    user: User
  }

  input UserUpdateInput {
    name: String
    password: String
  }
`;

module.exports = typeDefs;
