export const searchSongURL = (song_name) =>
  `https://api.jamendo.com/v3.0/tracks/?client_id=${process.env.REACT_APP_JAMENDO_CLIENT_ID}&format=jsonpretty&limit=20&search=${song_name}`;
