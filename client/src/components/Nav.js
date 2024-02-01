import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useSignInStore from "../zustand/useSignInStore";
import useCurrentSongStore from "../zustand/useCurrentSongStore";
import usePlayingStatusStore from "../zustand/usePlayingStatusStore";

// memo avoids this component keeping re-rendering when is unnecessary during parent component is re-rendering
const Nav = React.memo(
  ({ setLibraryStatus, showDropdown, setShowDropdown }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { token, removeToken } = useSignInStore();
    const { removeCurrentSong } = useCurrentSongStore();
    const { isPlaying, setPlayingStatus } = usePlayingStatusStore();

    const handleLogOut = () => {
      removeToken();
      removeCurrentSong();
      if (isPlaying) setPlayingStatus();
      if (location.pathname !== "/") navigate("/");
    };

    const handleDropdownClick = (event) => {
      event.stopPropagation();
    };

    return (
      <div className="nav">
        <h1>
          <Link to="/">SoniQube</Link>
        </h1>
        <div className="menu">
          {token ? (
            <div onClick={handleDropdownClick}>
              <FontAwesomeIcon
                size="2x"
                icon={faUserCircle}
                onClick={() => setShowDropdown((prev) => !prev)}
              />
              {showDropdown && (
                <ul
                  className="dropdown-content"
                  onClick={() => setShowDropdown(false)}
                >
                  <li>
                    <Link to="/profile" onClick={() => setPlayingStatus()}>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/">Settings</Link>
                  </li>
                  <li>
                    <a onClick={() => handleLogOut()}>Logout</a>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <Link to="/login">
              <FontAwesomeIcon size="2x" icon={faUserCircle} />
            </Link>
          )}

          <button onClick={() => setLibraryStatus((state) => !state)}>
            Library
          </button>
        </div>
      </div>
    );
  }
);

export default Nav;
