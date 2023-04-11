import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import useCurrentSongStore from "../zustand/useCurrentSongStore";
import usePlayingStatusStore from "../zustand/usePlayingStatusStore";
import { playAudio } from "../utils";
import { useQuery } from "@apollo/client";
import { GET_song, GET_songs } from "../utils/apolloGraphql";

const Player = ({ audioRef }) => {
  // const { currentSong, setCurrentSongForward, setCurrentSongBack } =
  //   useCurrentSongStore();
  const { currentId, setCurrentId, currentSong, setCurrentSong } =
    useCurrentSongStore();
  const { isPlaying, setPlayingStatus } = usePlayingStatusStore();
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
  });

  //Event Handlers
  const playSongHandler = () => {
    console.log(audioRef.current);
    if (isPlaying) {
      audioRef.current.pause();
      setPlayingStatus();
    } else {
      audioRef.current.play();
      setPlayingStatus();
    }
  };

  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;
    setSongInfo({
      ...songInfo,
      currentTime: current,
      duration,
    });
  };

  const getTime = (time) => {
    return (
      Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
    );
  };

  const dragHandler = (e) => {
    audioRef.current.currentTime = e.target.value;
    setSongInfo({ ...songInfo, currentTime: e.target.value });
  };

  const { data: songData, loading: get_song_loading } = useQuery(GET_song, {
    variables: {
      songId: currentId,
    },
    onError(error) {
      console.log(error);
    },
  });

  const { data: songsData, loading: get_songs_loading } = useQuery(GET_songs, {
    onError(error) {
      console.log(error);
    },
  });
  // const currentSong = songData?.song;
  const songs = songsData?.songs;

  const skipTrackHandler = (direction, currentSong) => {
    const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    if (direction === "skip-forward") {
      // setCurrentId(songs[(currentIndex + 1) % songs.length]);
      setCurrentSong(songs[(currentIndex + 1) % songs.length]);
    }
    if (direction === "skip-back") {
      const preIndex =
        (currentIndex - 1) % songs.length === -1
          ? songs.length - 1
          : currentIndex - 1;
      // setCurrentId(songs[preIndex]);
      setCurrentSong(songs[preIndex]);
    }
    console.log(audioRef.current);
    playAudio(isPlaying, audioRef);
  };

  const songEndHandler = async () => {
    const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    // setCurrentId(songs[(currentIndex + 1) % songs.length]);
    setCurrentSong(songs[(currentIndex + 1) % songs.length]);
    playAudio(isPlaying, audioRef);
  };

  return (
    <>
      {/* {get_songs_loading ? (
        <p>Loading...</p>
      ) : ( */}
      <PlayerContainer>
        <TimeControl>
          <p>{getTime(songInfo.currentTime)}</p>
          <input
            min={0}
            max={songInfo.duration || 0}
            value={songInfo.currentTime}
            onChange={dragHandler}
            type="range"
          />
          <p>{songInfo.duration ? getTime(songInfo.duration) : "0:00"}</p>
        </TimeControl>
        <PlayControl>
          <FontAwesomeIcon
            onClick={() => skipTrackHandler("skip-back", currentSong)}
            className="skip-back"
            size="2x"
            icon={faAngleLeft}
          />
          <FontAwesomeIcon
            onClick={playSongHandler}
            className="play"
            size="2x"
            icon={isPlaying ? faPause : faPlay}
          />
          <FontAwesomeIcon
            onClick={() => skipTrackHandler("skip-forward", currentSong)}
            className="skip-forward"
            size="2x"
            icon={faAngleRight}
          />
        </PlayControl>
      </PlayerContainer>
      {/* )} */}
      <audio
        ref={audioRef}
        src={currentSong.audio}
        onTimeUpdate={timeUpdateHandler}
        onLoadedMetadata={timeUpdateHandler}
        onEnded={songEndHandler}
      ></audio>
    </>
  );
};

const PlayerContainer = styled.div`
  min-height: 20vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const TimeControl = styled.div`
  display: flex;
  align-items: center;
  width: 50%;
  input {
    width: 100%;
    padding: 1rem 0rem;
    cursor: pointer;
  }
  p {
    padding: 1rem;
  }
  @media screen and (max-width: 768px) {
    width: 90%;
  }
`;

const PlayControl = styled.div`
  width: 30%;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  svg {
    cursor: pointer;
  }
  @media screen and (max-width: 768px) {
    width: 60%;
  }
`;

export default Player;
