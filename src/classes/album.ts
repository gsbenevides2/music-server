import { v4 as uuid } from "uuid";

import { Database } from "./database";

const database = new Database();

interface AlbumData {
  id: string;
  name: string;
  spotifyId: string;
  youtubeId: string;
  deezerId: string;
  image: string;
  artistId: string;
}

export class Album {
  id: string;
  name: string;
  spotifyId: string;
  youtubeId: string;
  deezerId: string;
  image: string;
  artistId: string;

  constructor(album: AlbumData) {
    this.id = album.id;
    this.name = album.name;
    this.spotifyId = album.spotifyId;
    this.youtubeId = album.youtubeId;
    this.deezerId = album.deezerId;
    this.image = album.image;
    this.artistId = album.artistId;
  }

  static async addAlbum(albumWithoutId: Omit<AlbumData, "id">) {
    const id = uuid();
    const album: AlbumData = { id, ...albumWithoutId };

    const albumInstance = new Album(album);

    await database.loadDatabase();

    await database.knex<AlbumData>("albums").insert(album);
    return albumInstance;
  }

  static async getAlbumIdBySpotifyId(spotifyId: string) {
    const album = await database
      .knex<AlbumData>("albums")
      .select("id")
      .where({ spotifyId })
      .first();
    return album?.id;
  }

  static async getAlbumIdByDeezerId(deezerId: string) {
    const album = await database
      .knex<AlbumData>("albums")
      .select("id")
      .where({ deezerId })
      .first();
    return album?.id;
  }

  static async getAlbumIdByYoutubeId(youtubeId: string) {
    const album = await database
      .knex<AlbumData>("albums")
      .select("id")
      .where({ youtubeId })
      .first();
    return album?.id;
  }

  static async getAlbum(id: string) {
    await database.loadDatabase();
    const album = await database
      .knex<AlbumData>("albums")
      .where({ id })
      .first();
    if (!album) throw new Error("Album not found");
    return new Album(album);
  }

  static async getAlbums() {
    await database.loadDatabase();
    const albums = await database.knex<AlbumData>("albums").select();
    return albums.map((album) => new Album(album));
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      spotifyId: this.spotifyId,
      youtubeId: this.youtubeId,
      deezerId: this.deezerId,
      image: this.image,
      artistId: this.artistId,
    };
  }
}
