const express = require('express');
const bodyParser = require('body-parser');
const { handleMessage } = require('./handles/handleMessage');
const { handlePostback } = require('./handles/handlePostback');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

// Set the verify token and page access token
const VERIFY_TOKEN = 'pagebot';
// Read the token from the file
const PAGE_ACCESS_TOKEN = fs.readFileSync('token.txt', 'utf8');

// Verify that the verify token matches
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// Handle messages and postbacks
app.post('/webhook', (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        if (event.message) {
          handleMessage(event, PAGE_ACCESS_TOKEN);
        } else if (event.postback) {
          handlePostback(event, PAGE_ACCESS_TOKEN);
        }
      });
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});