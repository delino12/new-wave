/*
* Using Money Wave Api
* on NodeJs Frame work
*/

// invoke modules
var express = require("express");
var unirest = require("unirest");
var handlebars = require("express-handlebars");
var bodyParser = require('body-parser');


// set express module
app = express();

// handlebars
app.engine('handlebars', handlebars({defaultLayout: 'main', helpers: {section: function(name, options){
	if(!this._sections) this._sections = {};
		this._sections[name] = options.fn(this);
		return null;
	}
}}));
app.set('view engine', 'handlebars');

// set a public static path
app.use('/public', express.static('public'));
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json 
app.use(bodyParser.json());


var apiKey = "ts_Y97G6SE3GBS1LO1FINJY";
var appSecret = "ts_S00T33F7NFGBJ68H3ZQ4FDH8P6438O";

var body;
// unirest
unirest.post('https://moneywave.herokuapp.com/v1/merchant/verify')
.headers({'Content-Type': 'application/json'})
.send({ "apiKey": apiKey, "secret": appSecret })
.end(function (response) {
	body = response.body;
	console.log("response data is ready !");
});


// default URI
app.get("/", function (req, res){	
	res.render('home', {body});
	console.log("default page loaded...");
});


/*
* Pages and Get Request
* Runs route
*/

// transfer to wallet
app.get("/transfer-to-account", function (req, res){
	res.render('transfer-to-account');
});

// pay to wallet account
app.get("/pay-to-wallet", function(req, res){
	res.render('pay-to-wallet', {body});
});


/*
* Start for Post Request URI
* Runs route
*/
var payRes;
app.post("/pay-wallet", function(req, res){

	// User Details
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;
	var phone = req.body.phone;
	
	// Card Details
	var cardNo = req.body.card_no;
	var cvv = req.body.cvv;
	var pin = req.body.pin;
	var expYear = req.body.exp_year;
	var expMonth = req.body.exp_month;

	// Charges
	var amount = req.body.amount;
	var fee = 0;

	// Authorization Token
	var apiKey = apiKey;
	var authToken = req.body.token;

	var unirest = require('unirest');
 	var  params = {
      "firstname": firstname,
      "lastname": lastname,
      "email": email,
      "phonenumber": phone,
      "recipient":"wallet",
      "card_no": cardNo,
      "cvv": cvv,
      "pin": pin, //optional required when using VERVE card
      "expiry_year": expYear,
      "expiry_month": expMonth,
      "charge_auth":"PIN", //optional required where card is a local Mastercard
      "apiKey" : apiKey,
      "amount" : amount,
      "fee": fee,
      "medium": "web",
      "redirecturl": "https://wavy-transfer-rules.com"
 	};

	unirest.post('https://moneywave.herokuapp.com/v1/transfer')
	.headers({'Content-Type': 'application/json', 'Authorization': authToken})
	.send(params)
	.end(function (response) {
		payRes = response.body;
		console.log(response.body);
	});

	res.redirect("/pay-status");
});


app.get("/pay-status", function (req, res){
	console.log(payRes);
	res.render('pay-to-wallet-status', {payRes});

});


// default error 404 link
app.get(function (req, res){
	res.status(404);
	res.render('404');
});


// set port
var port = process.env.PORT || 3000;

// start express server
app.listen(port, function (){
	console.log("Localhost server has started....");
	console.log("Localhost is running on port: "+ port);
	console.log("Press Ctrl+C to terminate server");
	console.log("----------(^_^)-----------------");
});