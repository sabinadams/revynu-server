var express = require('express'), app = express();
var MongoClient = require('mongodb').MongoClient
var bodyParser = require('body-parser');
var AuthService = require('./services/auth-service');
var db;

MongoClient.connect('mongodb://root:798140Sa@ds155130.mlab.com:55130/revynu', (err, database) => {
  if (err) return console.log(err)
  db = database;
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use((req, res, next) => {
  let _authService = new AuthService(db);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');

  if(req.method == 'OPTIONS'){
  	return res.status(200).send({message: "Preflight check successful"});
  }
  if(req.url == '/login' 
    || req.url == '/register'
    || req.url == '/forgotpasswordemail'
    || req.url == '/forgotpasschangepass'
  ){
  	return next();
  }
  
  if(req.headers.authorization){
  	let bearer = req.headers.authorization.split(`Bearer `)[1];
  	_authService.verifyToken(bearer, (data) => {
  		if(data) return next();
  		else return res.status(401).send({message: "Not Authenticated"});
  	});
  } else {
	  return res.status(401).send({message: "Not Authenticated."})
  }
});

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'));
});


//***************************************************************************************************************************//


app.get('/', (req, res) => {
  res.send('GET request to the homepage')
});

app.post('/login', (req, res) => {
	let _authService = new AuthService(db);
	_authService.login(req.body, data => {
		return res.send( data != false ? {status: 200, user: data} : {status: 401, error: 'Invalid Login'});
	});
});

app.post('/register', (req, res) => {
  let _authService = new AuthService(db);
  _authService.register(req.body, data => {
    return res.send(data);
  });
});

app.post('/forgotpasswordemail', (req, res) => {
  let _authService = new AuthService(db);
  _authService.forgotPasswordEmail(req.body.email, data => {
    return res.send(data);
  });
}); 

app.post('/forgotpasschangepass', (req, res) => {
  let _authService = new AuthService(db);
  _authService.forgotPasswordChangePass(req.body, data => {
    return res.send(data);
  });
}); 