////////////////////////////////////////////////////////////////
// ui_mouse_events.js                                         //
//     Contains the functions used for mouse interaction with //
//     the canvas.                                            //
////////////////////////////////////////////////////////////////
"use strict";

var MOUSE_CLICK_ENUM = {
    LEFT    : 1,
    MIDDLE  : 2,
    RIGHT   : 3
};

////////////////////////////////////////////////////////
//                  getMousePos                       //
// Function:                                          //
//     Called by an event handler that passes it the  //
//     event object and returns the relative position //
//     of the cursor to the canvas window.            //
// Return value:                                      //
//     Object with the properties:                    //
//         x: Number, y: Number                       //
////////////////////////////////////////////////////////
function getMousePos(e) 
{
    var rect = piano_canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function ui_mouse_wheel(event)
{
    mwheel = true;
    if (event.deltaY < 0) { mwheeldown = false; mwheelup = true ; }
    else                  { mwheeldown = true ; mwheelup = false; }
}

function ui_mouse_down(event)
{
    switch(event.which)
    {
        case MOUSE_CLICK_ENUM.LEFT:
        {
            mdownleft = true;
            break;
        }
        case MOUSE_CLICK_ENUM.MIDDLE:
        {
            // No functionality for middle click yet
            break;
        }
        case MOUSE_CLICK_ENUM.RIGHT:
        {
            mdownright = true;
            break;
        }
    }

    mousestartpos = getMousePos(event);
    mousepos = mousestartpos;

} // end of ui_mouse_down(event)

function ui_mouse_move(event)
{
    mousepos = getMousePos(event);
} // end of ui_mouse_move(event)

function ui_mouse_up(event)
{
    switch(event.which)
    {
        case 1:
        {
            // left click
            mdownleft = false;
            break;
        }
        case 2:
        {
            // middle click
            break;
        }
        case 3:
        {
            // right click
            mdownright = false;
            break;
        }
    }

    mousepos = getMousePos(event);
}