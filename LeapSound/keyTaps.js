/*----------------  keyTap JS  --------------------*/
/*                    MBK                          */

/***************************************************

This is the code used for handling keyTap gestures
captured by the Leap Motion Controller.  When a keyTap
is found, onKeyTap(frame, gesture) should be called to
handle the data.

****************************************************/

//Constants
var KEYTAP_LIFETIME = 3;
var KEYTAP_START_SIZE = 15;

//Globals
var previousCircleGesture = 0;

//Global Buffers
var keyTaps = [];

function onKeyTap(frame,gesture) {
    //postToGestureLog("Key Tap");

    var pos = leapToScene(frame, gesture.position);

    var time = frame.timestamp;

    keyTaps.push([pos[0], pos[1], time]);
}

function drawKeyTaps(frame) {
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

function updateKeyTaps(frame) {
    for (var i = 0; i < keyTaps.length; i++) {
        var keyTap = keyTaps[i];
        var age = frame.timestamp - keyTap[2];
        age /= 1000000;

        if (age >= KEYTAP_LIFETIME) {
            keyTaps.splice(i, 1);
        }
    }
}