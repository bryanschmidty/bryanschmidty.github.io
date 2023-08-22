//////////////////////////////////////////////////////////
// ui_globals.js                                        //
//     Contains all the globals used for the UI Canvas. //
//////////////////////////////////////////////////////////
"use strict";

const ui_default_font                               = "Arial"                   ;
const ui_default_fontsize                           = 12                        ;
const ui_default_text_color                         = "rgb(0,0,0)"              ;
const ui_default_pressed_background_color_button    = "rgb(127,50,0)"           ;
const ui_default_pressed_background_color_text      = "rgb(255,255,255)"        ;
const ui_default_background_color                   = "rgb(255,255,255)"        ;
const ui_default_text_alignment                     = "center"                  ;
const ui_default_line_width                         = 2                         ;
const ui_default_key_color_transition_rate          = 5                         ;

var ui_font                             = ui_default_font            ;
var ui_fontsize                         = ui_default_fontsize        ;
var ui_text_color                       = ui_default_text_color      ;
var ui_background_color                 = ui_default_background_color;
var ui_default_rounded_rectangle_radius = 5                          ;

var ui_default_key_margin               = 10                         ;
var ui_default_key_padding              = 5                          ;
var ui_default_key_width                = 32                         ;

var ui_mouse_selected_key               = null;

// Other shapes may be implemented in the future, but these will do for now
var UI_SHAPE_TYPE = {
    LINE                : 0,
    RECTANGLE           : 1,
    ROUNDED_RECTANGLE   : 2,
    CIRCLE              : 3
};

var ui_component_list = []; // should contain all the UI elements that are to be displayed

var ui_fps_label;

var ui_canvas;
var ui_ctx;