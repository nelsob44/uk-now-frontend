const express = require('express');
const path = require('path');
const compression = require('compression');
const app = express();

app.use(compression());

// Serve static files....
app.use(express.static(__dirname + '/dist/UKnow'));

// Send all requests to index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/UKnow/index.html'));
});

// default Heroku PORT
app.listen(process.env.PORT || 8081);