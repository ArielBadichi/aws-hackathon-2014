var uuid = require('node-uuid');
var request = require('request');

module.exports = sendData;

function sendData(stats) {
    var sessionId = String(uuid.v4());
    var stationNumber = stats.stationNumber;
    var numberOfBott = stats.numberOfBott;
    var startTime = stats.startTime;
    var endTime = stats.endTime;
    var userName = stats.userName;

    var body = {
        sessionId: sessionId,
        stationNumber: stationNumber,
        numberOfBott: numberOfBott,
        startTime: startTime,
        endTime: endTime,
	userName: userName
    };

    body = JSON.stringify(body);

    console.log("Posting " + body);

    request.post('http://192.168.11.10:8080/sessions', {body: body}, function(err, response) {
        if (!err) {
            console.log("Post status code " + response.statusCode);
        } else {
            console.log("Post error " + err);
        }
    })
}
