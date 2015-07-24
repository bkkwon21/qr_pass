var express = require('express');
var time = require('time');
var router = express.Router();
var zpad = require('zpad');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/userlist', function(req, res) {
    var ts_hms = new time.Date();
    ts_hms.setTimezone("America/New_York");
    console.log(ts_hms.getMonth() + 1);
    console.log(ts_hms.getDate());
    console.log(ts_hms.getHours());
    var db = req.db;
    var collection = db.get('qr_pass');
    collection.find({},{},function(e,docs){
		res.setHeader('Content-Type', 'application/json');
    	res.send(JSON.stringify(docs));
    });
});

module.exports = router;

/*
router.get('/ukc/:ukcId/:date/:meal', function(req, res) {
	 var db = req.db;
    var collection = db.get('qr_pass');
    //var query = {"ukc-id" : req.param("ukcId"), "date" : "08-01", "meal" : "dinner"}
    var query = {"ukc_id" : req.param("ukcId"), "date" : req.param("date"), "meal" : req.param("meal")}
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
*/



router.get('/ukc/:ukcId', function(req, res) {
         var db = req.db;
    var collection = db.get('qr_pass');

    var ts_hms = new time.Date();
    ts_hms.setTimezone("America/New_York");
    var date_query = zpad(ts_hms.getMonth() + 1).toString() + "-" + ts_hms.getDate().toString();
    var hour = ts_hms.getHours();
    var mins = ts_hms.getMinutes();
    var meal = "";
    console.log(ts_hms.getMonth() + 1);
    console.log(ts_hms.getDate());
    console.log(ts_hms.getHours());
    console.log(ts_hms.getMinutes());
    console.log(date_query);

    if (hour >= 6 && hour <= 8){
       meal = "breakfast";
    }
    else if (hour >= 11 && hour <= 13){
       meal = "lunch";
    }
    else if (hour >= 17 && hour < 18){
       meal = "tour";
    }
    else if (hour >= 18 && hour < 21){
      if ( min < 30){
       meal = "tour";
      } else{ 
       meal = "dinner";
      }
    }
    else{
       meal = "invalid";
    }
    
    console.log(meal);

   if  (meal == "invalid"){
       var json = '[{"_id":"55b29efff2c91614e5aef927","ukc_id":"60-46","date":"07-24","meal":"lunch","type":"NOK","name":"Wrong","meal_key":"1101-110-11"}]';
       console.log(json);
           res.setHeader('Content-Type', 'application/json');
           res.send(json);
   }else{

   
    var query = {"ukc_id" : req.param("ukcId"), "date" : date_query, "meal" : "lunch"}
    //var query = {"ukc_id" : req.param("ukcId"), "date" : date_query, "meal" : meal}
    collection.find(query,{},function(e,docs){
           res.setHeader('Content-Type', 'application/json');
           var json_data = JSON.parse(JSON.stringify(docs));
           console.log(json_data);
           console.log(json_data.length);
           res.send(JSON.stringify(docs));

        if(json_data.length > 0 && json_data[0]['type'] == 'R'){
           console.log('changing to OMG');
            setTimeout(function() {
                collection.update(query, {$set: {"type": "OMG"}}, function(err) {
                if (err) throw err
                });
            }, 3000);
        }
    });
   }
});
