const functions = require("firebase-functions");
const requestPromise = require("request-promise-native");
const cors = require("cors");
const express = require("express");

const app = express();

// CORS対策
// すべての外部からのリクエストを受け付ける
app.use(cors());

const BASE_KEY = "https://note.com/shimotsu_";
const KEY_ALL = BASE_KEY + "/rss";
const KEY_MAGAZINE = BASE_KEY + "/m/m5774f6fe2c0b/rss";

const getRSS = async (key) => {
  const result = await requestPromise(key);
  return result;
};

app.get("/magazine", async (req, res) => {
  res.set("Cache-Control", "public, max-age=300, s-maxage=600");
  getRSS(KEY_MAGAZINE).then((response) => res.send(response));
});
app.get("/all", async (req, res) => {
  res.set("Cache-Control", "public, max-age=300, s-maxage=600");
  getRSS(KEY_ALL).then((response) => res.send(response));
});

const api = functions.https.onRequest(app);
module.exports = {api};
