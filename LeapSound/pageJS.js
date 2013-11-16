/*------------------  page JS  --------------------*/
/*                    MBK                          */

/******************************************************************************

This code is used simply to handle content on the page, from logging gestures
to moving content around.  This can be thought of as a general utilities JS
file.

*******************************************************************************/

function postToGestureLog(string) {

    var text = "<li>" + gestureCount + ".) " + string + "</li>";
    log.prepend(text);
    gestureCount++;
}