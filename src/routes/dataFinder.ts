import { Router } from "express";

import { Deezer } from "../classes/deezer";
import { GoogleSearch } from "../classes/googleSearch";
import { Lyrics } from "../classes/lyrics";
import { Spotify } from "../classes/spotify";
import { YouTubeMusic } from "../classes/youtubeMusic";

const dataFinderRoutes = Router();

dataFinderRoutes.get("/dataFinder/getSpotifyMusic", async (req, res) => {
  if (typeof req.query.spotifyId !== "string")
    return res.status(400).send("Missing spotifyId");

  const { spotifyId } = req.query;

  const spotifyMusic = await Spotify.getMusic(spotifyId as string);

  res.send(spotifyMusic);
});

dataFinderRoutes.get("/dataFinder/getDeezerMusic", async (req, res) => {
  if (typeof req.query.deezerId !== "string")
    return res.status(400).send("Missing deezerId");
  const { deezerId } = req.query;

  const deezerMusic = await Deezer.getMusic(deezerId as string);

  res.send(deezerMusic);
});

dataFinderRoutes.get("/dataFinder/getYouTubeMusic", async (req, res) => {
  if (typeof req.query.youtubeId !== "string")
    return res.status(400).send("Missing youtubeId");
  const { youtubeId } = req.query;
  const youtubeMusic = await YouTubeMusic.getMusic(youtubeId as string);
  res.send(youtubeMusic);
});

dataFinderRoutes.get(
  "/dataFinder/autoFillByTitleAndArtist",
  async (req, res) => {
    if (typeof req.query.title !== "string")
      return res.status(400).send("Missing title");
    if (typeof req.query.artist !== "string")
      return res.status(400).send("Missing artist");
    const { artist, title } = req.query;

    const result = await GoogleSearch.scrapDataFromMusic(
      artist as string,
      title as string
    );
    let spotifyMusic;

    if (result.spotifyId) {
      spotifyMusic = await Spotify.getMusic(result.spotifyId);
    } else spotifyMusic = null;

    let deezerMusic;
    if (result.deezerId) {
      deezerMusic = await Deezer.getMusic(result.deezerId);
    } else deezerMusic = null;

    let youtubeMusic;
    if (result.youtubeMusicId) {
      youtubeMusic = await YouTubeMusic.getMusic(result.youtubeMusicId);
    } else youtubeMusic = null;

    let l;
    if (spotifyMusic || deezerMusic) {
      const artistName =
        spotifyMusic?.artist.name || (deezerMusic?.artist.name as string);
      const titleName = spotifyMusic?.title || (deezerMusic?.title as string);
      l = await Lyrics.findLyrics(artistName, titleName);
    }

    res.send({
      spotifyMusic,
      deezerMusic,
      youtubeMusic,
      ...l,
    });
  }
);

dataFinderRoutes.get("/dataFinder/playYoutube", async (req, res) => {
  if (typeof req.query.youtubeId !== "string")
    return res.status(400).send("Missing youtubeId");

  YouTubeMusic.playMiddleware(req.query.youtubeId, res);
});

export default dataFinderRoutes;
