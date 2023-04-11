import React, { useRef, useEffect } from "react";
import styled from "styled-components";
//Adding Components
import Song from "./components/Song";
import Player from "./components/Player";
import Library from "./components/Library";
import Nav from "./components/Nav";
//Import Styles
import GlobalStyles from "./components/GlobalStyle";
import useLibraryStatusStore from "./zustand/useLibraryStatusStore";
import useCurrentSongStore from "./zustand/useCurrentSongStore";
import { useQuery } from "@apollo/client";
import { GET_song } from "./utils/apolloGraphql";

function App() {
  const { libraryStatus } = useLibraryStatusStore();
  const { currentId, setCurrentSong } = useCurrentSongStore();
  //Ref
  const audioRef = useRef(null);

  const { data, loading: get_song_loading } = useQuery(GET_song, {
    variables: {
      songId: currentId,
    },
    onError(error) {
      console.log(error);
    },
  });

  return (
    <StyleApp className={`${libraryStatus ? "library-active" : ""}`}>
      <GlobalStyles />
      <Nav />
      <Song />
      <Player audioRef={audioRef} />
      <Library audioRef={audioRef} />
    </StyleApp>
  );
}

const StyleApp = styled.div`
  transition: all 0.5s ease;
`;

export default App;
