import { Router } from "express";

import { Album } from "../classes/album";

const albumRoutes = Router();

albumRoutes.get("/album/get", async (req, res) => {
  if (typeof req.query.albumId !== "string")
    return res.status(400).send("Missing albumId");
  const album = await Album.getAlbum(req.query.albumId);
  res.send(album);
});

albumRoutes.get("/album/get/spotify", async (req, res) => {
  if (typeof req.query.spotifyId !== "string")
    return res.status(400).send("Missing spotifyId");

  const albumId = await Album.getAlbumIdBySpotifyId(req.query.spotifyId);
  if (!albumId) return res.sendStatus(404);
  const album = await Album.getAlbum(albumId);
  res.send(album);
});

albumRoutes.get("/album/get/deezer", async (req, res) => {
  if (typeof req.query.deezerId !== "string")
    return res.status(400).send("Missing deezerId");

  const albumId = await Album.getAlbumIdByDeezerId(req.query.deezerId);
  if (!albumId) return res.sendStatus(404);
  const album = await Album.getAlbum(albumId);
  res.send(album);
});

albumRoutes.get("/album/get/youtube", async (req, res) => {
  if (typeof req.query.youtubeId !== "string")
    return res.status(400).send("Missing youtubeId");

  const albumId = await Album.getAlbumIdByYoutubeId(req.query.youtubeId);
  if (!albumId) return res.sendStatus(404);
  const album = await Album.getAlbum(albumId);
  res.send(album);
});

albumRoutes.post("/album/add", async (req, res) => {
  const albumWithoutId = req.body;
  const album = await Album.addAlbum(albumWithoutId);
  res.send(album);
});

albumRoutes.get("/album/get/all", async (req, res) => {
  const albums = await Album.getAlbums();
  res.send(albums);
});

export default albumRoutes;
