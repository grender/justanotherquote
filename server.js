var sys = require('sys');
var fs = require('fs');
var http = require('http');
var haml = require('haml');

var dbOption={
	host: "grender.couchone.com",
	port:80,
	path:"/justanotherquote/",
	user:"reman",
	pass:"gnmjHkjgmnSdffj56"
};

http.createServer(serverMain).listen(8807);



function getPublicContent(response, url){
    fs.readFile('.' + url, function(e, c){
        if (e) {
            response.writeHead(404);
        }
        else {
            response.writeHead(200);
            response.write(c);
        }
        response.end();
    });
}

function dbGet(path, next){
    var client = http.createClient(dbOption.port, dbOption.host);
    var base64authData = "Basic " + new Buffer(dbOption.user+":"+dbOption.pass, 'binary').toString('base64');
    
    var dbReq = client.request("GET", dbOption.path+path, {
        host: dbOption.host,
        authorization: base64authData
    });
    dbReq.on('response', function(dbResp){
        var dbRespBody = "";
        dbResp.on("data", function(chunk){
            dbRespBody += chunk;
        });
        dbResp.on("end", function(){
            next(JSON.parse(dbRespBody));
        });
    });
    dbReq.end();
}

function showOneQuote(response, forJson){
    if (forJson) 
        response.writeHead(200, {
            'Content-Type': 'application/json'
        });
    else 
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
    
    dbGet("_all_docs", function(result){
        if (result == null || result.total_rows == 0) {
            var quote = {
                quote: "No quote",
                quoteSource: "No author"
            };
            response.write("No quote");
            response.end();
        }
        else {
            var quoteId = result.rows[Math.floor(Math.random() * result.total_rows)].id;
            dbGet(quoteId, function(quote){
                fs.readFile('./templates/oneQuote.haml', "utf8", function(e, c){
                    quote = {
                        quote: quote.quote.replace(/\n/g, "<br>"),
                        quoteSource: quote.quoteSource.replace(/\n/g, "<br>")
                    };
                    if (forJson) {
                        var json = JSON.stringify(quote);
                        response.write(json);
                    }
                    else {
                        var html = haml.render(c.toString(), {
                            //    locals: quote
                            locals: {
                                quote: "",
                                quoteSource: ""
                            }
                        });
                        response.write(html);
                    }
                    response.end();
                });
            })
        }
    });
}

function showOneQuoteAjax(response){
    showOneQuote(response, true);
}

function serverMain(request, response){
    if (request.url.search("/public") == 0) 
        getPublicContent(response, request.url);
    else {
        if (request.url.search("/getRandomQuote") == 0) 
            showOneQuoteAjax(response);
        else 
            if (request.url == "/") 
                showOneQuote(response);
    }
}
