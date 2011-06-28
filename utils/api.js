var Q = require("q");
var errorHelper = require('./errorHelper.js');
var http = require('http');

function dbGet(path){
	var result = Q.defer();
	var client = http.createClient(options.db.port, options.db.host);
	var base64authData = "Basic " + new Buffer(options.db.user + ":" + options.db.pass, 'binary').toString('base64');
	
	var dbReq = client.request("GET", options.db.path + path, {
		host: options.db.host,
		authorization: base64authData
	});
	dbReq.on('response', function(dbResp){
		var dbRespBody = "";
		dbResp.on("data", function(chunk){
			dbRespBody += chunk;
		});
		dbResp.on("end", function(){
			result.resolve(JSON.parse(dbRespBody));
		});
		dbResp.on("error", function(){
			result.reject("Error getting quote from DB");
		});
	});
	dbReq.end();
	return result.promise;
}

function getRandomQuote() {
	var randomObject=Q.defer();
	Q.when(dbGet("_all_docs")
							,function(result) {
								if (result == null || result.total_rows == 0) {
									var quote = {
										quote: "No quote.",
										quoteSource: "No author"
									};
									randomObject.resolve(JSON.stringify(quote,["quote","quoteSource"]));
								}
								var objId = result.rows[Math.floor(Math.random() * result.total_rows)].id;
								return Q.when(dbGet(objId),function(quote) {
										quote.quote = quote.quote.replace(/\n/g, "<br>");
										quote.quoteSource = quote.quoteSource.replace(/\n/g, "<br>");										
										randomObject.resolve(JSON.stringify(quote,["quote","quoteSource","mp3link"]));
									});
								}
							, function(error) {
								randomObject.reject(errorHelper.errorStr(error));
							}
							);	
	return randomObject.promise;
}

module.exports = {
    getRandomQuote : getRandomQuote,
    setOptions: function(newOptions) {
                    options = newOptions;
                }
};
