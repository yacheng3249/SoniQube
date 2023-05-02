import React, { useState } from "react";
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

const Player = ({ audioRef }) => {
  const { currentSong, setCurrentSong, songs } = useCurrentSongStore();
  const { isPlaying, setPlayingStatus } = usePlayingStatusStore();
  const [isSongLoop, setSongLoopStatus] = useState(false);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  });

  //Event Handlers
  const playSongHandler = () => {
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

  const skipTrackHandler = async (direction, currentSong) => {
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
    if (!isSongLoop) {
      const currentIndex = songs.findIndex(
        (song) => song.id === currentSong.id
      );
      setCurrentSong(songs[(currentIndex + 1) % songs.length]);
      playAudio(isPlaying, audioRef);
    } else {
      playAudio(isPlaying, audioRef);
    }
  };

  const trackAnim = {
    transform: `translateX(${songInfo.animationPercentage}%)`,
  };

  return (
    <>
      <div className="player-container">
        <div className="time-control">
          <div className="time">
            <p>{getTime(songInfo.currentTime)}</p>
            <p>{songInfo.duration ? getTime(songInfo.duration) : "0:00"}</p>
          </div>
          <div className="track">
            <input
              min={0}
              max={songInfo.duration || 0}
              value={songInfo.currentTime}
              onChange={dragHandler}
              type="range"
            />
            <div style={trackAnim} className="animate-track"></div>
          </div>
        </div>
        <ul className="play-control">
          <li className="icon-button sm">
            <FontAwesomeIcon size="1x" icon={faRandom} />
          </li>
          <li className="icon-button md">
            <FontAwesomeIcon
              onClick={() => skipTrackHandler("skip-back", currentSong)}
              icon={faStepBackward}
            />
          </li>
          <li className="icon-button lg">
            <FontAwesomeIcon
              onClick={playSongHandler}
              size="1x"
              icon={isPlaying ? faPause : faPlay}
            />
          </li>
          <li className="icon-button md">
            <FontAwesomeIcon
              onClick={() => skipTrackHandler("skip-forward", currentSong)}
              icon={faStepForward}
            />
          </li>
          <li className="icon-button sm">
            <FontAwesomeIcon
              onClick={() => setSongLoopStatus(!isSongLoop)}
              size="1x"
              className={`${isSongLoop ? "button-active" : ""}`}
              icon={faCircleNotch}
            />
          </li>
        </ul>
      </div>
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

export default Player;
