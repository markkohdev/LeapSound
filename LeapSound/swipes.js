/*----------------  Swipe JS  --------------------*/
/*                    MBK                          */

/***************************************************

This is the code used for handling swipe gestures
captured by the Leap Motion Controller.  When a swipe
is found, onSwipe(frame, gesture) should be called to
handle the data.

****************************************************/

//Constants

//Globals

//Global Buffers

function onSwipe(frame,gesture) {
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