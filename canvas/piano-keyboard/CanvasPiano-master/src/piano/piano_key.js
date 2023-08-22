/////////////////////////////////////////////////////////////////////
// key.js                                                          //
//     Object to register keyboard input with a Keyhandler object. //
/////////////////////////////////////////////////////////////////////
"use strict";

class Key
{
    constructor(key)
    {
        this.key = key;
        this.isPressed = false;
        this.lastPressed = false;
    }
}