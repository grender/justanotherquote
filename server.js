var sys = require('sys');
var fs = require('fs');
var path = require('path');
var http = require('http');
var haml = require('haml');
var connect = require('connect');

var Q = require("q");
//var auth = require('connect-auth');

var errorHelper = require('./utils/errorHelper.js');
var templates;
var currentRouter;
var server;

var configPlace = './config.json';
var DEFAULT_CONFIG_PORT = 65000;
var options;

init();

function init(){
    var configMode = false;
    if (!path.existsSync(configPlace)) 
        configMode = true;
    
    if (configMode) {
        options = {
            server: {
                port: DEFAULT_CONFIG_PORT
            }
        };
        currentRouter = connect.router(configRoutes);
        templates = {
            config: haml.optimize(haml.compile(fs.readFileSync('./templates/config.haml', "utf8")))
        };
    }
    else {
        options = JSON.parse(fs.readFileSync(configPlace));
        currentRouter = connect.router(routes);
        templates = {
            oneQuote: haml.optimize(haml.compile(fs.readFileSync('./templates/oneQuote.haml', "utf8"))),
            addQuote: haml.optimize(haml.compile(fs.readFileSync('./templates/addQuote.haml', "utf8"))),
        };
    }
    
    server = connect.createServer()
							.use(connect.logger())
							.use(connect.favicon(__dirname + '/public/favicon.ico'))
							.use(connect.cookieParser())
							.use(connect.session({secret: "secret"}))
							.use(connect.bodyParser())   
							//.use(auth(require("./securityStrategy.js")()))
							.use(currentRouter)
							//.use(connect.static(__dirname + "/plainHtml"))
							.use(connect.static(__dirname + "/public"));
    server.listen(options.server.port);
    console.log("Server started on port " + options.server.port);
}

function configRoutes(app){
    app.post('/api/saveConfig', saveConfig);
    app.get('/', showConfig);
}

function routes(app){
    app.get('/api/getRandomQuote', showOneQuote);
    app.get('/add', showAddQuote);
    app.get('/', showBodyPage);
}

function checkUserPass(user, pass){
    return 'add' == user & 'may' == pass;
};

function saveConfig(request, response, params){
    var clientOptions = request.body;
    response.writeHead(200, {
        'Content-Type': 'application/json'
    });
    
    var options = {
        db: {
            host: clientOptions.dbHost,
            port: clientOptions.dbPort,
            path: clientOptions.dbPath,
            user: clientOptions.dbUser,
            pass: clientOptions.dbPass
        },
        server: {
            port: clientOptions.serverPort
        }
    };
    
    try {
        if (path.existsSync(configPlace)) {
            response.end(errorHelper.errorStr("Config file exist. Strange..."));
            return;
        }
        fs.writeFileSync(configPlace, JSON.stringify(options));
        response.end(errorHelper.okStr);
    } 
    catch (error) {
        response.end(errorHelper.errorStr(error.message));
    }
	server.close();
	init();
}

function showConfig(request, response, params){
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    response.end(haml.execute(templates.config));
}

function showAddQuote(request, response, params){
    //request.authenticate(['someName'], function(error, authenticated){	
    connect.basicAuth(checkUserPass)(request, response, function(){
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
        response.end(haml.execute(templates.addQuote));
    });
}

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
    
	var randomObject=Q.when(dbGet("_all_docs"),function(result) {
								if (result == null || result.total_rows == 0) {
									var quote = {
										quote: "No quote.",
										quoteSource: "No author"
									};
									randomObject.resolve(quote);
								}
								var objId = result.rows[Math.floor(Math.random() * result.total_rows)].id;
								return Q.when(dbGet(objId),function(obj) {
										return obj;
									});
								}
							);	
    Q.when(randomObject
			, function(quote){
                quote.quote = quote.quote.replace(/\n/g, "<br>");
                quote.quoteSource = quote.quoteSource.replace(/\n/g, "<br>");			
				response.end(JSON.stringify(quote));
			  }
			, function(error){
				response.end(errorHelper.errorStr(error));
			  }
		  );
}
