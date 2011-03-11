var sys = require('sys');
var fs = require('fs');
var http = require('http');

// Haml-js: http://github.com/creationix/haml-js
var haml = require('haml');

http.createServer(serverMain).listen(8807);
//console.log('Server running at http://127.0.0.1:8000/');

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
    var client = http.createClient(80, "grender.couchone.com");
    var base64authData = "Basic " + new Buffer("reman:gnmjHkjgmnSdffj56", 'binary').toString('base64');
    
    var dbReq = client.request("GET", path, {
        host: "grender.couchone.com",
        authorization: base64authData
    });
    
    //var dbReq = client.request("GET", path);
    dbReq.addListener('response', function(dbResp){
        var dbRespBody = "";
        dbResp.addListener("data", function(chunk){
            dbRespBody += chunk;
        });
        dbResp.addListener("end", function(){
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
    
    dbGet("/justanotherquote/_all_docs", function(result){
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
            dbGet("/justanotherquote/" + quoteId, function(quote){
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
			locals :{
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
    console.log(request.url);
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
