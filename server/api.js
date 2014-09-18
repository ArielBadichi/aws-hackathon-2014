/**
 * Created by romanl on 9/18/14.
 */

var db = require('dbAccess');
var async = require('async');


function addUser(userDetails, callback){
    //db.createUser(userDetails);

}

function removeUser(uid, callback) {
    //db.removeUser(userDetails);

}

function addBottles(uid, bottleInfo, callback) {

}

function listUsers(req, res, next) {
    db.getUsers(function(err, results) {
        if(err) {
            console.log(err);
            next(new Error('Error listing users' + err.toString()));

        } else {
            console.log(results);
            res.send(results);
            next();
        }
    });

}


(function(){
    var api = {};
    api.addUser = addUser;
    api.removeUser = removeUser;
    api.addBottles = addBottles;
    api.listUsers = listUsers;

    module.exports = api;
})();
