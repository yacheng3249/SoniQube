import React, { useState } from "react";
import styled from "styled-components";
import LibrarySong from "./LibrarySong";
import SearchedSong from "./SearchedSong";
import useLibraryStatusStore from "../zustand/useLibraryStatusStore";
import useSignInStore from "../zustand/useSignInStore";
import useCurrentSongStore from "../zustand/useCurrentSongStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faMinusCircle } from "@fortawesome/free-solid-svg-icons";

const Library = ({ audioRef, refetch }) => {
  const { libraryStatus } = useLibraryStatusStore();
  const { token } = useSignInStore();
  const { currentSong } = useCurrentSongStore();
  const [textInput, setTextInput] = useState("");

  const inputHandler = (e) => {
    setTextInput(e.target.value);
  };

  return (
    <StyleLibrary className={`${libraryStatus ? "active-library" : ""}`}>
      <form className="search">
        <div style={{ position: "relative" }}>
          <input type="text" onChange={inputHandler} value={textInput} />
          <button
            style={{ position: "absolute", right: 0 }}
            onClick={() => setTextInput("")}
          >
            X
          </button>
        </div>
        <button>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </form>
      <h2>Library</h2>
      {!textInput ? (
        currentSong ? (
          <LibrarySong audioRef={audioRef} />
        ) : (
          <h2>Empty</h2>
        )
      ) : (
        // <h2>please log in</h2>
        <SearchedSong textInput={textInput} refetch={refetch} />
      )}
    </StyleLibrary>
  );
};

const StyleLibrary = styled.div`
  background: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 20rem;
  height: 100%;
  box-shadow: 2px 2px 50px rgb(204, 204, 204);
  overflow: scroll;
  transform: translateX(-100%);
  transition: all 0.5s ease;
  opacity: 0;
  h2 {
    padding: 2rem;
  }
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

export default Library;
