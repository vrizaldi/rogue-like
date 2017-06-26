const marked = require("marked");
const express = require("express");

var server = express();

server.use(express.static(__dirname + "/public"));

server.get("/", 
		function(req, res) {
			console.log("Called");
			res.sendFile(__dirname + "/views/index.html",
				function(err) {
					if(err) throw err;

					console.log("File sent");
				});
		});

var port = process.env.PORT ? process.env.PORT : 21701;
server.listen(port, 
	function(err) {
		if(err) throw err;

		console.log("Server is listening on port " + port);
	});
