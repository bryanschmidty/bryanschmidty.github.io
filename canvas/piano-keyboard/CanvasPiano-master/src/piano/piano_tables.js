///////////////////////////////////////////////////////////////////////////////////////
// tables.js                                                                         //
//     Useful tables to get data quickly                                             //
//     keyCodeToChar: Converts the JavaScript KeyCode to the name of the key pressed //
//     keyCharToCode: Converts the name of the key pressed to the JavaScript KeyCode //
//     colors       : Converts the name of a color to its hexidecimal equivalent     //
///////////////////////////////////////////////////////////////////////////////////////
"use strict";

var key_code_list = [
    "Backspace"     ,    "Tab"              ,    "Enter"        ,    "ContextMenu"      ,
    "ShiftLeft"     ,    "ShiftRight"       ,    "ControlLeft"  ,    "ControlRight"     ,    "AltLeft"      ,
    "AltRight"      ,    "MetaLeft"         ,    "MetaRight"    ,    "Pause"            ,    "CapsLock"     ,
    "NumLock"       ,    "ScrollLock"       ,    "Escape"       ,    " "                ,    "PageUp"       ,
    "PageDown"      ,    "End"              ,    "Home"         ,    "ArrowLeft"        ,    "ArrowUp"      ,
    "ArrowRight"    ,    "ArrowDown"        ,    "PrintScreen"  ,    "Insert"           ,    "Delete"       ,
    "Digit0"        ,    "Digit1"           ,    "Digit2"       ,    "Digit3"           ,    "Digit4"       ,
    "Digit5"        ,    "Digit6"           ,    "Digit7"       ,    "Digit8"           ,    "Digit9"       ,
    "KeyA"          ,    "KeyB"             ,    "KeyC"         ,    "KeyD"             ,    "KeyE"         ,
    "KeyF"          ,    "KeyG"             ,    "KeyH"         ,    "KeyI"             ,    "KeyJ"         ,
    "KeyK"          ,    "KeyL"             ,    "KeyM"         ,    "KeyN"             ,    "KeyO"         ,
    "KeyP"          ,    "KeyQ"             ,    "KeyR"         ,    "KeyS"             ,    "KeyT"         ,
    "KeyU"          ,    "KeyV"             ,    "KeyW"         ,    "KeyX"             ,    "KeyY"         ,
    "KeyZ"          ,    "Numpad0"          ,    "Numpad1"      ,    "Numpad2"          ,    "Numpad3"      ,
    "Numpad4"       ,    "Numpad5"          ,    "Numpad6"      ,    "Numpad7"          ,    "Numpad8"      ,
    "Numpad9"       ,    "NumpadMultiply"   ,    "NumpadAdd"    ,    "NumpadSubtract"   ,    "NumpadDecimal",
    "NumpadDivide"  ,    "NumpadEnter"      ,    "F1"           ,    "F2"               ,    "F3"           ,
    "F4"            ,    "F5"               ,    "F6"           ,    "F7"               ,    "F8"           ,
    "F9"            ,    "F10"              ,    "F11"          ,    "F12"              ,    "Semicolon"    ,
    "Equal"         ,    "Comma"            ,    "Minus"        ,    "Period"           ,    "Slash"        ,
    "Backquote"     ,    "BracketLeft"      ,    "Backslash"    ,    "BracketRight"     ,    "Quote"
];
var colors = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};

var note_table = ["a0", "bb0", "b0", "c1", "db1", "d1", "eb1", "e1", "f1", "gb1", "g1", "ab1",
    "a1", "bb1", "b1", "c2", "db2", "d2", "eb2", "e2", "f2", "gb2", "g2", "ab2",
    "a2", "bb2", "b2", "c3", "db3", "d3", "eb3", "e3", "f3", "gb3", "g3", "ab3",
    "a3", "bb3", "b3", "c4", "db4", "d4", "eb4", "e4", "f4", "gb4", "g4", "ab4",
    "a4", "bb4", "b4", "c5", "db5", "d5", "eb5", "e5", "f5", "gb5", "g5", "ab5",
    "a5", "bb5", "b5", "c6", "db6", "d6", "eb6", "e6", "f6", "gb6", "g6", "ab6",
    "a6", "bb6", "b6", "c7", "db7", "d7", "eb7", "e7", "f7", "gb7", "g7", "ab7",
    "a7", "bb7", "b7", "c8", "db8"];