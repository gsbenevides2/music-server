import "dotenv/config";
import puppeteer from "puppeteer";

export class Lyrics {
  static findLyrics(artist: string, title: string) {
    return new Promise<{ lyrics?: string; lyricsTranslated?: string }>(
      // eslint-disable-next-line no-async-promise-executor
      async (resolve) => {
        try {
          let trasnlationBlock = false;
          const browser = await puppeteer.launch({
            // executablePath: process.env.CHROME_PATH,
            // headless: false,
          });
          const page = await browser.newPage();

          await page.goto(
            "https://www.google.com/search?q=" +
              artist +
              " " +
              title +
              " lyrics"
          );
          const lyrics = await page.$eval(
            "div[data-lyricid]",
            (lyricsElement) => {
              const result = lyricsElement.innerHTML
                .replace(/<div jsname="U8S5sf" class="ujudUb">/gm, "\n\n")
                .replace(/<br>/gm, "\n")
                .replace(/<div jsname="U8S5sf" class="ujudUb WRZytc">/gm, "\n")
                .replace(/<[^>]*>/gm, "")
                .slice(2)
                .replace(/Ocorreu um erro.*/gm, "");

              return Promise.resolve(result);
            }
          );
          page.on("response", async (res) => {
            if (
              res
                .url()
                .includes("https://www.google.com/async/lyrics_translate") &&
              trasnlationBlock === false
            ) {
              trasnlationBlock = true;

              const content = await res.text();
              const trasnlationPure = content
                .replace(/<div jsname="U8S5sf" class="ujudUb">/gm, "\n\n")
                .replace(/<br>/gm, "\n")
                .replace(/<div jsname="U8S5sf" class="ujudUb WRZytc">/gm, "\n")
                .replace(/<[^>]*>/gm, "")
                .split("\n")
                .filter((line, index, array) => {
                  if (
                    index < 3 ||
                    index === array.length - 1 ||
                    line.length === 0 ||
                    lyrics.includes(line)
                  )
                    return false;
                  else return true;
                });
              let p = 0;
              const lyricsTranslated = lyrics
                .split("\n")
                .map((line, index) => {
                  if (line !== "") return trasnlationPure[p++];
                  else return "";
                })
                .join("\n");
              await browser.close();
              resolve({ lyrics, lyricsTranslated });
            }
          });

          await page.click("g-raised-button[jsname=LnRv2c]");
        } catch (e) {
          resolve({});
        }
      }
    );
  }
}
