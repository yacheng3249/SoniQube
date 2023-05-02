import React, { useState, useEffect } from "react";
import axios from "axios";
import { searchSongURL } from "../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { add_song } from "../utils/apolloGraphql";
import { useMutation } from "@apollo/client";
import { useAlert } from "../providers/AlertProvider";

const SearchedSong = ({ textInput, refetch }) => {
  const { alert } = useAlert();
  const [searchedSongData, setSearchedSongData] = useState([]);

  //使用 useEffect 來確保 fetchData 只會在 textInput 更改時執行，以避免不必要的 API 請求。當 fetchData 從 API 獲取到資料後，使用 setSearchedSongData 函數來更新 searchedSongData 狀態。在 return 中，使用條件渲染來確保 searchedSongData 存在時才呈現資料。
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(searchSongURL(textInput));
      setSearchedSongData(response.data.results);
    };
    fetchData();
  }, [textInput]);

  const [add_Song_Fn] = useMutation(add_song, {
    onCompleted() {
      alert("Song added", "", [
        {
          text: "CONFIRM",
        },
      ]);
      refetch();
    },
    onError(error) {
      console.log(error);
      return null;
    },
  });

  const songAddHandler = (song) => {
    const { name, artist_name, image, audio } = song;
    add_Song_Fn({
      variables: {
        songInput: {
          name,
          artist: artist_name,
          cover: image,
          active: false,
          audio,
        },
      },
    });
  };

  return (
    <div>
      {searchedSongData &&
        searchedSongData.map((song) => (
          <div className="librarySong-container" key={song.id}>
            <div className="song-info">
              <img src={song.image} alt={song.name} />
              <div className="song-description">
                <h3>{song.name}</h3>
                <h4>{song.artist_name}</h4>
              </div>
            </div>
            <FontAwesomeIcon
              size="1x"
              className="button-sm"
              icon={faPlus}
              onClick={() => songAddHandler(song)}
            />
          </div>
        ))}
    </div>
  );
};

export default SearchedSong;
