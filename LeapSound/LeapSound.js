/*---------  Leap Intro JS  ------------------*/
/*                    MBK                          */

/***************************************************

This code is used to test out the Leap Motion LeapJS API.
It's reallys just for playing around.  We'll see where it goes :D

****************************************************/

//Constants
var KEYTAP_LIFETIME = 3;
var KEYTAP_START_SIZE = 15;

//Global Variables
var canvas;
var controller;
var context;
var connected = false;
var width;
var height;
var gestureCount = 0;
var frame;
var log;

//Global Buffers
var keyTaps = [];

$(document).ready(Init);

function Init() {
    //Grab the canvas on the page
    canvas = $("#canvas")[0];
    console.log(canvas);
    context = canvas.getContext('2d');
    whateverDiv = $("#whateverDiv").first();

    //Set up the canvas for drawing
    width = canvas.width;
    height = canvas.height;

    context.font = "30px Arial";

    //Init the Gesture Log
    log = $("#GestureLog");

    //Create a controller
    controller = new Leap.Controller({ enableGestures: true });

    //Set the observers for each action
    controller.on('connect', onControllerConnected);
    controller.on('deviceConnected', onControllerConnected);
    controller.on('deviceDisconnected', onControllerDisconnected);
    controller.on('deviceFrame', onFrame);

    //Connect the controller
    controller.connect();


}

function leapToScene(frame, leapPos) {
    var iBox = frame.interactionBox;
    var top = iBox.center[1] + iBox.size[1] / 2;
    var left = iBox.center[0] - iBox.size[0] / 2;

    var x = leapPos[0] - left;
    var y = leapPos[1] - top;

    x /= iBox.size[0];
    y /= iBox.size[1];

    x *= width;
    y *= height;

    return [x, -y];
}

function onControllerConnected() {
    console.log("Controller Connected.");
    connected = true;
}

function onControllerDisconnected() {
    console.log("Controller Disconnected.");
    connected = false;
}

function onFrame(data) {

    frame = data;

    //Clear the canvas
    context.clearRect(0, 0, width, height);

    //Check for gestures
    for (var i = 0; i < frame.gestures.length; i++) {
        var gesture = frame.gestures[i];

        var type = gesture.type;

        switch (type) {
            case "circle":
                onCircle(gesture);
                break;

            case "swipe":
                onSwipe(gesture);
                break;

            case "screenTap":
                onScreenTap(gesture);
                break;

            case "keyTap":
                onKeyTap(gesture);
                break;

            default:
                postToGestureLog("Unrecognized Gesture");
                break;

        }
    }


    //Do all gesture animation/cleanup
    updateKeyTaps();
    drawKeyTaps();

}

function postToGestureLog(string) {

    var text = "<li>" + gestureCount + ".) " + string + "</li>";
    log.prepend(text);
    gestureCount++;
}

function onCircle(gesture) {
    postToGestureLog("Circle");
    var pos = leapToScene(frame, gesture.center);

    var radius = gesture.radius;

    var clockwise = false;

    if (gesture.normal[2] <= 0) {
        clockwise = true;
    }

    context.fillStyle = "#39AECF";
    context.strokeStyle = "#39AECF";
    context.lineWidth = 5;

    context.beginPath();

    context.arc(pos[0], pos[1], radius, 0, Math.PI * 2);

    context.closePath();

    if (clockwise)
        context.stroke();
    else
        context.fill();
}



function onSwipe(gesture) {
    postToGestureLog("Swipe");

    var startPos = leapToScene(frame, gesture.startPosition);
    var pos = leapToScene(frame, gesture.position);

    //Set up the styles for the stroke
    context.strokeStyle = "#FFA040";
    context.lineWidth = 3;

    context.beginPath();

    context.moveTo(startPos[0], startPos[1]);

    context.lineTo(pos[0], pos[1]);

    context.closePath();
    context.stroke();
}

function onScreenTap(gesture) {
    postToGestureLog("Screen Tap");
}

function onKeyTap(gesture) {
    postToGestureLog("Key Tap");

    var pos = leapToScene(frame, gesture.position);

    var time = frame.timestamp;

    keyTaps.push([pos[0], pos[1], time]);
}

function drawKeyTaps() {
    for (var i = 0; i < keyTaps.length; i++) {
        //Get the info for the keyTap entry
        var keyTap = keyTaps[i];
        var age = frame.timestamp - keyTap[2];
        age /= 1000000;
        var x = keyTap[0];
        var y = keyTap[1];

        //Draw the tap
        var completion = age / KEYTAP_LIFETIME;
        var timeleft = 1 - completion;

        //Draw the outer circle
        context.strokeStyle = "#FF2300";
        context.lineWidth = 3;
        context.beginPath();
        context.arc(x, y, KEYTAP_START_SIZE, 0, Math.PI * 2);
        context.closePath();
        context.stroke();

        //Calculate opacity and size, then draw inner circle
        var opacity = timeleft;
        var radius = KEYTAP_START_SIZE * timeleft;
        context.fillStyle = "rgba(256,33,0," + opacity + ")";
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.closePath();
        context.fill();
    }
}

function updateKeyTaps() {
    for (var i = 0; i < keyTaps.length; i++) {
        var keyTap = keyTaps[i];
        var age = frame.timestamp - keyTap[2];
        age /= 1000000;

        if (age >= KEYTAP_LIFETIME) {
            keyTaps.splice(i, 1);
        }
    }
}