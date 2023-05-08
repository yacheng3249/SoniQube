import React, { useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_songs } from "./utils/apolloGraphql";
import "./styles/all.scss";
//Adding pages and Components
import Home from "./pages/index";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/SignUp";
import Profile from "./pages/profile";
import ForgetPassword from "./pages/forget-password";
import Library from "./components/Library";
import Nav from "./components/Nav";
import AlertProvider from "./providers/AlertProvider";
// state store
import useCurrentSongStore from "./zustand/useCurrentSongStore";
import useSignInStore from "./zustand/useSignInStore";

function App() {
  const { token } = useSignInStore();
  const { currentSong, setCurrentSong, setSongs } = useCurrentSongStore();
  const [libraryStatus, setLibraryStatus] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  //Ref
  const audioRef = useRef(null);

  const { data, loading, refetch } = useQuery(GET_songs, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    skip: !token,
    onCompleted({ songs }) {
      setSongs(songs);
      if (!currentSong) {
        setCurrentSong(songs[0]);
      }
    },
    onError() {
      return null;
    },
  });

  return (
    <AlertProvider>
      <div
        className={`app-style ${libraryStatus ? "library-active" : ""}`}
        onClick={() => setShowDropdown(false)}
      >
        <Nav
          setLibraryStatus={setLibraryStatus}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
        />
        <Routes>
          <Route path="/" element={<Home audioRef={audioRef} />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/registration" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reset_password" element={<ForgetPassword />} />
        </Routes>
        <Library
          audioRef={audioRef}
          refetch={refetch}
          libraryStatus={libraryStatus}
        />
      </div>
    </AlertProvider>
  );
}

export default App;
