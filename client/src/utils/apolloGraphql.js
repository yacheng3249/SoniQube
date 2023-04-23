import { gql } from "@apollo/client";

export const GET_song = gql`
  query Song($songId: String) {
    song(id: $songId) {
      id
      name
      artist
      cover
      active
      audio
    }
  }
`;

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
