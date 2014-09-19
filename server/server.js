/**
 * Created by romanl on 9/18/14.
 */

var restify = require('restify');
var api = require('./api'),
    userApi = api.users,
    sessionApi = api.sessions;


var server = restify.createServer(
    {
    name:'Recyco'
    }
);

server.use(restify.queryParser());
server.use(restify.bodyParser({mapParams: true}));
server.use(restify.CORS());


server.get('/users/:userName', userApi.getUsers);
server.post('/users/', userApi.createUser);

server.get('/users/:userName/sessions', sessionApi.getSessions);

server.get('/sessions/', sessionApi.listSessions);
server.post('/sessions', sessionApi.createSession);

//TODO: Not sure if going to be implemented here
//server.del('/users/:userName', api.addUser);

//TODO: Not sure if needed
//server.put('/users/:userName', api.addUser);


server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});