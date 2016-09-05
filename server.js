var express = require('express'),
	cheerio	= require('cheerio'),
	request = require('request'),
	fs		= require('fs'),
	orm		= require('orm'),
	app		= express();


orm.connect("mysql://root:0201243MmMm@localhost/popcorn", function(err, db) {
	if(err) throw err;
	console.log("Connection established .");
	var news = db.define("news", { 
    	id    : Number,
    	des   : String,
    	sum   : String,
    	pic   : String,
    	title : String
	});

	function postSubmiter (postInfo) {
		news.create(postInfo, function(err) {
			if(err) throw err;	
			console.log("Database has been updated in a while");

		});
	}

	var url = "http://cinemapress.ir/";

	request(url, function(err, res, html) {
		if(err) throw err;

		var $ = cheerio.load(html);


		var sum, title, des, pic;
		var postInfo = {};
		var postChecker;
		var getAllpost ;
		
		if(getAllpost != 0){
			$('#box15 ul li.text').each(function(i, elm) {
				var data = $(this);
				pic 	 = data.children().children().children().attr('src');
				sum 	 = data.children().nextAll('h4').text().replace(/  /g,'');
				title 	 = data.children().nextAll('h3').text().replace(/  /g,'');
				des		 = data.children().nextAll('p').text().replace(/  /g,'');
				postInfo = { pic : pic, title : title, des : des, sum : sum};
				postChecker = postInfo ;
				
				news.find({title : title}, function(err, news) {
					if(news.length == 0){
						postSubmiter(postInfo);
					}else{console.log("Cinemapress hasnt been updated in a while");}
					
				});
			});	
			getAllpost = 0;		
		}


		setInterval(function() {
			$('#box15 ul li.text:first-child').filter(function() {
				var data = $(this);
					pic 	 = data.children().children().children().attr('src');
					sum 	 = data.children().nextAll('h4').text().replace(/  /g,'');
					title 	 = data.children().nextAll('h3').text().replace(/  /g,'');
					des		 = data.children().nextAll('p').text().replace(/  /g,'');
					postInfo = { pic : pic, title : title, des : des, sum : sum};

				news.find({title : title}, function(err, news) {
					if(news.length == 0){
						postSubmiter(postInfo);
					}else{console.log("Cinemapress hasnt been updated in a while");}
					
				});

			});
		}, 3000);
	});

});
	

app.listen("8000");
console.log("app runnig on port 8000");