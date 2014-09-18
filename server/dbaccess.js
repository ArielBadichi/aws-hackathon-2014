/**
 * Created by sergeyr on 9/18/14.
 */
var ddb = require('dynamodb').ddb({ accessKeyId: 'AKIAI5RGYGTBNUJTMYNA',
    secretAccessKey: '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' });

function createuser(userName){
    ddb.listTables({}, function(err, res) {});
    TableNames: ['users']
}

function deleteuser(userNmae){

}

function getuserdata(userName){

}

function getuserbottle(){

}
