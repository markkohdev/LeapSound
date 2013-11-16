/*---------  Leap Intro JS  ------------------*/
/*                    MBK                          */

/***************************************************

This code is used to test out the Leap Motion LeapJS API.
It's reallys just for playing around.  We'll see where it goes :D

****************************************************/

//Constants



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
                //onCircle(frame,gesture);
                break;

            case "swipe":
                //onSwipe(gesture);
                break;

            case "screenTap":
                //onScreenTap(gesture);
                break;

            case "keyTap":
                onKeyTap(frame, gesture);
                break;

            default:
                postToGestureLog("Unrecognized Gesture");
                break;

        }
    }


    //Do all gesture animation/cleanup
    updateKeyTaps(frame);
    drawKeyTaps(frame);
    //updateCircles(frame);
    //drawCircles(frame);

}

