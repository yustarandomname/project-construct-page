import express from 'express';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import cors from 'cors';

cors({ origin: true });

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Starting server at ${port}`);
});
app.use(express.json({ limit: '1mb' }));

// found on: https://reactgo.com/javascript-check-string-url/
function isURL(str) {
  const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}

// credit to [fireship.io]
async function scrapeMetatags(link) {
  const res = await fetch(link);

  const html = await res.text();
  const $ = cheerio.load(html);

  console.log(html);

  const getMetatag = (name) =>
    $(`meta[name=${name}]`).attr('content') ||
    $(`meta[name="og:${name}"]`).attr('content') ||
    $(`meta[name="twitter:${name}"]`).attr('content');

  return Promise(resolve => {
    resolve({
      url,
      title: $('title').first().text(),
      favicon: $('link[rel="shortcut icon"]').attr('href'),
      description: getMetatag('description'),
      image: getMetatag('image'),
      author: getMetatag('author'),
    })
  })
}

app.get("/scraper", async (request, response) => {
  const link = request.query.link;

  console.log(link);

  const res = await fetch(link);
  const html = await res.text();
  const $ = cheerio.load(html);

  const getMetatag = (name) =>
    $(`meta[name=${name}]`).attr('content') ||
    $(`meta[name="og:${name}"]`).attr('content') ||
    $(`meta[name="twitter:${name}"]`).attr('content');

  const data = {
    url: link,
    title: $('title').first().text(),
    favicon: $('link[rel="shortcut icon"]').attr('href'),
    description: getMetatag('description'),
    image: getMetatag('image'),
    author: getMetatag('author'),
  }

  response.send(JSON.stringify(data));

})