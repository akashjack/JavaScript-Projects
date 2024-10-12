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

// Database connection
db();

app.use(cors({ optionsSuccessStatus: 200 }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static(`${process.cwd()}/public`));

// Route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Test route
app.get('/api/hello', (req, res) => {
  res.json({ greeting: 'hello API' });
});

// URL Shortener - Create a shortened URL
app.post('/api/shorturl', async (req, res) => {
  try {
    const { url: client_req_url } = req.body;

    // Validate URL format
    const urlPattern = /^(https?:\/\/)(www\.)?[\w\-]+\.\w{2,}([\/\w\-]*)*$/;
    if (!urlPattern.test(client_req_url)) {
      return res.json({ error: 'invalid url' });
    }

    const suffix = shortId.generate();
    const newURL = new shorturlModel({
      short_url: suffix,
      original_url: client_req_url,
    });

    await newURL.save();

    res.json({
      saved: true,
      short_url: `/api/shorturl/${suffix}`,
      original_url: client_req_url,
    });
  } catch (err) {
    console.error('Error saving document:', err);
    res.status(500).json({ error: 'Failed to save URL' });
  }
});

// URL Shortener - Redirect using the short URL
app.get('/api/shorturl/:suffix', async (req, res) => {
  try {
    const { suffix } = req.params;
    const userRequestedUrl = await shorturlModel.findOne({ short_url: suffix });

    if (!userRequestedUrl) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Redirect to the original URL
    res.redirect(userRequestedUrl.original_url);
  } catch (err) {
    console.error('Error fetching document:', err);
    res.status(500).json({ error: 'Failed to fetch URL' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
