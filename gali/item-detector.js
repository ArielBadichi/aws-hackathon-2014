var EventEmitter = require("events").EventEmitter;

module.exports = detector;

function detector() {
    var lowThreshold = 200;
    var highThreshold = 400;
    var window;
    var k = 0;
    var state = 0;
    var emitter = new EventEmitter();

    createWindow(10);

    function run(x) {
        window[k] = x;
        k++;
        if (k === window.length) {
            k = 0;
        }

        check();
    }

    run.windowSize = function(value) {
        if (!arguments.length) return window.length;
        window = createWindow(value);
        return run;
    };

    run.lowThreshold = function(value) {
        if (!arguments.length) return lowThreshold;
        lowThreshold = value;
        return run;
    };

    run.highThreshold = function(value) {
        if (!arguments.length) return highThreshold;
        highThreshold = value;
        return run;
    };

    run.on = function(event, fn) {
        emitter.on(event, fn);
        return run;
    };

    run.currentValue = function() {
        return windowAverage();
    };

    function createWindow(n) {
        window = new Array(n);
        var initialValue = lowThreshold + (highThreshold - lowThreshold) / 2;
        k = 0;
        for (var i = 0; i < n; i++) {
            window[i] = initialValue;
        }
    }

    function windowAverage() {
        var sum = 0;
        for (var i = 0; i < window.length; i++) {
            sum += window[i];
        }
        return sum / window.length;
    }

    function check() {
        var avg = windowAverage();
        switch (state) {
        case 0:
            if (avg >= highThreshold) {
                state = 1;
                emitter.emit("down");
            }
            break;
        case 1:
            if (avg <= lowThreshold) {
                state = 0;
                emitter.emit("up");
            }
            break;
        default:
            break;
        }
    }

    return run;
}
