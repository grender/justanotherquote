var http = require('http');


http.createServer(serverMain).listen(8807);
function serverMain(request, response){
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    var t = new Buffer("Hello", 'binary').toString('base64');
    console.log(t);
    response.end(t);
    return;
}
