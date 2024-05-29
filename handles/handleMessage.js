const { callGeminiAPI } = require('../commands/callGeminiAPI');
const { sumiAPICommand } = require('../commands/sumiAPI');
const { sendMessage } = require('./sendMessage');

const AVAILABLE_COMMANDS = [
  'gemini - Ask a question to the Gemini AI',
  'hi - Say hello to the bot',
  'hello - Another way to greet the bot',
  'help - Show available commands',
  'how are you - Check how the bot is doing',
  'what\'s up - Casual greeting',
  'sumi (liaspark) - Execute the Sumi command'
];

function handleMessage(event, pageAccessToken) {
  const senderId = event.sender.id;
  const messageText = event.message.text.toLowerCase();

  // Define triggers for responses
  const triggers = ['gemini', 'hi', 'hello', 'help', 'how are you', 'what\'s up', 'sumi', 'sumi api'];

  // Check if any trigger is found in the message
  if (triggers.some(trigger => messageText.includes(trigger))) {
    if (messageText === 'help') {
      const helpMessage = `Here are the available commands:\n\n${AVAILABLE_COMMANDS.join('\n')}`;
      sendMessage(senderId, { text: helpMessage }, pageAccessToken);
      console.log('Commands loaded successfully');
    } else if (messageText.includes('sumi')) {
      // Execute the Sumi command
      const prompt = messageText.replace('sumi', '').trim();
      sumiAPICommand(prompt)
        .then(response => {
          sendMessage(senderId, { text: response }, pageAccessToken);
        })
        .catch(error => {
          console.error('Error calling Sumi API:', error);
          sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
        });
    } else if (messageText.includes('gemini')) {
      // Send a loading message
      sendMessage(senderId, { text: 'Please wait, I am processing your request...' }, pageAccessToken);

      // Call the Gemini API
      callGeminiAPI(messageText)
        .then(response => {
          sendMessage(senderId, { text: response }, pageAccessToken);
        })
        .catch(error => {
          console.error('Error calling Gemini API:', error);
          sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
        });
    }
  }
}

module.exports = { handleMessage };