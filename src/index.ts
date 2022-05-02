import cors from "cors";
import express from "express";

import routes from "./routes";

const server = express();
server.use(express.json());
server.use(cors());
server.use(routes);

server.listen(3000, () => {
  console.log("Server started on port 3000");
});
