require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const dns = require("dns");
const fs = require("fs");
const { url } = require("inspector");
const path = "./urls.json"; // Path to the JSON file
let urlDatabase = require(path);
// fs.writeFileSync(path, JSON.stringify({}, null, 2));

// Basic Configuration
const port = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(express.json());

// Middleware to parse URL-encoded data (form data)
app.use(express.urlencoded({ extended: true }));

app.use(cors());

function saveUrlMapping(originalUrl, shortUrl) {
  urlDatabase[shortUrl] = originalUrl;
  fs.writeFileSync(path, JSON.stringify(urlDatabase, null, 2)); // Write back to the file
}

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// // Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.get("/api/shorturl/:number?", function (req, res) {
  const shortUrl = req.params.number;
  console.log(shortUrl)
  if (urlDatabase[shortUrl]) {
    res.redirect(urlDatabase[shortUrl]);
  } else {
    res.send({ error: "No short URL found for the given input" });
  }
});

app.post("/api/shorturl", function (req, res) {
  console.log(req.body);
  try {
    urlString = new URL(req.body.url);
  } catch (e) {
    return res.json({ error: 'invalid url' });  
  }
  
  if (urlString.protocol !== 'http:' && urlString.protocol !== 'https:') {
    return res.json({ error: 'invalid url' });
  }

  const hostname = urlString.hostname;

  dns.lookup(hostname, (err, address) => {
    if (err) {
      return res.json({ error: 'invalid url' }); 
    }
    
    const shortUrl = Object.keys(urlDatabase).length + 1;
    urlDatabase[shortUrl] = req.body.url;
    
    res.json({
      original_url: req.body.url,
      short_url: shortUrl,
    });
  });
});



app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});