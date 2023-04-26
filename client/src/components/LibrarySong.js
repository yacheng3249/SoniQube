import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import useCurrentSongStore from "../zustand/useCurrentSongStore";
import usePlayingStatusStore from "../zustand/usePlayingStatusStore";
import useDialogStatusStore from "../zustand/useDialogStatusStore";
import { playAudio } from "../utils";

const LibrarySong = ({ audioRef }) => {
  const { currentSong, setCurrentSong, setSelectedDeleteSong, songs } =
    useCurrentSongStore();
  const { isPlaying } = usePlayingStatusStore();
  const { setDialogStatusActive, setDialogContent } = useDialogStatusStore();

  const songSelectHandler = async (song) => {
    setCurrentSong(song);
    playAudio(isPlaying, audioRef);
  };

  const songDeleteHandler = async (song) => {
    setSelectedDeleteSong(song);
    setDialogContent(
      "Are you sure you want to delete?",
      `${song.artist} - ${song.name}`
    );
    setDialogStatusActive();
  };

  return (
    <div>
      {songs.map((song) => (
        <LibrarySongs
          key={song.id}
          className={`${song.id === currentSong.id ? "selected" : ""}`}
        >
          <div onClick={() => songSelectHandler(song)}>
            <img src={song.cover} alt={song.name} />
            <SongDescription>
              <h3>{song.name}</h3>
              <h4>{song.artist}</h4>
            </SongDescription>
          </div>
          <FontAwesomeIcon
            size="1x"
            className="button-sm"
            icon={faTrash}
            onClick={() => songDeleteHandler(song)}
          />
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
  div {
    display: flex;
    img {
      width: 30%;
    }
  }
  &:hover {
    background: rgb(197, 212, 243);
  }
`;

const SongDescription = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 1rem;
  h3 {
    font-size: 1rem;
  }
  h4 {
    font-size: 0.7rem;
  }
`;

export default LibrarySong;
