//set up variables
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");
var handlebars = require("express-handlebars");

var note = require("./models/note.js");
var article = require("./models/article.js");

mongoose.Promise = Promise;

//initialize express
var app = express();

//use morgan
app.use (logger("dev"));
app.use(bodyParser.urlencoded({
	extended: false
}));

//making public a static directory
app.use(express.static("public"));

//database configuration for mongoose
mongoose.connect("mongodb://localhost/nytimes");
var db = mongoose.connection;

//show errors for mongoose
db.on("error", function(error){
	console.log("Mongoose Error: ", error);
});

db.once("open", function(){
	console.log("Mongoose connection is successful - Good Job!");
});

//routes

app.get("/scrape", function(req, res){
	request("http://www./nytimes.com", function(error, response, html){
		//shorthand selector
		var $ = cheerio.load(html);

		//grab every h2 within an article tag and do the following
		$("article h2").each(function(i, element){

			var result = {};

			result.title = $(this).children("a").text();
			result.link = $(this).children("a").attr("href");

			//passes the result object to the entry
			var entry = new article(result);

			//save that entry to the db
			entry.save(function(err, doc){
				if (err) {
					console.log(err);
				}

				else {
					console.log(doc);
				}
			});
		});
	});

	//Tells the browser that scraping text is complete
	res.send("Scrape Complete");
});

//Gets you into the articles that were scraped so far
app.get("/articles", function(req, res){
	articles.find({}, function(error, doc){
		if (error) {
			console.log(error);
		}

		else {
			res.json(doc);
		}
	});
});

app.get("/articles/id:", function(req, res){
	article.findOne({"_id": req.params.id})

	.populate("note")

	.exec(function(error, doc){
		if (error){
			console.log(error);
		}

		else {
			res.json(doc);
		}
	});
});

//create a new note or replace an existing one

app.post("/articles/:id", function(req, res){
	//creates a new note and passes the req.body the entry
	var newNote = new Note(req.body);

	//saves the new not to the db
	newNote.save(function(error, doc){
		if (error){
			console.log(error);
		}

		else {
			article.findOneAndUpdate({"_id": req.params.id}, {"note": doc._id})
			.exec(function(err, doc){
				if(err){
					console.log(err);
				}

				else {
					res.send(doc);
				}
			});
		}
	});
});


app.listen(3000, function() {
	console.log("App running on port 3000!");
});

