/**
 * Created by romanl on 9/18/14.
 */

var db = require('./dbaccess');
var async = require('async');


//Users

function createUser(req, res, next){
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
        db.getUser(userName, userListCallback);
    } else {
        db.listUsers(userListCallback);
    }

}


//Sessions

function createSession(req, res, next) {
    var sessionData = req.params.sessionData;

    async.waterfall([
        function(callback) {
            db.createSession(sessionData, function(err, results) {
                if(err) {
                    console.log(err);
                    callback(new Error('Error Creating Session: ' + err.toString()), null);

                } else {
                    console.log(results);
                    callback(null);
                }
            });
        },
        function(callback) {

            var stationNumber = sessionData.stationNumber;

            db.findUser(stationNumber, function(err, results) {
                if(err) {
                    console.log(err);
                    callback(new Error('Error finding user by station number: ' + err.toString()), null);
                } else {
                    callback(null, results);
                }
            });

        },
        function(userData, callback) {
            userData.sessions.append(sessionData.sessionId);
            userData.currentSessionNumber = 0;

            db.updateUser(userData, function(err, results) {
                if(err) {
                    console.log(err);
                    callback(new Error('Error updating user data with session details: ' + err.toString()), null);
                } else {
                    callback(null, results);
                }
            });
        }
    ], function(err, results) {
        if(err) {
            console.log(err);
            next(new Error('Error with session creation process: ' + err.toString()));

        } else {
            console.log(results);
            res.send(results);
            next();
        }
    });

}

function listSessions(req, res, next) {


}

function getSessions(req, res, next) {
    var userName = req.params.userName;

    async.waterfall([
        function(callback) {
            db.getUser(userName, function(err, results) {
                if(err) {
                    console.log(err);
                    callback(new Error('Error getting user details: ' + err.toString()), null);
                } else {
                    callback(null, results);
                }
            });
        },
        function(userData, callback) {
            var sessions = userData.sessions;
            db.getSessions(sessions, function(err, results) {
                if(err) {
                    console.log(err);
                    callback(new Error('Error getting session details for user: ' + err.toString()), null);
                } else {
                    callback(null, results);
                }
            });
        }
    ], function(err, results) {
        if(err) {
            console.log(err);
            next(new Error('Error with getting user sessions process: ' + err.toString()));

        } else {
            console.log(results);
            res.send(results);
            next();
        }
    });
}


(function(){
    var api = {};

    //Users
    api.users = {};
    api.users.createUser = createUser;
    api.users.removeUser = removeUser;
    api.users.getUsers = getUsers;

    //Sessions
    api.sessions = {};
    api.sessions.createSession = createSession;
    api.sessions.getSessions = getSessions;
    api.sessions.listSessions = listSessions;

    module.exports = api;

})();