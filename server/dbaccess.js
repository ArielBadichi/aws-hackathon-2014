/**
 * Created by sergeyr on 9/18/14.
 */
var config = require('./config.json');
var aws = require('aws-sdk');
aws.config.update({accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey});
aws.config.update({region: 'us-west-2'});
var dynamodb = new aws.DynamoDB();


function tableList(){
    var params = {
        TableName: 'users' /* required */
    };
    dynamodb.describeTable(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            process.exit(1);
        } else {
            console.log(data);
            process.exit(0);
        }
    });

}

function createUser(userName, callback) {
    dynamodb.putItem(
        {"TableName": "users",
            "Item": {
                "userName": {"S": userName},
                "totalNumberofBottles": {"N": "0"}
            }
        }
        , function (err, results) {
            callback(err, results);
        });
}

function deleteuser(userNmae) {

}


function getuserbottle() {

}

function getUser(userName, callback) {
    var params = {
        TableName: 'users',
        Key: {
            userName: {
                S: userName
            }
        }
    };
    dynamodb.getItem(params, function(err, results) {
        callback(err, results);
    });
}



function listUsers(callback) {
    var params = {
        TableName: 'users'};

    dynamodb.scan(params, function (err, data) {
        if (err) callback(console.log(err, err.stack)); // an error occurred
        else     {
            callback(null, data);
        }           // successful response
    });
    //}


}

function updateUser(username, userdate) {

}

function createSession(sessionData, callback) {
    dynamodb.putItem({
            "TableName": "userSessions",
            "Item": {
                "userName": {"S": sessionData.userName},
                "sessionId": {"S": sessionData.sessionId},
                "stationNumber": {"N": sessionData.stationNumber},
                "numberOfBottles": {"N": sessionData.numberOfBottles},
                "startTime": {"S": sessionData.startTime},
                "endTime": {"S": sessionData.endTime}
            }
        }
        , function (err, result) {
            callback(err, result);
        });
}

function listSessions(callback) {

    var params = {
        TableName: 'userSessions'};

    dynamodb.scan(params, function (err, data) {
        console.log(data.Items);
        if (err) callback(console.log(err, err.stack)); // an error occurred
        else     {
            callback(null, console.log(data));
        }           // successful response
    });
}

function getSessions(sessionIds) {

}



//createUser("pavel")

//createSession("44","55","6","22:22", "22:55")

//listUsers(function(err, res){
//    console.log(err, res);
//})

(function(){
    var dbaccess = {};

    dbaccess.createUser = createUser;
    dbaccess.listUsers = listUsers;
    dbaccess.getUser = getUser;
    dbaccess.createSession = createSession;

    module.exports = dbaccess;

})();

