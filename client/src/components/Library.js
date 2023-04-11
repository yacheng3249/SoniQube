import React from "react";
import styled from "styled-components";
import LibrarySong from "./LibrarySong";
import useLibraryStatusStore from "../zustand/useLibraryStatusStore";

const Library = ({ audioRef }) => {
  const { libraryStatus } = useLibraryStatusStore();

  return (
    <StyleLibrary className={`${libraryStatus ? "active-library" : ""}`}>
      <h2>Library</h2>
      <LibrarySong audioRef={audioRef} />
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
