// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const cheerio = require('cheerio')
const Table = require('cli-table');
const request = require('request');
const stringSearcher = require('string-search');






const form = document.querySelector('form');

form.addEventListener('submit',submitForm);

function submitForm(e) {
    e.preventDefault();
    const stock = document.querySelector('#stock').value;

    const stockURL = 'https://finviz.com/quote.ashx?t=' + stock;

    let table = document.querySelector('#table');
    let row = table.insertRow(1);

    row.insertCell(0).innerHTML = "<span id='stonk'><strong>"+ stock + "</strong></span>";

    request(stockURL, (error, response, html) => {
        if(!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
    
            const dataTable = $('.snapshot-table2').text();
            
            // ATR
            stringSearcher.find(dataTable,'ATR')
                .then(function(resultArr){
                    let atr = resultArr[0].text;
                    row.insertCell(1).append(atr.substring(3));
                   
                })
                stringSearcher.find(dataTable,'Avg Volume')
                .then(function(resultArr){
                    let avol = resultArr[0].text;
                    row.insertCell(2).append(avol.substring(10));
                })
                stringSearcher.find(dataTable,'Rel Volume')
                .then(function(resultArr){
                    let rvol = resultArr[0].text;
                    row.insertCell(3).append(rvol.substring(10));
                })
                stringSearcher.find(dataTable,'Shs Float')
                .then(function(resultArr){
                    let float = resultArr[0].text;
                    row.insertCell(4).append(float.substring(9));
                })
                stringSearcher.find(dataTable,'Short Float')
                .then(function(resultArr){
                    let sfloat = resultArr[0].text;
                    row.insertCell(5).append(sfloat.substring(11));
                })
                stringSearcher.find(dataTable,'Inst Own')
                .then(function(resultArr){
                    let inst = resultArr[0].text;
                    row.insertCell(6).append(inst.substring(8));
                })
             
        }
    });
    
    const stonk = document.querySelector('#stonk');

    stonk.addEventListener('click', delrow);

    function delrow() {
        this.closest('tr').remove();
    }


    

    document.querySelector("#form").reset();

}