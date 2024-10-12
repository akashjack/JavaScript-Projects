require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const shortId = require('shortid');
const db = require('../URL Shortner/Data/db');
const shorturlModel = require('../URL Shortner/Models/shorturlModel');

db();
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/hello', (req, res) => {
  res.json({ greeting: 'hello API' });
});

var jsonParser = bodyParser.json();

app.post('/api/shorturl', jsonParser, async (req, res) => {
  try {
    let client_req_url = req.body.url;
    let suffix = shortId.generate();
    console.log('suffix', suffix);

    let newURL = new shorturlModel({
      short_url: __dirname + '/api/shorturl/' + suffix,
      original_url: client_req_url,
      suffix: suffix,
    });

    // Save the new URL (using async/await)
    await newURL.save();

    console.log('Document inserted successfully!');
    res.json({
      saved: true,
      short_url: newURL.short_url,
      original_url: newURL.original_url,
      suffix: newURL.suffix,
    });
  } catch (err) {
    console.error('Error saving document:', err);
    res.status(500).json({ error: 'Failed to save URL' });
  }
});

app.get('/api/shorturl/:suffix', async (req, res) => {
  try {
    let userGeneratedSuffix = req.params.suffix;

    // Find the URL (using async/await)
    let userRequestedUrl = await shorturlModel.findOne({ suffix: userGeneratedSuffix });

    if (!userRequestedUrl) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.json({
      usersuffix: userGeneratedSuffix,
      userRequestedUrl: userRequestedUrl,
    });
  } catch (err) {
    console.error('Error fetching document:', err);
    res.status(500).json({ error: 'Failed to fetch URL' });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
