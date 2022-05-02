import { Router } from "express";

import { Music } from "../classes/music";

const musicRoutes = Router();

musicRoutes.get("/music/get", async (req, res) => {
  if (typeof req.query.musicId !== "string")
    return res.status(400).send("Missing musicId");
  const music = await Music.getMusic(req.query.musicId);
  res.send(music);
});

musicRoutes.get("/music/get/all", async (req, res) => {
  const musics = await Music.getMusics();
  res.send(musics);
});

musicRoutes.post("/music/add", async (req, res) => {
  const musicWithoutId = req.body;
  const music = await Music.addMusic(musicWithoutId);
  res.send(music);
});

export default musicRoutes;
