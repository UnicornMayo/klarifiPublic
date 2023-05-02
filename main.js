const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
stopWords = ['references', 'readmore', 'latest posts']

axios.get('https://blog.fastforwardlabs.com/2022/03/22/an-introduction-to-text-style-transfer.html')
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    const main = $('main');
    console.log(typeof $ == typeof main);
    const data = {};

    $('h1, h2, h3').each((index, header) => {
      if (stopWords.includes($(header).text().toLowerCase())) {
        return false;
      }
      const headerText = $(header).text();
      const paragraphs = [];
    
      $(header).nextUntil('h1, h2, h3').each((index, element) => {
        if ($(element).is('p')) {
          const paragraphText = $(element).text();
          paragraphs.push(paragraphText);
        }
      });

      data[headerText] = paragraphs;
    });
    
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length === 0) {
        delete data[key];
      }
    });

    fs.writeFile('data.json', JSON.stringify(data), err => {
      if (err) throw err;
      console.log('Data saved to data.json');
    });
  })
  .catch(error => {
    console.log(error);
  });