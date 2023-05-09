import React, { useState } from "react";
import LibrarySong from "./LibrarySong";
import SearchedSong from "./SearchedSong";
import useCurrentSongStore from "../zustand/useCurrentSongStore";

const Library = ({ audioRef, refetch, libraryStatus, setLibraryStatus }) => {
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
      <div className="library-nav">
        <h2>Library</h2>
        <button onClick={() => setLibraryStatus((state) => !state)}>
          Player
        </button>
      </div>

      {!textInput ? (
        currentSong ? (
          <LibrarySong
            audioRef={audioRef}
            refetch={refetch}
            textInput={textInput}
          />
        ) : (
          <p>Add some songs and enjoy your day!</p>
        )
      ) : (
        <SearchedSong
          textInput={textInput}
          refetch={refetch}
          audioRef={audioRef}
        />
      )}
    </div>
  );
};

export default Library;
