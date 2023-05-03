import React, { useState, useEffect } from "react";
import LibrarySong from "./LibrarySong";
import SearchedSong from "./SearchedSong";
import useCurrentSongStore from "../zustand/useCurrentSongStore";
import { useLazyQuery } from "@apollo/client";
import { GET_songs } from "../utils/apolloGraphql";

const Library = ({ audioRef, refetch, libraryStatus }) => {
  const { currentSong } = useCurrentSongStore();
  const [textInput, setTextInput] = useState("");

  const inputHandler = (e) => {
    setTextInput(e.target.value);
  };

  const [loadSongs] = useLazyQuery(GET_songs);

  if (!textInput) {
    refetch();
  }

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
          <LibrarySong
            audioRef={audioRef}
            refetch={refetch}
            textInput={textInput}
          />
        ) : (
          <h2>Empty</h2>
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
