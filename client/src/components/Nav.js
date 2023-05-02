import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

// memo avoids this component keeping re-rendering when is unnecessary during parent component is re-rendering
const Nav = React.memo(({ setLibraryStatus }) => {
  return (
    <div className="nav">
      <h1>
        <Link to="/">SoniQube</Link>
      </h1>
      <div className="menu">
        <Link to="/login">
          <FontAwesomeIcon size="2x" icon={faUserCircle} />
        </Link>
        <button onClick={() => setLibraryStatus((state) => !state)}>
          Library
        </button>
      </div>
    </div>
  );
});

export default Nav;
