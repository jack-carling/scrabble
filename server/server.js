const { default: axios } = require('axios');
const path = require('path');
const express = require('express');
const app = express();
const history = require('connect-history-api-fallback');

app.use(
  history({
    rewrites: [
      {
        from: /^\/api\.*$/,
        to: function (context) {
          return context.parsedUrl.path;
        },
      },
      {
        from: /^\/sse\/.*$/,
        to: function (context) {
          return context.parsedUrl.path;
        },
      },
    ],
  })
);

app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/api', async (req, res) => {
  let response = {};
  const word = req.query.word;
  const lang = req.query.lang;

  if (!word) {
    message = 'Word is missing.';
    handleError(res, message);
    return;
  }

  if (!lang) {
    message = 'Language is missing.';
    handleError(res, message);
    return;
  }

  let dictionary, valid;

  if (lang === 'en') {
    try {
      dictionary = await axios.get(`https://scrabblewordfinder.org/dictionary/${word}`);
    } catch (error) {
      console.log(error);
    }
    valid = dictionary.data.search(/<span class="green">Yes<\/span>/);
    valid = valid === -1 ? false : true;
  } else if (lang === 'sv') {
    try {
      dictionary = await axios.get('https://svenska.se/saol/', { params: { sok: word } });
    } catch (error) {
      console.log(error);
    }
    valid = dictionary.data.search('SAOL gav inga svar.');
    valid = valid === -1 ? true : false;
  }

  if (valid) {
    response.success = true;
    response.message = `${word}. It's a valid word.`;
  } else {
    response.success = false;
    response.message = `${word}. It's not a valid word.`;
  }

  res.json(response);
});

require('./sse.js')(app);

function handleError(res, message) {
  message = `Error: ${message}`;
  const response = { success: false, message };
  res.json(response);
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
