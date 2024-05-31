import fetch from "node-fetch";
import fs from "fs";
import { createObjectCsvWriter } from "csv-writer";

main();

//Uncomment this line to output the retrieved data as a CSV
//createDataCsv();

async function main() {

  //PART 1

  const BRI_STORE_URL = process.env.BRI_STORE_URL;
  let url = BRI_STORE_URL;

  let settings = { method: "Get" };

  fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
      let stateCounts = {};
            
      for (let key in json) {
        let state = json[key].state.toUpperCase();
        if (!(state in stateCounts)) {
          stateCounts[state] = 1;
        } else {
          stateCounts[state]++;
        }
      }

      const sortedStateCounts = Object.keys(stateCounts).sort().reduce(
        (obj, key) => { 
          obj[key] = stateCounts[key]; 
          return obj;
        }, 
        {}
      );

      console.log("Number of stores in each state:");
      for (let key in sortedStateCounts) {
        console.log(key + ": " + sortedStateCounts[key]);
      }

      //PART 2

      //Requirements are to output a static HTML file, so we'll put the CSS into an internal style sheet
      let htmlOutput = `<html>
        <head>
          <title>Brighton Collectibles Stores</title>
          <style>
            body {
              box-sizing: border-box;
              margin: 0px;
            }
            .grid-container {
              display: grid;
              grid-template-columns: calc(100%/3) calc(100%/3) calc(100%/3);
              max-width: 1200px;
            }
            .grid-item {
              border: black 1px solid;
              margin: 5px;
              text-align: center;
            }
            .grid-item img {
              max-width: 100%;
            }
            @media screen and (min-width: 768px) {
              .grid-container {
                grid-template-columns: calc(100%/6) calc(100%/6) calc(100%/6) calc(100%/6) calc(100%/6) calc(100%/6);
              }
            }
          </style>
        </head>
        <body>
          <div class="grid-container">`;

      for (let key in json) {
        let store = json[key];
        let storeMainImageUrl = store.mainImageUrl;
        let storeName = store.name + (store.name2 !== "" ? " - " + store.name2 : "" );

        let imageTag = "<img src=\"" + storeMainImageUrl + "\" />";
        let nameTage = "<p>" + storeName + "</p>";

        htmlOutput += `<div class="grid-item">
            <img src="${storeMainImageUrl}" />
            <p>${storeName}</p>
          </div>`
      }

      htmlOutput += "</div></body></html>";

      var dir = './output';
      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }
      fs.writeFileSync('output/stores.html', htmlOutput);
    });

}

//This function is used to output the retrieved data as a CSV.
//This is not part of the requirements, but was useful for PART 3.
async function createDataCsv() {
  const BRI_STORE_URL = process.env.BRI_STORE_URL;
  let url = BRI_STORE_URL;

  let settings = { method: "Get" };

  fetch(url, settings)
    .then(res => res.json())
    .then((json) => {

      const headerIds = [];
      const headers = [];
      const records = [];

      for (let key in json) {
        let record = {};
        for (let headerId in json[key]) {
          let header = {id: headerId, title: headerId};
          if ( !headerIds.includes(headerId) ) {
            headerIds.push(headerId);
            headers.push(header);
          }
          record[headerId] = json[key][headerId];
        }
        records.push(record);
      }

      console.log(headers);

      const csvWriter = createObjectCsvWriter({
        path: "data.csv",
        header: headers
      });

      csvWriter.writeRecords(records)
        .then(() => {
          console.log("records written!");
        });
    });
}