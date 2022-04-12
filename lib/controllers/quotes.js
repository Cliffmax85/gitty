const { Router } = require('express');
const fetch = require('cross-fetch');

module.exports = Router()

  .get('/', (req, res) => {
      const urlArr = [
        'https://programming-quotes-api.herokuapp.com/quotes/random', 
        'https://futuramaapi.herokuapp.com/api/quotes/1', 
        'https://api.quotable.io/random'
      ];

      function fetchQuotes(urlArr) {
          return Promise.all(urlArr.map((url) => fetch(url)))
            .then((response) => {
                return Promise.all(response.map((response) => response.json()));
            });
      }

      function mungeQuotes(quote) {
          if (quote.en) return quote.en;
          if (quote.content) return quote.content;
          if (quote[0]) return quote[0].quote;
      }

      fetchQuotes(urlArr)
        .then((quotes) =>
          quotes.map((data) => {
              return {
                  author: data.author || data[0].character,
                  content: mungeQuotes(data), 
              };
          }))
          .then((mungedArr) => res.send(mungedArr));
  });