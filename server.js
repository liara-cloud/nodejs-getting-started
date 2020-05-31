var express = require('express');
var morgan = require('morgan')
var app = express();
var path = require('path');

app.use(morgan('tiny'))
app.use(express.static('public'))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(8000, () => console.log(`Example app listening on port 8000!`));