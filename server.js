var sys = require('sys');
var fs = require('fs');
var http = require('http');
var haml = require('haml');
var connect = require('connect');
//var auth = require('connect-auth');

var dbOption = {
    host: "grender.couchone.com",
    port: 80,
    path: "/justanotherquote/",
    user: "reman",
    pass: "gnmjHkjgmnSdffj56"
};

//server.listen(8807);
var serverOption={port: 8807};

var templates = {
    oneQuote: haml.optimize(haml.compile(fs.readFileSync('./templates/oneQuote.haml', "utf8"))),
    addQuote: haml.optimize(haml.compile(fs.readFileSync('./templates/addQuote.haml', "utf8")))
};

function routes(app){
    app.get('/api/getRandomQuote', showOneQuote);
    app.get('/add', showAddQuote);
    app.get('/', showBodyPage);
}

var server = connect.createServer()
  .use(connect.logger())
  .use(connect.favicon(__dirname + '/public/favicon.ico'))
  .use(connect.cookieParser())
  .use(connect.session({secret: "secret"}))
  .use(connect.bodyParser())
  //.use(auth(require("./securityStrategy.js")()))
  .use(connect.router(routes))
  .use(connect.static(__dirname+"/public"));  
server.listen(serverOption.port);

function checkUserPass(user, pass){
    return 'add' == user & 'may' == pass;
  };

function showAddQuote(request, response, params){
//request.authenticate(['someName'], function(error, authenticated){	
    connect.basicAuth(checkUserPass)(request, response, function(){
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
        response.end(haml.execute(templates.addQuote));
    });
}

function dbGet(path, next){
    var client = http.createClient(dbOption.port, dbOption.host);
    var base64authData = "Basic " + new Buffer(dbOption.user + ":" + dbOption.pass, 'binary').toString('base64');
    
    var dbReq = client.request("GET", dbOption.path + path, {
        host: dbOption.host,
        authorization: base64authData
    });
    dbReq.on('response', function(dbResp){
        var dbRespBody = "";
        dbResp.on("data", function(chunk){
            dbRespBody += chunk;
        });
        dbResp.on("end", function(){
            next(null, JSON.parse(dbRespBody));
        });
        dbResp.on("error", function(){
            console.log("Error getting quote from DB");
            next("Error getting quote from DB", null);
        });
    });
    dbReq.end();
}

function showBodyPage(request, response){
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    response.end(haml.execute(templates.oneQuote));
}

function showOneQuote(request, response){
    response.writeHead(200, {
        'Content-Type': 'application/json'
    });
    
    dbGet("_all_docs", function(error, result){
        if (error) {
            response.end(JSON.stringify({
                error: "Error on getting from DB...",
                errorInfo: error
            }));
            return;
        }
        
        if (result == null || result.total_rows == 0) {
            var quote = {
                quote: "No quote,",
                quoteSource: "No author"
            };
            response.end(JSON.stringify(quote));
        }
        else {
            var quoteId = result.rows[Math.floor(Math.random() * result.total_rows)].id;
			// TODO: Do dbGet -sync to make that 
			//if(request.params.id)
			//	quoteId=request.params.id;
            dbGet(quoteId, function(error, quote){
                if (error) {
                    console.log("Error on getting from DB(" + error + ")");
                    response.end(JSON.stringify({
                        error: "Error on getting from DB...",
                        errorInfo: error
                    }));
                    return;
                }
                quote.quote = quote.quote.replace(/\n/g, "<br>");
                quote.quoteSource = quote.quoteSource.replace(/\n/g, "<br>");
                response.end(JSON.stringify(quote));
            });
        }
    });
}
