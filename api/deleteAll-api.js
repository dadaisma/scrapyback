const express = require('express');
const routerDeleteAll = express.Router();
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const url = 'https://books.toscrape.com/';


routerDeleteAll.delete('/deleteAll-api', async (req, res) => {
    console.log(3333333);
     
    const dataFilePath = path.join(__dirname, '../data.json');
    
    console.log('Data file path:', dataFilePath); // Add this line for debugging
    
    // Check if the file exists
    if (fs.existsSync(dataFilePath)) {
      // Attempt to delete the file
      fs.unlink(dataFilePath, (err) => {
        if (err) {
          console.error('Error deleting data file:', err);
          res.status(500).json({ error: 'Error deleting data file' });
        } else {
          console.log('data.json has been deleted.');
          res.status(200).json({ message: 'data.json has been deleted' });
        }
      });
    } else {
      res.status(404).json({ error: 'data.json not found' });
    }
  });
  module.exports = routerDeleteAll;