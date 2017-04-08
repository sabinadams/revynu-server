var express = require('express'),
app = express();

var routes = require('./routes');

app.use(express.static('www'));
app.use('/', routes);
app.set('port', process.env.PORT || 5000);
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
