import "dotenv/config";
import puppeteer from "puppeteer";

export class GoogleSearch {
  static scrapDataFromMusic(artist: string, title: string) {
    return new Promise<{
      youtubeMusicId?: string;
      spotifyId?: string;
      deezerId?: string;
      // eslint-disable-next-line no-async-promise-executor
    }>(async (resolve) => {
      const browser = await puppeteer.launch({
        // executablePath: process.env.CHROME_PATH,
        // headless: false,
        // devtools: true,
      });
      const page = await browser.newPage();
      await page.goto(
        "https://www.google.com/search?q=" + artist + " " + title
      );
      const musicsIds = await page.$$eval(".JkUS4b", (elements) => {
        console.log(elements);
        if (!elements) return Promise.resolve({});

        const youtubeMusicId = elements
          .find((element) => element.textContent === "YouTube Music")
          // @ts-ignore
          ?.href.replace("https://music.youtube.com/watch?v=", "")
          .replace(/&.*/gm, "");

        const spotifyId = elements
          .find((element) => element.textContent === "Spotify")
          // @ts-ignore
          ?.href.replace("https://open.spotify.com/track/", "")
          .replace(/\?.*/gm, "");

        const deezerId = elements
          .find((element) => element.textContent === "Deezer")
          // @ts-ignore
          ?.href.replace("https://www.deezer.com/track/", "")
          .replace(/\?.*/gm, "");

        return Promise.resolve({
          youtubeMusicId,
          spotifyId,
          deezerId,
        });
      });

      await browser.close();

      resolve({ ...musicsIds });
    });
  }

  static scrapDataFromArtist(artist: string) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<{ youtubeArtistId?: string }>(async (resolve) => {
      try {
        const browser = await puppeteer.launch({
          // executablePath: process.env.CHROME_PATH,
          // headless: false,
          // devtools: true,
        });
        const page = await browser.newPage();

        await page.goto(`https://www.google.com/search?q=${artist}`);
        const youtubeArtistId = await page.$eval(
          'span[data-original-name="YouTube Music"]',
          (element) => {
            // @ts-ignore
            const id = element.parentNode?.parentNode?.parentNode.href
              .replace("https://music.youtube.com/channel/", "")
              .replace(/\?.*/gm, "");
            return Promise.resolve(id);
          }
        );
        await browser.close();
        resolve({ youtubeArtistId });
      } catch (e) {
        resolve({});
      }
    });
  }
}
