//////////////////////////////////////////
// piano_globals.js                     //
// Global variables used by the piano   //
//////////////////////////////////////////
"use strict";

var piano_canvas        = null;
var piano_ctx           = null;
var piano_instrument    = null;

var piano_keyhandler    = null;  // key handling object, manages user input

var SCREEN_WIDTH        = null;
var SCREEN_HEIGHT       = null;

var PIANO_KEY_DIRECTION = {
    KEYUP   : 0,
    KEYDOWN : 1,
    NONE    : 2
};

var PIANO_KEY_ACTION = {
    NOTE        : 0,
    TRANSPOSE   : 1,
    VOLUME      : 2,
    SUSTAIN     : 3,
    NONE        : 4
};

var audio_context       = null;

var mousepos            = {x: 0, y: 0};
var mousestartpos       = {x: 0, y: 0};

var mousedif            = {x: 0, y: 0};

var mdownleft           = false;
var mdownright          = false;
var mlastdownleft       = false;
var mlastdownright      = false;
var mwheel              = false;
var mwheelup            = false;
var mwheeldown          = false;
var mlastwheel          = false;
var mlastwheelup        = false;
var mlastwheeldown      = false;
var MOUSE_DEBUG_MODE    = false;