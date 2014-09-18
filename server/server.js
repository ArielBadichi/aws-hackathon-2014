/**
 * Created by romanl on 9/18/14.
 */

var restify = require('restify');
var api = require('./api');

function users(req, res, next) {
    res.send('hello ' + req.params.name);
    next();
}

var server = restify.createServer(
    {
    name:'Recyco'
    }
);
server.get('/users/', api.listUsers);
server.post('/users/:userName', api.addUser);
server.put('/users/:userName', api.addUser);
server.del('/addUser/:userName', api.addUser);


server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});

