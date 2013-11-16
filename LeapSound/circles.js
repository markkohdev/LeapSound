/*----------------  Circle JS  --------------------*/
/*                    MBK                          */

/***************************************************

This is the code used for handling circle gestures
captured by the Leap Motion Controller.  When a circle
is found, onCircle(frame, gesture) should be called to
handle the data.

****************************************************/

//Constants
var CIRCLE_LIFETIME = 3;

//Globals
var previousCircleGesture = 0;

//Global Buffers
var circles = [];


function onCircle(frame, gesture) {
    //Grab the time so we can make sure our circles aren't too close
    var time = frame.timestamp / 1000000;
    if (time - previousCircleGesture > 2) {

        postToGestureLog("Circle");

        var pos = leapToScene(frame, gesture.center);

        var radius = gesture.radius;

        /*
        var clockwise = false;   
        if (gesture.normal[2] <= 0) {
            clockwise = true;
        }
        */
        //circles.push([pos[0], pos[1], radius, clockwise, time]);

        circles.push([pos[0], pos[1], radius, time]);
        console.log([pos[0], pos[1], radius, time]);
        previousCircleGesture = time;
    }

}

function drawCircles(frame) {
    for (var i = 0; i < circles.length; i++) {
        //Get the info for the keyTap entry
        var circle = circles[i];
        var age = frame.timestamp - circle[3];
        var x = circle[0];
        var y = circle[1];
        var radius = circle[2];

        //Draw the tap
        var completion = age / CIRCLE_LIFETIME;
        var timeleft = 1 - completion;

        //Draw the outer circle
        context.strokeStyle = "#39AECF";
        context.lineWidth = 5;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.closePath();
        context.stroke();
        console.log("Circled");

        //Calculate opacity and size, then draw inner circle
        var opacity = timeleft;
        var innerRadius = radius * timeleft;
        context.fillStyle = "rgba(57,174,207," + opacity + ")";
        context.beginPath();
        context.arc(x, y, innerRadius, 0, Math.PI * 2);
        context.closePath();
        context.fill();
    }
}

function updateCircles(frame) {
    for (var i = 0; i < circles.length; i++) {
        var circle = circles[i];
        var age = frame.timestamp - circle[3];

        if (age >= CIRCLE_LIFETIME) {
            circles.splice(i, 1);
        }
    }
}