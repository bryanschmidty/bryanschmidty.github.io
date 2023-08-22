//////////////////////////////////////////////////
// ui_piano.js                                  //
// Composition of the Piano's User-interface    //
//////////////////////////////////////////////////
"use strict";

/*
    Main layout of the piano ui
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
 HTML-> //                                            Utility Section                                           //
        //                        File-IO | Instruments | Keymap | Soundfont | Playback                         //

        //////////////////////////////////////////////////////////////////////////////////////////////////////////
Canvas->//------------------------------------------------------------------------------------------------------//
        //                                              Key Section                                             //
        //                                Volume | Sustain | Transposition | Octave                             //
        // [ESC]  [F1][F2][F3][F4] [F5][F6][F7][F8] [F9][F10][F11][F12]  [Psc] [Scr] [PAUS]                     //
        // [~] [1] [2] [3] [4] [5] [6] [7] [8] [9] [0] [-] [=] [BCKSPC]  [INS] [HME] [PGUP] [N] [/] [*] [-]     // 
        // [TAB] [Q] [W] [E] [R] [T] [Y] [U] [I] [O] [P] [{] [}] [_\__]  [DEL] [END] [PGDN] [7] [8] [9] [ ]     //
        // [_CAPS] [A] [S] [D] [F] [G] [H] [J] [K] [L] [;] ['] [_ENTER]                     [4] [5] [6] [+]     //
        // [_SHIFT_] [Z] [X] [C] [V] [B] [N] [M] [,] [.] [/] [__SHIFT_]        [ ^ ]        [1] [2] [3] [     ] //
        // [CTRL] [WIN] [ALT] [_____SPACE_____] [ALT] [FN] [DOC] [CTRL]  [ <-] [ v ] [ -> ] [__0__] [.] [ENTER] //
        //------------------------------------------------------------------------------------------------------//
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

// Parent of all the other piano components
var ui_piano_component              = null;

var ui_piano_key_section            = null;

function ui_piano_initialize()
{

    ui_piano_key_section = {
        x           :   0,
        y           :   0,
        width       :   SCREEN_WIDTH,
        height      :   250,
        component   :   null
    };
    ui_piano_component             = new UI_Component();
    ui_piano_key_section.component = new UI_Component();

    ui_piano_component.addComponent(ui_piano_key_section.component);

    ui_piano_key_section_initialize();
    ui_piano_key_section.component.update = ui_piano_key_update;
    ui_piano_key_section.component.draw   = ui_piano_key_draw;

    ui_component_list.push(ui_piano_component);
}


//////////////////////////////////////////////////////////////////////
//                  ui_piano_key_section_initialize                 //
// Function:                                                        //
//     Initializes all the ui elements belonging to this section    //
// Return value:                                                    //
//     none                                                         //
//////////////////////////////////////////////////////////////////////
function ui_piano_key_section_initialize()
{
    var piano_key_section_xoffset = ui_piano_key_section.x + ui_default_key_margin;
    var piano_key_section_yoffset = ui_piano_key_section.y + ui_default_key_margin * 2;

    var xoffset = 32 + ui_default_key_padding;
    var yoffset = 32 + ui_default_key_padding;

    // Used to modify the width or height of a special key
    var backspace_key   = null;
    var tab_key         = null;
    var backslash_key   = null;
    var spacebar        = null;
    var shift_key       = null;
    var caps_key        = null;
    var control_key     = null;
    var controlright_key= null;
    var alt_key         = null;
    var enter_key       = null;
    var plus_key        = null;
    var zero_key        = null;
    var contextmenu_key = null;
    
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Escape"        , "Esc"          , piano_key_section_xoffset + ( 0   * xoffset), piano_key_section_yoffset + (0 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("F1"            , "F1"           , piano_key_section_xoffset + ( 2   * xoffset), piano_key_section_yoffset + (0 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("F2"            , "F2"           , piano_key_section_xoffset + ( 3   * xoffset), piano_key_section_yoffset + (0 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("F3"            , "F3"           , piano_key_section_xoffset + ( 4   * xoffset), piano_key_section_yoffset + (0 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("F4"            , "F4"           , piano_key_section_xoffset + ( 5   * xoffset), piano_key_section_yoffset + (0 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("F5"            , "F5"           , piano_key_section_xoffset + ( 6.6 * xoffset), piano_key_section_yoffset + (0 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("F6"            , "F6"           , piano_key_section_xoffset + ( 7.6 * xoffset), piano_key_section_yoffset + (0 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("F7"            , "F7"           , piano_key_section_xoffset + ( 8.6 * xoffset), piano_key_section_yoffset + (0 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("F8"            , "F8"           , piano_key_section_xoffset + ( 9.6 * xoffset), piano_key_section_yoffset + (0 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("F9"            , "F9"           , piano_key_section_xoffset + (11.1 * xoffset), piano_key_section_yoffset + (0 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("F10"           , "F10"          , piano_key_section_xoffset + (12.1 * xoffset), piano_key_section_yoffset + (0 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("F11"           , "F11"          , piano_key_section_xoffset + (13.1 * xoffset), piano_key_section_yoffset + (0 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("F12"           , "F12"          , piano_key_section_xoffset + (14.1 * xoffset), piano_key_section_yoffset + (0 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("PrintScreen"   , "PrtSc"        , piano_key_section_xoffset + (16   * xoffset), piano_key_section_yoffset + (0 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("ScrollLock"    , "Scrl"         , piano_key_section_xoffset + (17   * xoffset), piano_key_section_yoffset + (0 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Pause"         , "Paus"         , piano_key_section_xoffset + (18   * xoffset), piano_key_section_yoffset + (0 * yoffset)) );

    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Backquote"     , "`"            , piano_key_section_xoffset + ( 0 * xoffset), piano_key_section_yoffset + (1 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Digit1"        , "1"            , piano_key_section_xoffset + ( 1 * xoffset), piano_key_section_yoffset + (1 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Digit2"        , "2"            , piano_key_section_xoffset + ( 2 * xoffset), piano_key_section_yoffset + (1 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Digit3"        , "3"            , piano_key_section_xoffset + ( 3 * xoffset), piano_key_section_yoffset + (1 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Digit4"        , "4"            , piano_key_section_xoffset + ( 4 * xoffset), piano_key_section_yoffset + (1 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Digit5"        , "5"            , piano_key_section_xoffset + ( 5 * xoffset), piano_key_section_yoffset + (1 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Digit6"        , "6"            , piano_key_section_xoffset + ( 6 * xoffset), piano_key_section_yoffset + (1 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Digit7"        , "7"            , piano_key_section_xoffset + ( 7 * xoffset), piano_key_section_yoffset + (1 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Digit8"        , "8"            , piano_key_section_xoffset + ( 8 * xoffset), piano_key_section_yoffset + (1 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Digit9"        , "9"            , piano_key_section_xoffset + ( 9 * xoffset), piano_key_section_yoffset + (1 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Digit0"        , "0"            , piano_key_section_xoffset + (10 * xoffset), piano_key_section_yoffset + (1 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Minus"         , "-"            , piano_key_section_xoffset + (11 * xoffset), piano_key_section_yoffset + (1 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Equal"         , "="            , piano_key_section_xoffset + (12 * xoffset), piano_key_section_yoffset + (1 * yoffset)) );
    backspace_key =                              new UI_Piano_Key("Backspace"     , "Backspace"    , piano_key_section_xoffset + (13 * xoffset), piano_key_section_yoffset + (1 * yoffset));
    backspace_key.setWidth(64 + 2 * ui_default_key_padding);
    ui_piano_key_section.component.addComponent(backspace_key);

    tab_key =                                    new UI_Piano_Key("Tab"           , "Tab"          , piano_key_section_xoffset + ( 0 * xoffset), piano_key_section_yoffset + (2 * yoffset));
    tab_key.setWidth(48 + 2 * ui_default_key_padding);
    var tab_width = tab_key.getWidth() + 3 * ui_default_key_padding;
    ui_piano_key_section.component.addComponent(tab_key);
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("KeyQ"          , "Q"            , tab_width + ( 0 * xoffset), piano_key_section_yoffset + (2 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("KeyW"          , "W"            , tab_width + ( 1 * xoffset), piano_key_section_yoffset + (2 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("KeyE"          , "E"            , tab_width + ( 2 * xoffset), piano_key_section_yoffset + (2 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("KeyR"          , "R"            , tab_width + ( 3 * xoffset), piano_key_section_yoffset + (2 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("KeyT"          , "T"            , tab_width + ( 4 * xoffset), piano_key_section_yoffset + (2 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("KeyY"          , "Y"            , tab_width + ( 5 * xoffset), piano_key_section_yoffset + (2 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("KeyU"          , "U"            , tab_width + ( 6 * xoffset), piano_key_section_yoffset + (2 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("KeyI"          , "I"            , tab_width + ( 7 * xoffset), piano_key_section_yoffset + (2 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("KeyO"          , "O"            , tab_width + ( 8 * xoffset), piano_key_section_yoffset + (2 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("KeyP"          , "P"            , tab_width + ( 9 * xoffset), piano_key_section_yoffset + (2 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("BracketLeft"   , "["            , tab_width + (10 * xoffset), piano_key_section_yoffset + (2 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("BracketRight"  , "]"            , tab_width + (11 * xoffset), piano_key_section_yoffset + (2 * yoffset)) );
    backslash_key =                              new UI_Piano_Key("Backslash"     , "\\"           , tab_width + (12 * xoffset), piano_key_section_yoffset + (2 * yoffset));
    backslash_key.setWidth(38 + 2 * ui_default_key_padding);
    ui_piano_key_section.component.addComponent(backslash_key);

    caps_key =                                   new UI_Piano_Key("CapsLock"      , "Caps"         , piano_key_section_xoffset + ( 0 * xoffset), piano_key_section_yoffset + (3 * yoffset));
    caps_key.setWidth(59 + 2 * ui_default_key_padding);
    ui_piano_key_section.component.addComponent(caps_key);
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("KeyA"          , "A"            , piano_key_section_xoffset + ( 2 * xoffset), piano_key_section_yoffset + (3 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("KeyS"          , "S"            , piano_key_section_xoffset + ( 3 * xoffset), piano_key_section_yoffset + (3 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("KeyD"          , "D"            , piano_key_section_xoffset + ( 4 * xoffset), piano_key_section_yoffset + (3 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("KeyF"          , "F"            , piano_key_section_xoffset + ( 5 * xoffset), piano_key_section_yoffset + (3 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("KeyG"          , "G"            , piano_key_section_xoffset + ( 6 * xoffset), piano_key_section_yoffset + (3 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("KeyH"          , "H"            , piano_key_section_xoffset + ( 7 * xoffset), piano_key_section_yoffset + (3 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("KeyJ"          , "J"            , piano_key_section_xoffset + ( 8 * xoffset), piano_key_section_yoffset + (3 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("KeyK"          , "K"            , piano_key_section_xoffset + ( 9 * xoffset), piano_key_section_yoffset + (3 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("KeyL"          , "L"            , piano_key_section_xoffset + (10 * xoffset), piano_key_section_yoffset + (3 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Semicolon"     , ";"            , piano_key_section_xoffset + (11 * xoffset), piano_key_section_yoffset + (3 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Quote"         , "'"            , piano_key_section_xoffset + (12 * xoffset), piano_key_section_yoffset + (3 * yoffset)) );
    enter_key =                                  new UI_Piano_Key("Enter"         , "Enter"        , piano_key_section_xoffset + (13 * xoffset), piano_key_section_yoffset + (3 * yoffset));
    enter_key.setWidth(64 + 2 * ui_default_key_padding);
    ui_piano_key_section.component.addComponent(enter_key);

    shift_key =                                  new UI_Piano_Key("ShiftLeft"     , "Shift"        , piano_key_section_xoffset + ( 0 * xoffset), piano_key_section_yoffset + (4 * yoffset));
    shift_key.setWidth(80 + 2 * ui_default_key_padding);
    ui_piano_key_section.component.addComponent(shift_key);
    var shift_width = shift_key.getWidth() + ui_default_key_padding * 3;
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("KeyZ"          , "Z"            , shift_width + ( 0 * xoffset), piano_key_section_yoffset + (4 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("KeyX"          , "X"            , shift_width + ( 1 * xoffset), piano_key_section_yoffset + (4 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("KeyC"          , "C"            , shift_width + ( 2 * xoffset), piano_key_section_yoffset + (4 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("KeyV"          , "V"            , shift_width + ( 3 * xoffset), piano_key_section_yoffset + (4 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("KeyB"          , "B"            , shift_width + ( 4 * xoffset), piano_key_section_yoffset + (4 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("KeyN"          , "N"            , shift_width + ( 5 * xoffset), piano_key_section_yoffset + (4 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("KeyM"          , "M"            , shift_width + ( 6 * xoffset), piano_key_section_yoffset + (4 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Comma"         , ","            , shift_width + ( 7 * xoffset), piano_key_section_yoffset + (4 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Period"        , "."            , shift_width + ( 8 * xoffset), piano_key_section_yoffset + (4 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Slash"         , "/"            , shift_width + ( 9 * xoffset), piano_key_section_yoffset + (4 * yoffset)) );
    shift_key =                                  new UI_Piano_Key("ShiftRight"    , "Shift"        , shift_width + (10 * xoffset), piano_key_section_yoffset + (4 * yoffset));
    shift_key.setWidth(80 + 2 * ui_default_key_padding);
    ui_piano_key_section.component.addComponent(shift_key);

    control_key =                                new UI_Piano_Key("ControlLeft"   , "Ctrl"         , piano_key_section_xoffset + ( 0 * xoffset), piano_key_section_yoffset + (5 * yoffset));
    control_key.setWidth(40 + ui_default_key_padding);
    var control_width = control_key.getWidth() + 3 * ui_default_key_padding;
    ui_piano_key_section.component.addComponent( control_key );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("MetaLeft"      , "Win"          , control_width + ( 0 * xoffset), piano_key_section_yoffset + (5 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("AltLeft"       , "Alt"          , control_width + ( 1 * xoffset), piano_key_section_yoffset + (5 * yoffset)) );
    spacebar =                                   new UI_Piano_Key("Space"         , "Space"        , control_width + ( 2 * xoffset), piano_key_section_yoffset + (5 * yoffset));
    spacebar.setWidth(268 + 2 * ui_default_key_padding);
    ui_piano_key_section.component.addComponent(spacebar);
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("AltRight"      , "Alt"          , piano_key_section_xoffset + (11 * xoffset), piano_key_section_yoffset + (5 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("ContextMenu"   , "Doc"          , piano_key_section_xoffset + (12 * xoffset), piano_key_section_yoffset + (5 * yoffset)) );
    controlright_key                           = new UI_Piano_Key("ControlRight"  , "Ctrl"         , piano_key_section_xoffset + (13 * xoffset), piano_key_section_yoffset + (5 * yoffset));
    controlright_key.setWidth(74);
    ui_piano_key_section.component.addComponent(controlright_key);

    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Insert"        , "Ins"          , piano_key_section_xoffset + (16 * xoffset), piano_key_section_yoffset + (1 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Home"          , "Home"         , piano_key_section_xoffset + (17 * xoffset), piano_key_section_yoffset + (1 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("PageUp"        , "Pgup"         , piano_key_section_xoffset + (18 * xoffset), piano_key_section_yoffset + (1 * yoffset)) );

    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Delete"        , "Del"          , piano_key_section_xoffset + (16 * xoffset), piano_key_section_yoffset + (2 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("End"           , "End"          , piano_key_section_xoffset + (17 * xoffset), piano_key_section_yoffset + (2 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("PageDown"      , "Pgdn"         , piano_key_section_xoffset + (18 * xoffset), piano_key_section_yoffset + (2 * yoffset)) );

    ui_piano_key_section.component.addComponent( new UI_Piano_Key("ArrowUp"       , "Up"           , piano_key_section_xoffset + (17 * xoffset), piano_key_section_yoffset + (4 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("ArrowLeft"     , "Left"         , piano_key_section_xoffset + (16 * xoffset), piano_key_section_yoffset + (5 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("ArrowDown"     , "Down"         , piano_key_section_xoffset + (17 * xoffset), piano_key_section_yoffset + (5 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("ArrowRight"    , "Right"        , piano_key_section_xoffset + (18 * xoffset), piano_key_section_yoffset + (5 * yoffset)) );

    ui_piano_key_section.component.addComponent( new UI_Piano_Key("NumLock"       , "Num"          , piano_key_section_xoffset + (20 * xoffset), piano_key_section_yoffset + (1 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("NumpadDivide"  , "/"            , piano_key_section_xoffset + (21 * xoffset), piano_key_section_yoffset + (1 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("NumpadMultiply", "*"            , piano_key_section_xoffset + (22 * xoffset), piano_key_section_yoffset + (1 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("NumpadSubtract", "-"            , piano_key_section_xoffset + (23 * xoffset), piano_key_section_yoffset + (1 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Numpad7"       , "7"            , piano_key_section_xoffset + (20 * xoffset), piano_key_section_yoffset + (2 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Numpad8"       , "8"            , piano_key_section_xoffset + (21 * xoffset), piano_key_section_yoffset + (2 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Numpad9"       , "9"            , piano_key_section_xoffset + (22 * xoffset), piano_key_section_yoffset + (2 * yoffset)) );
    
    plus_key =                                   new UI_Piano_Key("NumpadAdd"     , "+"            , piano_key_section_xoffset + (23 * xoffset), piano_key_section_yoffset + (2 * yoffset));
    plus_key.setHeight(64 + ui_default_key_padding);
    ui_piano_key_section.component.addComponent( plus_key );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Numpad4"       , "4"            , piano_key_section_xoffset + (20 * xoffset), piano_key_section_yoffset + (3 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Numpad5"       , "5"            , piano_key_section_xoffset + (21 * xoffset), piano_key_section_yoffset + (3 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Numpad6"       , "6"            , piano_key_section_xoffset + (22 * xoffset), piano_key_section_yoffset + (3 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Numpad1"       , "1"            , piano_key_section_xoffset + (20 * xoffset), piano_key_section_yoffset + (4 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Numpad2"       , "2"            , piano_key_section_xoffset + (21 * xoffset), piano_key_section_yoffset + (4 * yoffset)) );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("Numpad3"       , "3"            , piano_key_section_xoffset + (22 * xoffset), piano_key_section_yoffset + (4 * yoffset)) );
    enter_key =                                  new UI_Piano_Key("NumpadEnter"   , "Enter"        , piano_key_section_xoffset + (23 * xoffset), piano_key_section_yoffset + (4 * yoffset));
    enter_key.setHeight(64 + ui_default_key_padding);
    ui_piano_key_section.component.addComponent( enter_key );
    zero_key =                                   new UI_Piano_Key("Numpad0"       , "0"            , piano_key_section_xoffset + (20 * xoffset), piano_key_section_yoffset + (5 * yoffset));
    zero_key.setWidth(64 + ui_default_key_padding);
    ui_piano_key_section.component.addComponent( zero_key );
    ui_piano_key_section.component.addComponent( new UI_Piano_Key("NumpadDecimal" , "."            , piano_key_section_xoffset + (22 * xoffset), piano_key_section_yoffset + (5 * yoffset)) );
}

//////////////////////////////////////////////////////////////
//                    ui_piano_key_update                   //
// Function:                                                //
//     Update function for the key section of the piano ui  //
// Return value:                                            //
//     none                                                 //
//////////////////////////////////////////////////////////////
function ui_piano_key_update()
{
    ui_piano_key_section.component.component_list.forEach
    (
        function(component)
        {
            component.update();
        }
    );
}

//////////////////////////////////////////////////////////////
//                    ui_piano_key_draw                     //
// Function:                                                //
//     Draw function for the key section of the piano ui    //
// Return value:                                            //
//     none                                                 //
//////////////////////////////////////////////////////////////
function ui_piano_key_draw()
{
    // Drawing the background
    ui_drawGradient
    (
        ui_piano_key_section.x,
        ui_piano_key_section.y, 
        ui_piano_key_section.width,
        ui_piano_key_section.height,
        "lightgray",
        "gray",
        0, 100
    );

    ui_piano_key_section.component.component_list.forEach
    (
        function(component)
        {
            component.draw();
        }
    );
}