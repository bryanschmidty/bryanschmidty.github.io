//////////////////////////////////////////////////////////////////////////////////////
// initialize.js                                                                    //
// Everything that needs to be set up before entering the main loop is done here    //
//////////////////////////////////////////////////////////////////////////////////////
"use strict";

const SPACEBAR = 32;

const DEBUG_MODE = false;

// Disabling right click
document.addEventListener('contextmenu', event => event.preventDefault());

$(document).ready(function () 
{
    // Audio context to pass to the soundfont library
    audio_context = new AudioContext();

    // Get HTML Canvas elements
    piano_canvas = $("#piano_canvas")[0]                 ;
    piano_ctx    = $("#piano_canvas")[0].getContext("2d");

    ui_canvas   = piano_canvas  ;
    ui_ctx      = piano_ctx     ;

    piano_instrument = new Piano();

    // Initialize screen dimension variables
    SCREEN_WIDTH  = piano_canvas.width ;
    SCREEN_HEIGHT = piano_canvas.height;

    // Register key bindings
    piano_keyhandler = new KeyHandler();

    window.onkeydown = function(e)
    {
        var key = e.code;
        // Prevent space bar from scrolling the page
        if(key == " " && e.target == document.body) 
        {
            e.preventDefault();
        }
        if (isSpecialKey(key))
        {
            e.preventDefault();
        }

        ui_keyStateDown(key);
        piano_keyhandler.keydown(key);
    }
    
    window.onkeyup = function(e)
    {
        var key = e.code;

        ui_keyStateUp(key);  
        piano_keyhandler.keyup(key);
    }

    // Load the keymap
    $.ajax
    ({
        url     : "/keymaps/virtualpiano.json",
        dataType: "text",
        success : loadKeymap
    });

    // Load the instruments file
    $.ajax
    ({
        url     : "/instruments/instruments.json",
        dataType: "text",
        success : loadInstrumentsToHTML
    });
    
    ui_piano_initialize();

    ui_canvas.addEventListener('wheel', function (event)
    {
        ui_mouse_wheel(event);
    
        // Returning false so you don't scroll the whole HTML page by accident
        return false;
    });

    ui_canvas.addEventListener('mousedown', function (event)
    {
        ui_mouse_down(event);
    });
    ui_canvas.addEventListener('mousemove', function (event)
    {
        ui_mouse_move(event);
    });
    ui_canvas.addEventListener('mouseup', function (event)
    {
        ui_mouse_up(event);
    });

    // Touch events
    // Set up touch events for mobile, etc
    piano_canvas.addEventListener("touchstart", function (e) 
    {
        mousestartpos = getTouchPos(piano_canvas, e);
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        piano_canvas.dispatchEvent(mouseEvent);
    }, false);

    piano_canvas.addEventListener("touchend", function (e) 
    {
        var mouseEvent = new MouseEvent("mouseup", {});
        piano_canvas.dispatchEvent(mouseEvent);
    }, false);

    piano_canvas.addEventListener("touchmove", function (e) 
    {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        piano_canvas.dispatchEvent(mouseEvent);
    }, false);

    CanvasPiano();
});

function CanvasPiano()
{
    window.requestAnimationFrame(CanvasPiano);

    piano_ctx.clearRect(0, 0, piano_canvas.width, piano_canvas.height);
    
    ui();

    // Obtain a copy of previously pressed keys to detect any key-press changes for the next frame
    piano_keyhandler.updateLastKeypress();
}

function loadInstrumentsToHTML(data)
{
    var json = JSON.parse(data);

    var html_drop_down_list = document.getElementById("html_instrument_dropdown");

    for (var i = 0; i < json.length; i++)
    {
        var node = document.createElement("OPTION");
        var text_node = document.createTextNode(json[i]);

        node.setAttribute("value", json[i]);
        node.appendChild(text_node);
        html_drop_down_list.appendChild(node);
    }

    html_drop_down_list.value = "bright_acoustic_piano";
}

function loadKeymap(data_param=null)
{
    var data = null;
    if (data_param == null)
    {
        data = $("#html_keymap_textarea").val();
    }
    else
    {
        data = data_param;
    }

    // Put the data in the html
    html_populateKeymapTextarea(data);

    // Parse the data into objects
    var json = JSON.parse(data);

    // Get the list of keys
    var json_key_list = json["key_list"];

    // Remove all actions a key performs
    for (var j = 0 ; j < ui_piano_key_section.component.component_list.length; j++)
    {
        var key_component = ui_piano_key_section.component.component_list[j];
        key_component.emptyActionList();
    }

    // Add all the key actions
    for (var i = 0; i < json_key_list.length; i++)
    {
        for (var j = 0 ; j < ui_piano_key_section.component.component_list.length; j++)
        {
            var key_component = ui_piano_key_section.component.component_list[j];
            var json_key = json_key_list[i];
            if (key_component instanceof UI_Piano_Key)
            {
                if (key_component.key == json_key.key)
                {
                    // (key, key_direction, action_type, action_value)
                    key_component.addAction(new UI_Piano_Key_Action(json_key.key, json_key.key_direction, json_key.type, json_key.type_value));
                }
            }
        }
    }
}