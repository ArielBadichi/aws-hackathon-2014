/**
 * Created by sergeyr on 9/18/14.
 */
var aws = require('aws-sdk');
aws.config.update({accessKeyId: 'AKIAI5RGYGTBNUJTMYNA', secretAccessKey: '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'});
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

function createUser(username){
    var params = {
        username: {
            username,
        }
        },
    TableName: 'users',
    AttributeUpdates: {

    dynamodb.updateItem(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });
}

function deleteuser(userNmae){

}

function getuserdata(userName){

}

function getuserbottle(){

}

function getUser(userName){

}



function listUsers(){

    }

function updateUser(username, userdate){

    }

function createSession(sessionData){

    }

function listSessions(){

    }

function getSessions(sessionIds) {

}

        tableList();

(function(){
    var dbaccess = {};

    dbaccess.createUser = createUser;

    module.exports = dbaccess;

})();