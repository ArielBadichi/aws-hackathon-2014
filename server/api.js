/**
 * Created by romanl on 9/18/14.
 */

var db = require('dbAccess');
var async = require('async');


function addUser(req, res, next){
    var userName = req.params.userName;
    db.createUser(userName, function(err, results) {
        if(err) {
            console.log(err);
            next(new Error('Error Adding User: ' + err.toString()));
        } else {
            console.log(results);
            res.send(results);
            next();
        }
    });

}

function removeUser(req, res, next) {
    var userName = req.params.userName;
    db.removeUser(userName, function(err, results) {
        if(err) {
            console.log(err);
            next(new Error('Error Removing User: ' + err.toString()));
        } else {
            console.log(results);
            res.send(results);
            next();
        }
    });

}

function addBottles(req, res, next) {
    var stationNumber = req.params.stationNumber,
        numberOfBottles = req.params.numberOfBottles;

}

function getUsers(req, res, next) {
    var userName = req.params.userName;
    var userListCallback = function(err, results) {
        if(err) {
            console.log(err);
            next(new Error('Error listing users: ' + err.toString()));

        } else {
            console.log(results);
            res.send(results);
            next();
        }
    };

    if(userName) {

        db.getUserData(userName, userListCallback);
    } else {
        db.getUsers(userListCallback);
    }

}


(function(){
    var api = {};

    //Users
    api.users = {};
    api.users.addUser = addUser;
    api.users.removeUser = removeUser;
    api.users.getUsers = getUsers;

    //Sessions
    api.sessions = {};
    api.sessions.addBottles = addBottles;

    module.exports = api;

})();