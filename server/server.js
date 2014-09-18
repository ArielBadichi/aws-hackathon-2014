/**
 * Created by romanl on 9/18/14.
 */

var restify = require('restify');
var api = require('./api');

function respond(req, res, next) {
    res.send('hello ' + req.params.name);
    next();
}

var server = restify.createServer(
    {
    name:'Recyco'
    }
);
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});