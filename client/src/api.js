export const searchSongURL = (song_name) =>
  `https://api.jamendo.com/v3.0/tracks/?client_id=${process.env.JAMENDO_API_KEY}&search=${song_name}`;
