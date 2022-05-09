import "dotenv/config";
import Knex from "knex";

// const sslEnabled = process.env.SSL_ENABLED === "true" ? { rejectUnauthorized: false} :
// const databaseString = process.env.DATABASE_URL + (sslEnabled ? "?ssl=true" : "");

export class Database {
  knex: ReturnType<typeof Knex>;
  private isLoaded = false;
  constructor() {
    this.knex = Knex({
      client: "pg",
      connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      },
    });
  }

  async loadDatabase() {
    if (this.isLoaded) return;

    // await this.knex.schema.raw("PRAGMA foreign_keys = ON");

    if ((await this.knex.schema.hasTable("artists")) === false) {
      await this.knex.schema.createTable("artists", (table) => {
        table.string("id").primary();
        table.string("name");
        table.string("spotifyId").unique();
        table.string("youtubeId").unique();
        table.string("deezerId").unique();
        table.string("image");
      });
    }

    if ((await this.knex.schema.hasTable("albums")) === false) {
      await this.knex.schema.createTable("albums", (table) => {
        table.string("id").primary();
        table.string("name");
        table.string("spotifyId").unique();
        table.string("youtubeId").unique();
        table.string("deezerId").unique();
        table.string("image");
        table.string("artistId").references("id").inTable("artists");
      });
    }

    if ((await this.knex.schema.hasTable("musics")) === false) {
      await this.knex.schema.createTable("musics", (table) => {
        table.string("id").primary();
        table.string("title").notNullable();
        table.string("spotifyId").unique();
        table.string("youtubeMusicId").unique();
        table.string("youtubeVideoId").unique();
        table.string("deezerId").unique();
        table.string("artistId").references("id").inTable("artists");
        table.string("albumId").references("id").inTable("albums");
        table.string("year");
        table.string("lyrics", 5000);
        table.string("lyricsTranslated", 5000).nullable();
        table.string("lyricsTimestamp", 2000);
      });
    }
    this.isLoaded = true;
  }
}
