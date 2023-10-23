const express = require('express');
const fs = require('fs');
const path = require('path');

const routerDelete = express.Router();

routerDelete.delete('/delete-api/:title', (req, res) => {
    console.log(1111)
    const titleToDelete = decodeURIComponent(req.params.title);
   
   
    console.log('Title to delete:', titleToDelete); // Add this log statement

    const dataFilePath = path.join(__dirname, '../data.json');

    console.log('Data file path:', dataFilePath); // Add this log statement

    fs.readFile(dataFilePath, (err, data) => {
      if (err) {
        console.error('Error reading data file:', err);
        res.status(500).json({ error: 'Error reading data file' });
      } else {
        // Parse the JSON data from the file
        const jsonData = JSON.parse(data.toString());
  
        // Find and remove the object with the specified title
        const updatedData = jsonData.filter((book) => book.title !== titleToDelete);
  
        // Write the updated data back to the file
        fs.writeFile(dataFilePath, JSON.stringify(updatedData), (writeErr) => {
          if (writeErr) {
            console.error('Error writing updated data to file:', writeErr);
            res.status(500).json({ error: 'Error writing updated data to file' });
          } else {
            res.json({ message: 'Book deleted successfully' });
          }
        });
      }
    });
  
  });
  
  module.exports = routerDelete;