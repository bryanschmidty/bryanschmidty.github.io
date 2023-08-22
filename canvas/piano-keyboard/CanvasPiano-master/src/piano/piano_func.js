//////////////////////////////////////////
// piano_func.js                        //
// Useful functions used by the piano   //
//////////////////////////////////////////
"use strict";

//////////////////////////////////////////////////////////////////
//                         colorTransition                      //
// Function:                                                    //
//     Slowly steps from start to end by magnitude of step_size //
// Return value:                                                //
//     color encoded string                                     //
// Source:                                                      /////////////////////////////////////////////
// https://stackoverflow.com/questions/46885541/how-can-i-transition-between-two-rgb-colours-in-javascript //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function colorTransition(start, end, step_size)
{
    if (start.r == end.r)
    {
        if (start.g == end.g)
        {
            if (start.b == end.b)
            {
                return 'rgb(' + end.r + ',' + end.g + ',' + end.b + ')';
            }
        }
    }

    var r = Math.round(approach(end.r, start.r, step_size));
    var g = Math.round(approach(end.g, start.g, step_size));
    var b = Math.round(approach(end.b, start.b, step_size));
    
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent)
{
  var rect = canvasDom.getBoundingClientRect();
  return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top
    };
}

//////////////////////////////////////////////////////////////////
//                          stringToRGB                         //
// Function:                                                    //
//     Converts a string of the form rgb(r,g,b) to an object    //
// Return value:                                                //
//     Object {r,g,b}                                           //
//////////////////////////////////////////////////////////////////
function stringToRGB(str)
{
    var found_number = false;
    var found_index = 0;
    var found_index_end = 0;
    var r = null;
    var g = null;
    var b = null;

    for (var i = 0; i < str.length; i++)
    {
        if (found_number)
        {
            if (isNaN(Number(str[i])))
            {
                found_index_end = i;
                found_number = false;
                
                if (r == null)
                {
                	r = Number(str.substring(found_index, found_index_end));
                }
                else if (g == null)
                {
                	g = Number(str.substring(found_index, found_index_end));
                }
                else if (b == null)
                {
                	b = Number(str.substring(found_index, found_index_end));
                }
            }
        }
        else 
        {
            if (!isNaN(Number(str[i])))
            {
                found_number = true;
                found_index = i;
            }
        }
    }
    
    return {r: r, g: g, b: b};
}

//////////////////////////////////////////
//          convertActionString         //
// Function:                            //
//     Converts a string to an enumator //
// Return value:                        //
//     PIANO_KEY_ACTION enumerator      //
//////////////////////////////////////////
function convertActionString(action_string)
{
    if (isNaN(action_string))
    {
        if (action_string == "note")
        {
            return PIANO_KEY_ACTION.NOTE;
        }
        if (action_string == "sustain")
        {
            return PIANO_KEY_ACTION.SUSTAIN;
        }
        if (action_string == "transpose")
        {
            return PIANO_KEY_ACTION.TRANSPOSE;
        }
        if (action_string == "volume")
        {
            return PIANO_KEY_ACTION.VOLUME;
        }

        return PIANO_KEY_ACTION.NONE;
    }
    else
    {
        // Wasn't really a string
        return action_string;
    }
}

//////////////////////////////////////////////////////
//                   isSpecialKey                   //
// Function:                                        //
//     Determines whether a key is non-alphanumeric //
//     such as capslock or function keys            //
// Return value:                                    //
//     boolean                                      //
//////////////////////////////////////////////////////
function isSpecialKey(key)
{
    // There are a lot of other keys that are non-alphanumeric, but these are the ones I care most about
    var special_key_list = [
        "ShiftLeft", "ShiftRight", "MetaLeft", "MetaRight",
        "AltLeft", "AltRight", "Tab", "Escape",
        "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12",
        "Enter", "ControlLeft", "ControlRight", "ContextMenu"
    ];
    if (special_key_list.includes(key))
    {
        return true;
    }

    return false;
}

///////////////////////////////////////////
//               invertColor             //
// Function:                             //
//     Converts a color to its opposite. //
//     If bw is true, then it will turn  //
//     the color to be black or white.   //
// Return value:                         //
//     string                            //
// Source:                               /////////////////////////////////////////////////////////////////////////
// https://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function invertColor(hex, bw) 
{
    if (hex.indexOf('#') === 0) 
    {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) 
    {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) 
    {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) 
    {
        // http://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}
function padZero(str, len) 
{
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

//////////////////////////////////////////////////////////
//                      approach                        //
// Function:                                            //
//     A basic linear interpolation function.           //
//     Approaches flgoal in fldelta steps.              //
//     If flcurrent is within +- fldelta of the flgoal, //
//     then the flgoal is returned                      //
//     else it approaches flgoal another step.          //
// Return value:                                        //
//     Float                                            //
// Source:                                              //
// This function was on youtube, but I don't remember   //
// the title.                                           //
//////////////////////////////////////////////////////////
function approach(flgoal, flcurrent, fldelta)
{
	var fldifference = flgoal - flcurrent;

	if (fldifference >  fldelta) return flcurrent + fldelta;
	if (fldifference < -fldelta) return flcurrent - fldelta;

	return flgoal;
}

//////////////////////////////////////////////////
//                  SideEnum                    //
// Enumerator:                                  //
//     Used in collision code to tell what side //
//     an object collides with another.         //
// Types:                                       //
//     Number                                   //
//////////////////////////////////////////////////
var SideEnum = {
    UP   : 0,
    DOWN : 1,
    RIGHT: 2,
    LEFT : 3,
    ERROR: 4
}

///////////////////////////////////////////
//              SideString               //
// String array:                         //
//     Converts SideEnum to string       //
//     Used mainly for logging purposes. //
// Types:                                //
//     string                            //
///////////////////////////////////////////
var SideString = [
    "up",
    "down",
    "right",
    "left",
    "error"
];

////////////////////////////////////////////////
//             checkPointCollision            //
// Function:                                  //
//     Returns a boolean value whether or not //
//     a point is within a rectangle.         //
//                                            //
//     Returns false if either parameter is   //
//     null.                                  //
//                                            //
//     Throws exception if either parameters  //
//     are missing x,y,w or h properties      //
// Return value:                              //
//     boolean                                //
////////////////////////////////////////////////
function checkPointCollision(rectangle, point)
{
    if (rectangle == null) return false;
    if (point     == null) return false;

    if (rectangle.x == null || rectangle.y == null) 
    {
        console.log(rectangle + " missing x or y property");
        return false;
    }
    if (point.x == null || point.y == null) 
    {
        console.log(point     + " missing x or y property");
        return false;
    }

    if (rectangle.width == null || rectangle.height == null)
    {
        console.log(rectangle + " missing width or height property")
        return false;
    }
    
    return point.x > rectangle.x && point.x < rectangle.x + rectangle.width
        && point.y > rectangle.y && point.y < rectangle.y + rectangle.height;
}

////////////////////////////////////////////////////////////
//                    colorNameToHex                      //
// Function:                                              //
//     Uses the color parameter to index the colors table //
//     to return a hex string of a color.                 //
// Return value:                                          //
//     string                                             //
////////////////////////////////////////////////////////////
function colorNameToHex(color)
{
    if (typeof colors[color.toLowerCase()] != 'undefined')
        return colors[color.toLowerCase()];

    return null;
}