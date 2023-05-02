import React, { useRef, useState } from "react";
import "./styles/all.scss";
import styled from "styled-components";
//Adding pages and Components
import Home from "./pages/index";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/SignUp";
import Library from "./components/Library";
import Nav from "./components/Nav";

import useCurrentSongStore from "./zustand/useCurrentSongStore";
import useSignInStore from "./zustand/useSignInStore";
import { useQuery } from "@apollo/client";
import { GET_songs } from "./utils/apolloGraphql";
import { Route, Routes } from "react-router-dom";
import AlertProvider from "./providers/AlertProvider";

function App() {
  const { token } = useSignInStore();
  const { currentSong, setCurrentSong, setSongs } = useCurrentSongStore();
  const [libraryStatus, setLibraryStatus] = useState(false);
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
    <AlertProvider>
      <StyleApp className={`${libraryStatus ? "library-active" : ""}`}>
        <Nav setLibraryStatus={setLibraryStatus} />
        <Routes>
          <Route path="/" element={<Home audioRef={audioRef} />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/registration" element={<SignUp />} />
        </Routes>
        <Library
          audioRef={audioRef}
          refetch={refetch}
          libraryStatus={libraryStatus}
        />
      </StyleApp>
    </AlertProvider>
  );
}

const StyleApp = styled.div`
  transition: all 0.5s ease;
`;

export default App;
