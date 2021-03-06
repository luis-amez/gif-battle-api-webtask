var express    = require('express');
var Webtask    = require('webtask-tools');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendStatus(200);
});

// ----- CREATE -----

// GET a random gif from giphy
app.get('/random', (req, res) => {
  const url = `https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY_API_KEY}&filter=PG-13`;
  
  request(url, (error, response, body) => {
    if(error) {
      res.status(400).json(error);
      return;
    }
    
    body = JSON.parse(body);
    const gif = {
      id: body.data.id,
      url: body.data.image_original_url
    };
    
    res.status(200).json(gif);
  });
});

// POST gif with caption
app.post('/', (req, res) => {
  // Store into webtaskContext.storage
  req.webtaskContext.storage.get((error, data) => {
    if (error) {
      res.status(400).json(error);
      return;
    }
    
    data = data || [];
    data.push(req.body);
    req.webtaskContext.storage.set(data, error => {
      if (error) {
        res.status(400).json(error);
        return;
      }
      
      res.status(200).json({ message: 'Gif successfully stored!' })
    });
  });
});

// ----- BATTLE -----

// GET 2 random gifs with captions
app.get('/versus', (req, res) => {
  req.webtaskContext.storage.get((error, data) => {
    if (error) {
      res.status(400).json(error);
      return;
    }
    
    data = _.shuffle(data);
    const twoGifs = data.slice(0, 2);
    res.status(200).json(twoGifs);
  });
});

// POST a vote
app.post('/vote', (req, res) => {
  req.webtaskContext.storage.get((error, data) => {
    if (error) {
      res.status(400).json(error);
      return;
    }
    
    // Find the index in our database array
    const index = data.findIndex((gif) => {
      return gif.id === req.body.id;
    });
    
    // Increment the votes
    data[index].votes++;
    
    // Save the updated database array
    req.webtaskContext.storage.set(data, (error) => {
      if (error) {
        res.status(400).json(error);
        return;
      }
      
      res.status(200).json({ message: 'Gif successfully voted!' })
    });
  })
});

// ----- LEADERBOARD -----
app.get('/leaderboard', (req, res) => {
  req.webtaskContext.storage.get((error, data) => {
    if (error) {
      res.status(400).json(error);
      return;
    }
    
    data = data.sort((a, b) => {
      return b.votes - a.votes;
    })
    const topTen = data.slice(0, 10);
    res.status(200).json(topTen);
  })
});

module.exports = Webtask.fromExpress(app);
