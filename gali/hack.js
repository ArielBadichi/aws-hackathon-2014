var Cylon = require("cylon");
var detector = require("./item-detector")();
var batcher = require("./batcher")();

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
            console.log("Batch: " + JSON.stringify(batch));
        });

        every(10, function() {
            detector(my.lightsensor.analogRead());
        });
    }
}).start();
