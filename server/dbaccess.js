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

function createUser(username) {
    dynamodb.putItem(
        {"TableName": "users",
            "Item": {
                "username": {"S": username},
                "totalNumberofBottels": {"N": "0"}
            }
        }
        , function (err, result) {
            console.log(err);
            console.log(result);
//            response.on('data', function (chunk) {
//                console.log("" + chunk);
//            });
//            result.on('ready', function (data) {
//                console.log("Error:" + data.error);
//                console.log("ConsumedCapacityUnits:" + data.ConsumedCapacityUnits);
//                // ...
//            });
        });
}
    function deleteuser(userNmae) {

    }


    function getuserbottle() {

    }

    function getUser(userName) {

    }


    function listUsers(callback) {
        var params = {
            TableName: 'users'}
        dynamodb.scan(params, function (err, data) {
            console.log(data.Items);
            if (err) callback(console.log(err, err.stack)); // an error occurred
            else     {
                callback(null, console.log(data));
            }           // successful response
        });
        //}


    }

    function updateUser(username, userdate) {

    }

function createSession(sessionId, stationNumber, numOfBott, startTime, endTime) {
    dynamodb.putItem(
        {"TableName": "userSessions",
            "Item": {
                "sessionId": {"S": sessionId},
                "stationNumber": {"N": stationNumber},
                "numOfBott": {"N": numOfBott},
                "startTime": {"S": startTime},
                "endTime": {"S": endTime}
            }
        }
        , function (err, result) {
            console.log(err);
            console.log(result);
        });
}
function listSessions(callback) {
    //function callback() {
    var params = {
        TableName: 'userSessions'}
    dynamodb.scan(params, function (err, data) {
        console.log(data.Items);
        if (err) callback(console.log(err, err.stack)); // an error occurred
        else     {
            callback(null, console.log(data));
        }           // successful response
    });
    //}

}

function getSessions(sessionIds) {

}


//createUser("pavel")

//createSession("44","55","6","22:22", "22:55")

listUsers(function(err, res){
    console.log(err, res);
})