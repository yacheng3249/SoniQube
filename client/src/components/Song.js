import React from "react";
import styled from "styled-components";
import useCurrentSongStore from "../zustand/useCurrentSongStore";
import { useQuery } from "@apollo/client";
import { GET_song } from "../utils/apolloGraphql";

const Song = () => {
  const { currentId, currentSong } = useCurrentSongStore();
  const { data: songData, loading: get_song_loading } = useQuery(GET_song, {
    variables: {
      songId: currentId,
    },
    onError(error) {
      console.log(error);
    },
  });
  // const currentSong = songData?.song;

  return (
    <>
      {/* {!get_song_loading && ( */}
      <SongContainer>
        <img src={currentSong.cover} alt={currentSong.name} />
        <h2>{currentSong.name}</h2>
        <h3>{currentSong.artist}</h3>
      </SongContainer>
      {/* )} */}
    </>
  );
};

const SongContainer = styled.div`
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    width: 20%;
    border-radius: 50%;
  }
  h2 {
    padding: 3rem 1rem 1rem;
  }
  h3 {
    font-size: 1rem;
  }
  @media screen and (max-width: 768px) {
    img {
      width: 60%;
    }
  }
`;

export default Song;
