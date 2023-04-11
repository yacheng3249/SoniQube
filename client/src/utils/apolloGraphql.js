import { gql } from "@apollo/client";

export const GET_song = gql`
  query Song($songId: Int) {
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
