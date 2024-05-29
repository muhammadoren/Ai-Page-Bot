const axios = require('axios');

const apiKey = 'j86bwkwo-8hako-12C'; // This is your API Key
const apiUrl = 'https://liaspark.chatbotcommunity.ltd/@LianeAPI_Reworks/api/sumi'; // API URL

function sumiAPICommand(question) {
  return new Promise((resolve, reject) => {
    axios.get(apiUrl, {
      params: {
        key: apiKey,
        query: question,
      }
    }).then(response => {
      const message = response.data.message;
      if (message.length <= 2000) {
        resolve(message);
      } else {
        const chunks = splitMessageIntoChunks(message);
        resolve(chunks);
      }
    }).catch(error => {
      reject(error);
    });
  });
}

function splitMessageIntoChunks(message) {
  const chunkSize = 2000;
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}

module.exports = { sumiAPICommand };