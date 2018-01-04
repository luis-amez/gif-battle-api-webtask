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
  res.send('get /random');
});

// POST gif with caption
app.post('/', (req, res) => {
  res.send('post /');
});

// ----- BATTLE -----

// GET 2 random gifs with caption
app.get('/versus', (req, res) => {
  res.send('get /versus');
});

// POST a vote
app.post('/vote', (req, res) => {
  res.send('post /vote');
});

// ----- LEADERBOARD -----
app.get('/leaderboard', (req, res) => {
  res.send('get /leaderboard');
});

module.exports = Webtask.fromExpress(app);
