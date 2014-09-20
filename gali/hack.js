var Cylon = require("cylon");
var detector = require("./item-detector")();
var batcher = require("./batcher")();
var zmq = require("zmq");
var sendToServer = require("./sendToServer");

Cylon.robot({
    connection: { name: "galileo", adaptor: "intel-iot" },
    device: [{
        name: "lightsensor",
        driver: "analogSensor",
        pin: 1
    }, {
        name: "led",
        driver: "led",
        pin: 7
    }, {
        name: "board",
        driver: "led",
        pin: 2
    }],

    work: function(my) {
        var qrMessage = null;
        var sub = zmq.socket("sub");
        sub._subscribe = "";
        sub.connect("tcp://127.0.0.1:8283");
        sub.on("message", function(messageBuffer) {
            try {
                var messageString = messageBuffer.toString();
                qrMessage = messageString;
                console.log("[w] Welcome: " + messageString);
            }
            catch (err) {
                console.log("Error in QR handler: " + err);
                qrMessage = null;
            }
        });

        my.led.turnOff();

        detector.on("up", function() {
            console.log("[+] Bottle inserted (" + detector.currentValue() + ")");
            my.led.turnOn();
            my.board.turnOn();
            batcher(process.hrtime());
        });

        detector.on("down", function() {
            console.log("[-] Bottle removed (" + detector.currentValue() + ")");
            my.led.turnOff();
            my.board.turnOff();
        });

        batcher.on("batch", function(batch) {
            if (qrMessage) {
                sendToServer({
                    stationNumber: 1,
                    numberOfBottles: batch.length,
                    startTime: batcher.startTime().toISOString(),
                    endTime: batcher.endTime().toISOString(),
                    userName: qrMessage
                });
                qrMessage = null;
            }
            console.log("[s] Sending data to AWS cloud: " + JSON.stringify(batch));
        });

        every(10, function() {
            detector(my.lightsensor.analogRead());
        });
    }
}).start();
