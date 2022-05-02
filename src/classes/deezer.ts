import axios from "axios";

export interface DeezerMusic {
  title: string;
  deezerId: string;
  genre: string;
  year: string;
  artist: {
    name: string;
    deezerId: string;
    image: string;
  };
  album: {
    name: string;
    deezerId: string;
    image: string;
  };
}

export class Deezer {
  static async getMusic(id: string) {
    const responseMusic = await axios.get(`https://api.deezer.com/track/${id}`);
    const responseAlbum = await axios.get(
      `https://api.deezer.com/album/${responseMusic.data.album.id}`
    );

    const musicData: DeezerMusic = {
      title: responseMusic.data.title,
      deezerId: responseMusic.data.id.toString(),
      genre: responseAlbum.data.genres.data[0].name,
      year: responseAlbum.data.release_date.split("-")[0],
      artist: {
        name: responseMusic.data.artist.name,
        deezerId: responseMusic.data.artist.id.toString(),
        image: responseMusic.data.artist.picture_big,
      },
      album: {
        name: responseMusic.data.album.title,
        deezerId: responseMusic.data.album.id.toString(),
        image: responseMusic.data.album.cover_big,
      },
    };
    return musicData;
  }
}
