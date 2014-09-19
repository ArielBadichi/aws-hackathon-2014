var EventEmitter = require("events").EventEmitter;

module.exports = batcher;

function batcher() {
    var expiryTime = 10 * 1000;
    var timer = null;
    var batch = [];
    var emitter = new EventEmitter();
    var startTime = null;
    var endTime = null;

    function run(x) {
        if (batch.length === 0) {
            startTime = new Date();
        }
        endTime = new Date();
        batch.push(x);
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(flush, expiryTime);
    }

    run.expiryTime = function(value) {
        if (!arguments.length) return expiryTime;
        expiryTime = value;
        return run;
    };

    run.on = function(event, fn) {
        emitter.on(event, fn);
        return run;
    };

    run.startTime = function() {
        return startTime;
    };

    run.endTime = function() {
        return endTime;
    };

    function flush() {
        emitter.emit("batch", batch);
        batch = [];
        timer = null;
    }

    return run;
}
