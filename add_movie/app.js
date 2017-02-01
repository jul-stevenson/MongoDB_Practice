var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
    bodyParser = require('body-parser');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));

function errorHandler(err, req, res, next) {
    console.error(err.message);
    res.send(err);
}

MongoClient.connect('mongodb://localhost:27017/video', function(err, db) {
    
    assert.equal(null, err);
    console.log("Successfully connected to MongoDB!");

    app.get('/', function(req, res, next) {
	res.render('movies');
    });

    app.post('/movie_entered', function(req, res, next) {
	var title = req.body.title;
	var year = req.body.year;
	
	if((title == '') || (year == '')) {
		next('Please provide an entry for all fields.');
	}
	else {
	    var document = { 'title' : title, 'year' : year };
	    db.collection('movies').insert(document, function(err, result) {
		res.send(result);
	    });
	}
    });


    var server = app.listen(3000, function() {
	var port = server.address().port;
	console.log('Express server listening on port %s', port);
    });
});
