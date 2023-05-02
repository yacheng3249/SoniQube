import React, { useState } from "react";
import LibrarySong from "./LibrarySong";
import SearchedSong from "./SearchedSong";
import useCurrentSongStore from "../zustand/useCurrentSongStore";

const Library = ({ audioRef, refetch, libraryStatus }) => {
  const { currentSong } = useCurrentSongStore();
  const [textInput, setTextInput] = useState("");

  const inputHandler = (e) => {
    setTextInput(e.target.value);
  };

  return (
    <div
      className={`library-container ${libraryStatus ? "active-library" : ""}`}
    >
      <form>
        <input
          type="search"
          placeholder="Search for songs"
          onChange={inputHandler}
          value={textInput}
        />
      </form>
      <h2>Library</h2>
      {!textInput ? (
        currentSong ? (
          <LibrarySong audioRef={audioRef} refetch={refetch} />
        ) : (
          <h2>Empty</h2>
        )
      ) : (
        <SearchedSong textInput={textInput} refetch={refetch} />
      )}
    </div>
  );
};

export default Library;
