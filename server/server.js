/**
 * Created by romanl on 9/18/14.
 */

var restify = require('restify');
var api = require('./api'),
    usersApi = api.users,
    sessionApi = api.sessions;

function users(req, res, next) {
    res.send('hello ' + req.params.name);
    next();
}

var server = restify.createServer(
    {
    name:'Recyco'
    }
);
server.get('/users/:userName', usersApi.getUsers);
server.post('/users/:userName', usersApi.createUser);

server.get('/sessions/', sessionApi.listSessions);

//TODO: Not sure if going to be implemented here
//server.del('/users/:userName', api.addUser);

//TODO: Not sure if needed
//server.put('/users/:userName', api.addUser);


server.use(restify.queryParser());

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});

