// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.


window.addEventListener('DOMContentLoaded', () => {

  const cheerio = require('cheerio')
const Table = require('cli-table');
const request = require('request');
const stringSearcher = require('string-search');

  const {
    contextBridge,
    ipcRenderer
} = require("electron");

const getStats = (stock) => {
  let stockURL = 'https://finviz.com/quote.ashx?t=' + stock;


  request(stockURL, (error, response, html) => {
      if(!error && response.statusCode == 200) {
          const $ = cheerio.load(html);
  
          const dataTable = $('.snapshot-table2').text();
          
          // ATR
          stringSearcher.find(dataTable,'ATR')
              .then(function(resultArr){
                  console.log(resultArr[0].text);
              })
          
              stringSearcher.find(dataTable,'Rel Volume')
              .then(function(resultArr){
                  console.log(resultArr[0].text);
              })
          
      }
  });
}

  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})
