const http = require('http');
const express = require('express');
const app = express();

app.use(express.static('public'));
app.set('port', process.env.PORT || 3000);

http.createServer(app)
  .listen( app.get('port'), console.log(`Express Server listening on port ${app.get('port')}...`) );
  