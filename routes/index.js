var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('qr_pass');
    collection.find({},{},function(e,docs){
		res.setHeader('Content-Type', 'application/json');
    	res.send(JSON.stringify(docs));
    });
});

module.exports = router;


router.get('/ukc/:ukcId/:date/:meal', function(req, res) {
	 var db = req.db;
    var collection = db.get('qr_pass');
    var query = {"ukc-id" : req.param("ukcId"), "date" : req.param("date"), "meal" : req.param("meal")}
    collection.find(query,{},function(e,docs){


		res.setHeader('Content-Type', 'application/json');
    	res.send(JSON.stringify(docs));
    });


    setTimeout(function() {
		collection.update(query, {$set: {"type": "NOK"}}, function(err) {
		if (err) throw err
		});
	}, 3000);


});