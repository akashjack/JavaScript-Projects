require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('../URL Shortner/Data/db');
const shorturlModel = require('../URL Shortner/Models/shorturlModel');
const Counter = require('../URL Shortner/Models/counterModel');

const app = express();
const port = 3000;

// Database connection
db();

app.use(cors({ optionsSuccessStatus: 200 }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static(`${process.cwd()}/public`));

// Serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Test route
app.get('/api/hello', (req, res) => {
  res.json({ greeting: 'hello API' });
});

// Function to get the next sequence value for short_url
async function getNextSequenceValue(sequenceName) {
  const counter = await Counter.findByIdAndUpdate(
    sequenceName,
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return counter.sequence_value;
}

// URL Shortener - Create a shortened URL
app.post('/api/shorturl', async (req, res) => {
  try {
    const { url: client_req_url } = req.body;

    // Enhanced URL validation
    const urlPattern = /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!urlPattern.test(client_req_url)) {
      return res.json({ error: 'invalid url' });
    }

    // Get the next short_url number
    const short_url = await getNextSequenceValue('url_counter');

    const newURL = new shorturlModel({
      short_url,
      original_url: client_req_url,
    });

    await newURL.save();

    res.json({
      original_url: client_req_url,
      short_url,
    });
  } catch (err) {
    console.error('Error saving document:', err);
    res.status(500).json({ error: 'Failed to save URL' });
  }
});

// URL Shortener - Redirect using the short URL
app.get('/api/shorturl/:short_url', async (req, res) => {
  try {
    const { short_url } = req.params;
    const userRequestedUrl = await shorturlModel.findOne({ short_url });

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
