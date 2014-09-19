/**
 * Created by sergeyr on 9/18/14.
 */
var config = require('./config.json');
var aws = require('aws-sdk');
aws.config.update({accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey});
aws.config.update({region: 'us-west-2'});
var dynamodb = new aws.DynamoDB();


function createUser(userName, callback) {
    dynamodb.putItem(
        {"TableName": "users",
            "Item": {
                "userName": {"S": userName},
                "totalNumberofBottles": {"N": "0"}
            }
        }, function (err, results) {
            callback(err, results);

        });
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
        TableName: 'users'
    };

    dynamodb.scan(params, function (err, data) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, data);
        }
    });
}

function updateUser(userData, callback) {
    var params = {
        Key:{
            userName: userData.userName
        },
        TableName: 'users',
        AttributeUpdates: {
            totalNumberofBottles:{
                Action: 'PUT',
                Value: userData.totalNumberofBottles
            },
             currentStationNumber: {
                 Action: 'PUT',
                 Value: userData.currentStationNumber
             },
              lastRecyclingTime: {
                  Action: 'PUT',
                  Value: userData.lastRecyclingTime
              },
                sessions: {
                    Action: 'PUT',
                    Value: userData.sessions
                    }
                }
            };
    console.log(userData);
    dynamodb.updateItem(params, callback);
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

function getTopUsers(callback) {
    listUsers(function(err, results) {
        if (err) {
            callback(err, null);
        } else {
            var data = results.Items;
            data.sort(function(a, b) {
                return a.totalNumberofBottles.N > b.totalNumberofBottles.N ? -1 : 1;
            });

            callback(null, data);
        }

    });

}

(function(){
    var dbaccess = {};

    dbaccess.createUser = createUser;
    dbaccess.listUsers = listUsers;
    dbaccess.getUser = getUser;
    dbaccess.createSession = createSession;
    dbaccess.updateUser = updateUser;
    dbaccess.getTopUsers = getTopUsers;

    module.exports = dbaccess;

})();