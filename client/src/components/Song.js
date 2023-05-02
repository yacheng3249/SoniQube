import React from "react";
import useCurrentSongStore from "../zustand/useCurrentSongStore";
import usePlayingStatusStore from "../zustand/usePlayingStatusStore";

const Song = React.memo(() => {
  const { currentSong } = useCurrentSongStore();
  const { isPlaying } = usePlayingStatusStore();

  return (
    <div className="song-container">
      <img
        src={currentSong.cover}
        alt={currentSong.name}
        className={`${isPlaying ? "spin-begin" : "spin-pause"}`}
      />
      <h2>{currentSong.name}</h2>
      <h3>{currentSong.artist}</h3>
    </div>
  );
});

export default Song;
