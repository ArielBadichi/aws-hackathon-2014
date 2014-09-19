var uuid = require('node-uuid');
var request = require('request');

module.exports = sendData;

function sendData(stats) {
    var sessionId = String(uuid.v4());
    var stationNumber = stats.stationNumber;
    var numberOfBottles = stats.numberOfBottles;
    var startTime = stats.startTime;
    var endTime = stats.endTime;
    var userName = stats.userName;

    var body = {
        sessionId: sessionId,
        stationNumber: stationNumber.toString(),
        numberOfBottles: numberOfBottles.toString(),
        startTime: startTime,
        endTime: endTime,
	userName: userName
    };

    //body = JSON.stringify(body);

    console.log("Posting " + body);

    request.post({
        url: 'http://rcyclo-528772216.us-west-2.elb.amazonaws.com/sessions',
        json: body
    }, function(err, response) {
        if (!err) {
            console.log("Post status code " + response.statusCode);
        } else {
            console.log("Post error " + err);
        }
    })
}
