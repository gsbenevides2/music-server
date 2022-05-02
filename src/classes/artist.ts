import { v4 as uuid } from "uuid";

import { Database } from "./database";

const database = new Database();

interface ArtistData {
  id: string;
  name: string;
  spotifyId: string;
  youtubeId: string;
  deezerId: string;
  image: string;
}

export class Artist {
  id: string;
  name: string;
  spotifyId: string;
  youtubeId: string;
  deezerId: string;
  image: string;

  constructor(artist: ArtistData) {
    this.id = artist.id;
    this.name = artist.name;
    this.spotifyId = artist.spotifyId;
    this.youtubeId = artist.youtubeId;
    this.deezerId = artist.deezerId;
    this.image = artist.image;
  }

  static async addArtist(artistWithoutId: Omit<ArtistData, "id">) {
    const id = uuid();
    const artist: ArtistData = { id, ...artistWithoutId };

    const artistInstance = new Artist(artist);

    await database.loadDatabase();

    await database.knex<ArtistData>("artists").insert(artist);
    return artistInstance;
  }

  static async getArtistIdBySpotifyId(spotifyId: string) {
    const artist = await database
      .knex<ArtistData>("artists")
      .select("id")
      .where({ spotifyId })
      .first();
    return artist?.id;
  }

  static async getArtistIdByDeezerId(deezerId: string) {
    const artist = await database
      .knex<ArtistData>("artists")
      .select("id")
      .where({ deezerId })
      .first();
    return artist?.id;
  }

  static async getArtistIdByYoutubeId(youtubeId: string) {
    const artist = await database
      .knex<ArtistData>("artists")
      .select("id")
      .where({ youtubeId })
      .first();
    return artist?.id;
  }

  static async getArtist(id: string) {
    await database.loadDatabase();
    const artist = await database
      .knex<ArtistData>("artists")
      .where({ id })
      .first();
    if (!artist) throw new Error("Artist not found");
    return new Artist(artist);
  }

  static async getArtists() {
    await database.loadDatabase();
    const artists = await database.knex<ArtistData>("artists").select("*");
    return artists.map((artist) => new Artist(artist));
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      spotifyId: this.spotifyId,
      youtubeId: this.youtubeId,
      deezerId: this.deezerId,
      image: this.image,
    };
  }
}
