import { Router } from "express";

import albumRoutes from "./album";
import artistRoutes from "./artist";
import dataFinderRoutes from "./dataFinder";
import musicRoutes from "./music";

const routes = Router();
routes.use(albumRoutes);
routes.use(artistRoutes);
routes.use(dataFinderRoutes);
routes.use(musicRoutes);

export default routes;
