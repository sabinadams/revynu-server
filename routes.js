var express = require('express')
var router = express.Router()

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route
router.get('/', function (req, res) {
  res.send('GET request to the homepage')
});

router.get('/test', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ a: 1 }));
});

module.exports = router