import "dotenv/config";
import axios from "axios";
import { Response } from "express";
import ytdl from "ytdl-core";

type FindMusicDataByIdResult = {
  youtubeMusicId: string;
  title: string;
  year: string;
  artist: {
    youtubeId: string;
    name: string;
  };
  album: {
    youtubeId: string;
    name: string;
    image: string;
  };
} | null;

export class YouTubeMusic {
  static async getMusic(id: string): Promise<FindMusicDataByIdResult> {
    const response = await axios({
      url: "https://music.youtube.com/youtubei/v1/next",
      method: "POST",
      params: {
        alt: "json",
        key: "AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30",
      },
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7",
        "content-type": "application/json",
        cookie: process.env.YOUTUBE_MUSIC_COOKIE as string,
        origin: "https://music.youtube.com",
        "user-agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.41 Safari/537.36",
        "x-goog-authuser": "0",
        "x-origin": "https://music.youtube.com",
      },
      data: {
        enablePersistentPlaylistPanel: true,
        isAudioOnly: true,
        watchEndpointMusicSupportedConfigs: {
          watchEndpointMusicConfig: {
            hasPersistentPlaylistPanel: true,
            musicVideoType: "MUSIC_VIDEO_TYPE_ATV",
          },
        },
        playlistId: "RDAMVMQmL4Bes-obo",
        video_id: id,
        context: {
          client: {
            clientName: "WEB_REMIX",
            clientVersion: "0.1",
            hl: "en",
          },
          user: {},
        },
      },
    });
    const music =
      response.data.contents.singleColumnMusicWatchNextResultsRenderer
        .tabbedRenderer.watchNextTabbedResultsRenderer.tabs[0].tabRenderer
        .content.musicQueueRenderer.content.playlistPanelRenderer.contents[0]
        .playlistPanelVideoRenderer;
    const name = music.title.runs[0].text;
    const artistName = music.longBylineText.runs[0].text;
    const artistId =
      music.longBylineText.runs[0].navigationEndpoint.browseEndpoint.browseId;
    const albumName = music.longBylineText.runs[2].text;
    const albumId =
      music.longBylineText.runs[2].navigationEndpoint.browseEndpoint.browseId;
    const year = music.longBylineText.runs[4].text;
    const image = music.thumbnail.thumbnails[5].url;
    return {
      youtubeMusicId: id,
      title: name,
      year,
      artist: {
        youtubeId: artistId,
        name: artistName,
      },
      album: {
        youtubeId: albumId,
        name: albumName,
        image,
      },
    };
  }

  static async playMiddleware(id: string, res: Response) {
    const req = ytdl(`http://www.youtube.com/watch?v=${id}`, {
      filter: (format) => {
        return format.mimeType?.includes("audio/mp4") || false;
      },
    });
    req.on("info", (e: ytdl.videoInfo) => {
      const format = e.formats.find((format) =>
        format.mimeType?.includes("audio/mp4")
      );
      if (format) {
        res.set("Content-Type", format.mimeType);
        res.set("Content-Length", format.contentLength);
        res.set("Accept-Ranges", "bytes");
        req.pipe(res);
      }
    });
  }
}
