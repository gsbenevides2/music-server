import axios from "axios";
import "dotenv/config";

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

const api = axios.create({
  baseURL: "https://api.spotify.com/v1/",
});

async function authenticate() {
  const response = await axios({
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: "grant_type=client_credentials",
  });
  return response.data.access_token;
}

interface Music {
  title: string;
  spotifyId: string;
  genre: string;
  year: string;
  artist: {
    name: string;
    spotifyId: string;
    image: string;
  };
  album: {
    name: string;
    spotifyId: string;
    image: string;
  };
}

export class Spotify {
  static async getMusic(id: string) {
    const accessToken = await authenticate();
    const responseMusic = await api({
      method: "get",
      url: `/tracks/${id}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const responseArtist = await api({
      method: "get",
      url: `/artists/${responseMusic.data.artists[0].id}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const musicData: Music = {
      title: responseMusic.data.name,
      spotifyId: responseMusic.data.id,
      genre: responseArtist.data.genres[0],
      year: responseMusic.data.album.release_date.split("-")[0],
      artist: {
        name: responseMusic.data.artists[0].name,
        spotifyId: responseMusic.data.artists[0].id,
        image: responseArtist.data.images[0].url,
      },
      album: {
        name: responseMusic.data.album.name,
        spotifyId: responseMusic.data.album.id,
        image: responseMusic.data.album.images[0].url,
      },
    };
    return musicData;
  }
}
