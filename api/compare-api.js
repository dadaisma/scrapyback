const puppeteer = require('puppeteer');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const url = 'https://books.toscrape.com/';

// Define the POST route for comparing data
router.post('/compare-data', async (req, res) => {
  console.log(123);
  try {
    const dataFilePath = path.join(__dirname, '../datatest.json');
    const scrapeBooks = async () => {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(url);

      const bookData = await page.evaluate((url) => {
        // Function to convert price from string to float
        const convertPrice = (price) => {
          return parseFloat(price.replace('£', ''));
        };

        // Function to convert rating from string to number
        const convertRating = (rating) => {
          switch (rating) {
            case 'One':
              return 1;
            case 'Two':
              return 2;
            case 'Three':
              return 3;
            case 'Four':
              return 4;
            case 'Five':
              return 5;
            default:
              return 0;
          }
        };

        const bookPods = Array.from(document.querySelectorAll('.product_pod'));
        const data = bookPods.map((book) => ({
          title: book.querySelector('h3 a').getAttribute('title'),
          price: convertPrice(book.querySelector('.price_color').innerText),
          imgSrc: url + book.querySelector('img').getAttribute('src'),
          rating: convertRating(book.querySelector('.star-rating').classList[1]),
        }));

        return data;
      }, url);
      await browser.close();

      if (fs.existsSync(dataFilePath)) {
        // Specify the path to datatest.json in the root directory
        const rootDatatestPath = path.join(__dirname, '../datatest.json');
        if (fs.existsSync(rootDatatestPath)) {
          fs.unlinkSync(rootDatatestPath);
          console.log('datatest.json already exists and has been deleted.');
        }
        return;
      }

      fs.writeFile(dataFilePath, JSON.stringify(bookData), (err) => {
        if (err) {
          console.error('Error saving JSON file:', err);
        } else {
          console.log('Saved JSON file!');
        }
      });

      setTimeout(() => {
        fs.unlinkSync(dataFilePath);
        console.log('Data are the same, recent download has been deleted!');
      }, 5000);
    };

   scrapeBooks();

    res.status(200).json({ message: 'Scraping initiated' });
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'Scraping failed' });
  }
});

module.exports = router;


 // function wait(ms) {
 //   return new Promise((resolve) => setTimeout(resolve, ms));
 // }

  function fileExists(filePath) {
    return fs.existsSync(filePath);
  }

  async function compareJSONFiles(filePath1, filePath2) {
    try {
      let scrapeRequired = true;

      if (fs.existsSync(filePath1) && fs.existsSync(filePath2)) {
        const data1 = JSON.parse(fs.readFileSync(filePath1, 'utf8'));
        const data2 = JSON.parse(fs.readFileSync(filePath2, 'utf8'));

          // Compare the JSON data here
      if (JSON.stringify(data1) !== JSON.stringify(data2)) {
        // Data is different, delete 'data.json'
        fs.unlinkSync(filePath1);

        // Rename 'datatest.json' to 'data.json'
        fs.renameSync(filePath2, filePath1);
        scrapeRequired = false; // Set to false if data files were updated
      } else {
        // Data is the same, so delete 'datatest.json'
       setTimeout (()=>{
        fs.unlinkSync(filePath2);
       },5000) 
        console.log('Data are the same, recent download has been deleted');
       
      }
      
    } else if (fs.existsSync(filePath2)) {
      // Only 'datatest.json' exists, so copy it to 'data.json'
      fs.copyFileSync(filePath2, filePath1);
      scrapeRequired = false; // No need to scrape
    } 

      if (scrapeRequired) {
        // Scraping and saving data is required
        ; // Call your scraping function
      }
    } catch (error) {
      console.error('Error during comparison:', error);
    }
  }

  // Start the initial comparison
  compareJSONFiles('data.json', 'datatest.json')
    .then(() => {
      console.log('...Ready');
    })
    .catch((error) => {
      console.error('Error during comparison:', error);
    });

   // console.log('wearehere')


module.exports = router;

