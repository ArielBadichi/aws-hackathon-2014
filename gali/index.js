var v4l2camera = require("v4l2camera");
var cam = new v4l2camera.Camera("/dev/video0");
var fs = require("fs");
var png = require("png");
var Canvas = require('canvas');
var Image = Canvas.Image;
var qrcode = require('jsqrcode')(Canvas);
var async = require('async');

cam.configSet({width: 352, height: 288});
cam.start();

var takePhoto = function(callback) {
    console.log("[c] - Capturing photo");

    cam.capture(function (success) {
        var rgb = cam.toRGB();
        var img = new png.Png(Buffer(rgb), cam.width, cam.height, "rgb");

        img.encode(function (buf) {
            callback(null, buf);
        });
    });
};


var readQR = function(buf, callback) {
    var image = new Image();

    image.onload = function(){
        var result;
        try {
            result = qrcode.decode(image);
            console.log('[+] - result of qr code: ' + result);
        } catch (e) {
            console.log('[-] - unable to read qr code');
        }
    };

    image.src = buf;
    callback(null, null);
};


function run(callback) {
    async.waterfall([
        takePhoto,
        readQR
    ], function () {callback(null, null)});
}

async.forever(run);