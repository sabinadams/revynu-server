var express = require('express'),
app = express();
app.use(express.static('www'));
app.set('port', process.env.PORT || 5000);
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
app.get('/', function (req, res) {
  res.send('GET request to the homepage')
});

app.get('/test', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ a: 1 }));
});