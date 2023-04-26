import React, { useRef } from "react";
import styled from "styled-components";
//Adding pages and Components
import Home from "./pages/index";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/SignUp";
import Library from "./components/Library";
import Nav from "./components/Nav";
import ConfirmationDialog from "./components/ConfirmationDialog";
//Import Styles
import GlobalStyles from "./components/GlobalStyle";
import useLibraryStatusStore from "./zustand/useLibraryStatusStore";
import useDialogStatusStore from "./zustand/useDialogStatusStore";
import useCurrentSongStore from "./zustand/useCurrentSongStore";
import useSignInStore from "./zustand/useSignInStore";
import { useQuery } from "@apollo/client";
import { GET_songs } from "./utils/apolloGraphql";
import { Route, Routes } from "react-router-dom";

function App() {
  const { token } = useSignInStore();
  const { libraryStatus } = useLibraryStatusStore();
  const { currentSong, setCurrentSong, setSongs } = useCurrentSongStore();
  const { dialogStatus } = useDialogStatusStore();
  //Ref
  const audioRef = useRef(null);

  const { data, loading, refetch } = useQuery(GET_songs, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
    skip: !token,
    onCompleted({ songs }) {
      setSongs(songs);
      if (!currentSong) {
        setCurrentSong(songs[0]);
      }
    },
    onError(error) {
      return null;
    },
  });

  return (
    <StyleApp className={`${libraryStatus ? "library-active" : ""}`}>
      <GlobalStyles />
      <Nav />
      <Routes>
        <Route path="/" element={<Home audioRef={audioRef} />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/registration" element={<SignUp />} />
      </Routes>
      <Library audioRef={audioRef} refetch={refetch} />
      {dialogStatus ? <ConfirmationDialog refetch={refetch} /> : ""}
    </StyleApp>
  );
}

const StyleApp = styled.div`
  transition: all 0.5s ease;
`;

export default App;
