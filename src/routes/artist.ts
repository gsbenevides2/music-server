import { Router } from "express";

import { Artist } from "../classes/artist";

const artistRoutes = Router();

artistRoutes.get("/artist/get", async (req, res) => {
  if (typeof req.query.artistId !== "string")
    return res.status(400).send("Missing artistId");
  const artist = await Artist.getArtist(req.query.artistId);
  res.send(artist);
});

artistRoutes.get("/artist/get/spotify", async (req, res) => {
  if (typeof req.query.spotifyId !== "string")
    return res.status(400).send("Missing spotifyId");

  const artistId = await Artist.getArtistIdBySpotifyId(req.query.spotifyId);
  if (!artistId) return res.sendStatus(404);
  const artist = await Artist.getArtist(artistId);
  res.send(artist);
});

artistRoutes.get("/artist/get/deezer", async (req, res) => {
  if (typeof req.query.deezerId !== "string")
    return res.status(400).send("Missing deezerId");

  const artistId = await Artist.getArtistIdByDeezerId(req.query.deezerId);
  if (!artistId) return res.sendStatus(404);
  const artist = await Artist.getArtist(artistId);
  res.send(artist);
});

artistRoutes.get("/artist/get/youtube", async (req, res) => {
  if (typeof req.query.youtubeId !== "string")
    return res.status(400).send("Missing youtubeId");

  const artistId = await Artist.getArtistIdByYoutubeId(req.query.youtubeId);
  if (!artistId) return res.sendStatus(404);
  const artist = await Artist.getArtist(artistId);
  res.send(artist);
});

artistRoutes.post("/artist/add", async (req, res) => {
  const artistWithoutId = req.body;
  const artist = await Artist.addArtist(artistWithoutId);
  res.send(artist);
});

artistRoutes.get("/artist/get/all", async (req, res) => {
  const artists = await Artist.getArtists();
  res.send(artists);
});

export default artistRoutes;
