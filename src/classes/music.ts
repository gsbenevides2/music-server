import { v4 as uuid } from "uuid";

import { Database } from "./database";

interface MusicData {
  id: string;
  title: string;
  spotifyId: string;
  youtubeMusicId: string;
  youtubeVideoId: string;
  deezerId: string;
  artistId: string;
  albumId: string;
  lyrics: string;
  lyricsTranslated?: string;
  lyricsTimestamp: string;
  year: string;
}

const database = new Database();

export class Music {
  id: string;
  title: string;
  spotifyId: string;
  youtubeMusicId: string;
  youtubeVideoId: string;
  deezerId: string;
  artistId: string;
  albumId: string;
  lyrics: string;
  lyricsTranslated?: string;
  lyricsTimestamp: string;
  year: string;

  constructor(music: MusicData) {
    this.id = music.id;
    this.title = music.title;
    this.spotifyId = music.spotifyId;
    this.youtubeMusicId = music.youtubeMusicId;
    this.youtubeVideoId = music.youtubeVideoId;
    this.deezerId = music.deezerId;
    this.artistId = music.artistId;
    this.albumId = music.albumId;
    this.lyrics = music.lyrics;
    this.lyricsTranslated = music.lyricsTranslated;
    this.lyricsTimestamp = music.lyricsTimestamp;
    this.year = music.year;
  }

  static async addMusic(musicWithoutId: Omit<MusicData, "id">) {
    const id = uuid();
    const music: MusicData = { id, ...musicWithoutId };

    const musicInstance = new Music(music);

    await database.loadDatabase();

    await database.knex<MusicData>("musics").insert(music);
    return musicInstance;
  }

  static async getMusic(id: string) {
    await database.loadDatabase();

    const music = await database
      .knex<MusicData>("musics")
      .where({ id })
      .first();

    if (!music) throw new Error("Music not found");

    return new Music(music);
  }

  static async getMusics() {
    await database.loadDatabase();

    const musics = await database.knex<MusicData>("musics").select();

    return musics.map((music) => new Music(music));
  }

  toJson() {
    return {
      id: this.id,
      title: this.title,
      spotifyId: this.spotifyId,
      youtubeMusicId: this.youtubeMusicId,
      youtubeVideoId: this.youtubeVideoId,
      deezerId: this.deezerId,
      artistId: this.artistId,
      albumId: this.albumId,
      lyrics: this.lyrics,
      lyricsTranslated: this.lyricsTranslated,
      lyricsTimestamp: this.lyricsTimestamp,
      year: this.year,
    };
  }
}
