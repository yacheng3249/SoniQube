import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { searchSongURL } from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { add_song } from "../utils/apolloGraphql";
import { useMutation } from "@apollo/client";

const SearchedSong = ({ textInput, refetch }) => {
  const [searchedSongData, setSearchedSongData] = useState(null);

  //使用 useEffect 來確保 fetchData 只會在 textInput 更改時執行，以避免不必要的 API 請求。當 fetchData 從 API 獲取到資料後，使用 setSearchedSongData 函數來更新 searchedSongData 狀態。在 return 中，使用條件渲染來確保 searchedSongData 存在時才呈現資料。
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(searchSongURL(textInput));
      setSearchedSongData(response.data.results);
    };
    console.log(searchedSongData);
    fetchData();
  }, [textInput]);

  const [add_Song_Fn, { loading }] = useMutation(add_song, {
    onCompleted({ addSong }) {
      alert("Song added!");
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
          <LibrarySongs key={song.id}>
            <div>
              <img src={song.image} alt={song.name} />
              <SongDescription>
                <h3>{song.name}</h3>
                <h4>{song.artist_name}</h4>
              </SongDescription>
            </div>
            <FontAwesomeIcon
              size="1x"
              className="button-sm"
              icon={faPlus}
              onClick={() => songAddHandler(song)}
            />
          </LibrarySongs>
        ))}
    </div>
  );
};

const LibrarySongs = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  cursor: pointer;
  transition: background 0.5s ease;
  div {
    display: flex;
    img {
      width: 30%;
    }
  }
  &:hover {
    background: rgb(197, 212, 243);
  }
`;

const SongDescription = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 1rem;
  h3 {
    font-size: 1rem;
  }
  h4 {
    font-size: 0.7rem;
  }
`;

export default SearchedSong;
