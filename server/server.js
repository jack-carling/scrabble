const { default: axios } = require('axios');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 5000;

app.get('/api', async (req, res) => {
  let response = {};
  const word = req.query.word;

  if (!word) {
    message = 'Word is missing.';
    handleError(res, message);
    return;
  }

  const dictionary = await axios.get(`https://scrabblewordfinder.org/dictionary/${word}`);
  let valid = dictionary.data.search(/<span class="green">Yes<\/span>/);
  valid = valid === -1 ? false : true;
  if (valid) {
    response.success = true;
    response.message = `${word} is a valid word.`;
  } else {
    response.success = false;
    response.message = `${word} is not a valid word.`;
  }
  res.json(response);
});

function handleError(res, message) {
  message = `Error: ${message}`;
  const response = { success: false, message };
  res.json(response);
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
