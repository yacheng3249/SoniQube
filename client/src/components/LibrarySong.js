import React from "react";
import styled from "styled-components";
import useCurrentSongStore from "../zustand/useCurrentSongStore";
import usePlayingStatusStore from "../zustand/usePlayingStatusStore";
import { playAudio } from "../utils";
import { useQuery } from "@apollo/client";
import { GET_songs } from "../utils/apolloGraphql";

const LibrarySong = ({ audioRef }) => {
  // const { songs, setCurrentSong } = useCurrentSongStore();
  const { currentSong, setCurrentSong } = useCurrentSongStore();
  const { isPlaying } = usePlayingStatusStore();

  const songSelectHandler = async (song) => {
    setCurrentSong(song);
    // setCurrentId(song);
    //Check if the song is playing
    playAudio(isPlaying, audioRef);
  };

  const { data: songsData, loading: get_songs_loading } = useQuery(GET_songs, {
    onError(error) {
      console.log(error);
    },
  });
  const songs = songsData?.songs;

  return (
    <div>
      {!get_songs_loading &&
        songs.map((song) => (
          <LibrarySongs
            key={song.id}
            // className={`${song.active ? "selected" : ""}`}
            className={`${song.id === currentSong.id ? "selected" : ""}`}
            onClick={() => songSelectHandler(song)}
          >
            <img src={song.cover} alt={song.name} />
            <SongDescription>
              <h3>{song.name}</h3>
              <h4>{song.artist}</h4>
            </SongDescription>
          </LibrarySongs>
        ))}
    </div>
  );
};

const LibrarySongs = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  cursor: pointer;
  transition: background 0.5s ease;
  img {
    width: 30%;
  }
  &:hover {
    background: rgb(197, 212, 243);
  }
`;

const SongDescription = styled.div`
  padding-left: 1rem;
  h3 {
    font-size: 1rem;
  }
  h4 {
    font-size: 0.7rem;
  }
`;

export default LibrarySong;
