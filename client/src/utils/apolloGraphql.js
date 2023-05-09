import { gql } from "@apollo/client";

export const GET_songs = gql`
  query Songs {
    songs {
      id
      name
      artist
      cover
      active
      audio
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation signUp($name: String, $email: String!, $password: String!) {
    signUp(name: $name, email: $email, password: $password) {
      success
      message
      user {
        id
        name
        email
        token
      }
    }
  }
`;

export const MUTATION_LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      message
      user {
        id
        email
        name
        token
      }
    }
  }
`;

export const GET_user = gql`
  query User {
    user {
      email
      id
      name
    }
  }
`;

export const delete_song = gql`
  mutation deleteSong($songId: String) {
    deleteSong(id: $songId) {
      success
      message
    }
  }
`;

export const add_song = gql`
  mutation addSong($songInput: SongInput!) {
    addSong(songInput: $songInput) {
      id
      name
      artist
      cover
      active
      audio
    }
  }
`;

export const UPDATE_MEMBER = gql`
  mutation updateUserInfo($userUpdateInput: UserUpdateInput) {
    updateUserInfo(userUpdateInput: $userUpdateInput) {
      name
    }
  }
`;

export const CHECK_EMAIL = gql`
  mutation checkEmail($email: String!) {
    checkEmail(email: $email) {
      success
      message
    }
  }
`;

export const SEND_VERIFICATIONCODE = gql`
  mutation sendVerificationCode($email: String!) {
    sendVerificationCode(email: $email) {
      success
      message
    }
  }
`;

export const CHECK_VERIFICATIONCODE = gql`
  mutation checkVerificationCode($email: String!, $verificationCode: String!) {
    checkVerificationCode(email: $email, verificationCode: $verificationCode) {
      success
      message
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation resetPassword($email: String!, $password: String!) {
    resetPassword(email: $email, password: $password) {
      success
      message
    }
  }
`;
