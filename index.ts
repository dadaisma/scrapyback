import express, { Request, Response } from 'express';
const cors = require('cors');
const fs = require('fs');
import * as path from 'path';


const app = express();    
app.use(cors());
  
  
const scrapeApiRouter = require('./api/scrape-api');
app.use('/api', scrapeApiRouter);


const compareApirouter = require('./api/compare-api');
app.use('/api', compareApirouter);

const deleteApiRouter = require('./api/delete-api');
app.use('/api', deleteApiRouter);


const deleteAllRouter = require('./api/deleteAll-api');
app.use(deleteAllRouter);

app.get('/api/scraped-data', (req: Request, res: Response) => {
    const dataFilePath = path.join(__dirname, 'data.json');
    fs.readFile(dataFilePath, (err: NodeJS.ErrnoException | null, data: Buffer) => {
      if (err) {
        console.error('Error reading data file:', err);
        res.status(500).json({ error: 'Error reading data file' });
      } else {
        res.json(JSON.parse(data.toString()));
      }
    });  
  }); 






app.listen(4000, () => {
  console.log('Server is running on port 4000');    
});      