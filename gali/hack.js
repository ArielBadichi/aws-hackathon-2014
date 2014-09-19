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
                console.log("Got QR data: " + messageString);
            }
            catch (err) {
                console.log("Error in QR handler: " + err);
                qrMessage = null;
            }
        });

        my.led.turnOff();

        detector.on("up", function() {
            console.log("Item (" + detector.currentValue() + ")");
            my.led.turnOn();
            batcher(process.hrtime());
        });

        detector.on("down", function() {
            console.log("No item (" + detector.currentValue() + ")");
            my.led.turnOff();
        });

        batcher.on("batch", function(batch) {
            if (qrMessage) {
                sendToServer({
                    stationNumber: 1,
                    numberOfBottles: batch.length,
                    startTime: batcher.startTime().toISOString(),
                    endTime: batcher.endTime().toISOString(),
                    userName: qrMessage.name
                });
                qrMessage = null;
            }
            console.log("Batch: " + JSON.stringify(batch));
        });

        every(10, function() {
            detector(my.lightsensor.analogRead());
        });
    }
}).start();
