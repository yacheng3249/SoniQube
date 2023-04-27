import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faStepBackward,
  faStepForward,
  faRandom,
  faCircleNotch,
} from "@fortawesome/free-solid-svg-icons";
import useCurrentSongStore from "../zustand/useCurrentSongStore";
import usePlayingStatusStore from "../zustand/usePlayingStatusStore";
import { playAudio } from "../utils";
import { useQuery } from "@apollo/client";
import { GET_song, GET_songs } from "../utils/apolloGraphql";

const Player = ({ audioRef }) => {
  // const { currentSong, setCurrentSongForward, setCurrentSongBack } =
  //   useCurrentSongStore();
  const { currentSong, setCurrentSong, songs } = useCurrentSongStore();
  const { isPlaying, setPlayingStatus } = usePlayingStatusStore();
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
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

    const roundedCurrent = Math.round(current);
    const roundedDuration = Math.round(duration);
    const percentage = Math.round((roundedCurrent / roundedDuration) * 100);
    setSongInfo({
      ...songInfo,
      currentTime: current,
      duration,
      animationPercentage: percentage,
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

  // const { data: songsData, loading: get_songs_loading } = useQuery(GET_songs, {
  //   fetchPolicy: "network-only",
  //   onError(error) {
  //     console.log(error);
  //     return null;
  //   },
  // });
  // // const currentSong = songData?.song;
  // const songs = songsData?.songs;

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
    playAudio(isPlaying, audioRef);
  };

  const songEndHandler = async () => {
    const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    // setCurrentId(songs[(currentIndex + 1) % songs.length]);
    setCurrentSong(songs[(currentIndex + 1) % songs.length]);
    playAudio(isPlaying, audioRef);
  };

  const trackAnim = {
    transform: `translateX(${songInfo.animationPercentage}%)`,
  };

  return (
    <>
      <PlayerContainer>
        <TimeControl>
          <div className="time">
            <p>{getTime(songInfo.currentTime)}</p>
            <p>{songInfo.duration ? getTime(songInfo.duration) : "0:00"}</p>
          </div>
          <div
            style={{
              background: "linear-gradient(to rihgt, #007cba, #005a87)",
            }}
            className="track"
          >
            <input
              min={0}
              max={songInfo.duration || 0}
              value={songInfo.currentTime}
              onChange={dragHandler}
              type="range"
            />
            <div style={trackAnim} className="animate-track"></div>
          </div>
        </TimeControl>
        <PlayControl>
          <IconButton>
            <FontAwesomeIcon size="1x" className="button-sm" icon={faRandom} />
          </IconButton>
          <IconButtonMd>
            <FontAwesomeIcon
              onClick={() => skipTrackHandler("skip-back", currentSong)}
              className="skip-back"
              icon={faStepBackward}
            />
          </IconButtonMd>
          <IconButtonLg>
            <FontAwesomeIcon
              onClick={playSongHandler}
              className="play"
              size="1x"
              icon={isPlaying ? faPause : faPlay}
            />
          </IconButtonLg>

          <IconButtonMd>
            <FontAwesomeIcon
              onClick={() => skipTrackHandler("skip-forward", currentSong)}
              className="skip-forward"
              icon={faStepForward}
            />
          </IconButtonMd>

          <IconButton>
            <FontAwesomeIcon
              size="1x"
              className="button-sm"
              icon={faCircleNotch}
            />
          </IconButton>
        </PlayControl>
      </PlayerContainer>
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
  .time {
    display: flex;
    justify-content: space-between;
    color: #a4b7be;
    font-weight: bold;
  }
  width: 50%;
  input {
    width: 100%;
    padding: 1rem 0rem;
    -webkit-appearance: none;
    background: transparent;
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
  margin: 3rem 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  list-style: none;
  color: #a4b7be;
  svg {
    cursor: pointer;
  }
  @media screen and (max-width: 768px) {
    width: 60%;
  }
`;

const IconButton = styled.li`
  width: 2rem;
  height: 2rem;
  opacity: 0.75;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 5px 5px 10px #d4d4d4, -5px -5px 10px #ffffff;
`;

const IconButtonMd = styled.li`
  width: 2.5rem;
  height: 2.5rem;
  opacity: 0.85;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 5px 5px 10px #d4d4d4, -5px -5px 10px #ffffff;
`;

const IconButtonLg = styled.li`
  width: 3.25rem;
  height: 3.25rem;
  box-shadow: inset 6px 6px 12px #c8c8c8, inset -6px -6px 12px #ffffff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 5px 5px 10px #d4d4d4, -5px -5px 10px #ffffff;
`;

export default Player;
