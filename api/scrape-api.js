const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const url = 'https://books.toscrape.com/';

// Define the POST route for initiating scraping
router.post('/scrape-books', async (req, res) => {
  try {
    const dataFilePath = path.join(__dirname, '../data.json');
    
 
    // Check if data.json exists and is empty
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, 'utf8');
      const jsonData = JSON.parse(fileContent);
      if (jsonData.length > 0) {
        console.log('Data already exists, skipping scraping');
        return res.status(200).json({ message: 'Data already exists, no need to scrape' });
      }
    }
    

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

      fs.writeFile(dataFilePath, JSON.stringify(bookData), (err) => {
        if (err) {
          console.error('Error saving JSON file:', err);
        } else {
          console.log('Saved JSON file!');
        }
      });
    };

    scrapeBooks();

    res.status(200).json({ message: 'Scraping initiated' });
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'Scraping failed' });
  }
});








module.exports = router;
