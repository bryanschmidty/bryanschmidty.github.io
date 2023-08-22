//////////////////////////////////////////////
// html_func.js                             //
// Contains functions that modify the html  //
//////////////////////////////////////////////
"use strict";

function html_setNewInstrument()
{
    var html_drop_down_menu = document.getElementById("html_instrument_dropdown");
    piano_instrument
    piano_instrument.setInstrument(html_drop_down_menu.value);
}

//////////////////////////////////////////////////////////////////
//                   html_populateKeymapTextarea                 //
// Function:                                                    //
//     Populates the html_level_textarea with a given json file //
// Return value:                                                //
//     none                                                     //
//////////////////////////////////////////////////////////////////
function html_populateKeymapTextarea(jsondata)
{
    $('#html_keymap_textarea').val(jsondata);
}

function html_keyModifierChanged()
{
    var html_key_modifier_type_dropdown     = document.getElementById("html_key_modifier_type_dropdown"     );

    var html_key_edit_note_label            = document.getElementById("html_key_edit_note_label"            );
    var html_key_edit_transpose_label       = document.getElementById("html_key_edit_transpose_label"       );
    var html_key_edit_sustain_label         = document.getElementById("html_key_edit_sustain_label"         );

    var html_type_value_input               = document.getElementById("html_type_value_input"               );

    var html_key_modifier_sustain_value_dropdown = document.getElementById("html_key_modifier_sustain_value_dropdown");

    html_key_edit_note_label.style.display                  = "none";
    html_key_edit_transpose_label.style.display             = "none";
    html_key_edit_sustain_label.style.display               = "none";
    html_type_value_input.style.display                     = "none";
    html_key_modifier_sustain_value_dropdown.style.display  = "none";

    switch(html_key_modifier_type_dropdown.value)
    {
        case "sustain":
        {
            html_key_edit_sustain_label.style.display               = "block";
            html_key_modifier_sustain_value_dropdown.style.display  = "block";
            break;
        }
        case "transpose":
        {
            html_key_edit_transpose_label.style.display = "block";
            html_type_value_input.style.display         = "block";
            break;
        }
        case "note":
        {
            html_key_edit_note_label.style.display  = "block";
            html_type_value_input.style.display     = "block";
            break;
        }
        case "none":
        default:
        {
            // Do nothing
            break;
        }
    }
}

function html_selectKeyToModify()
{
    if (ui_mouse_selected_key != null)
    {
        var html_key_edit_key_label             = document.getElementById("html_key_edit_key_label"             );
        var html_key_modifier_type_dropdown     = document.getElementById("html_key_modifier_type_dropdown"     );

        var html_key_edit_note_label            = document.getElementById("html_key_edit_note_label"            );
        var html_key_edit_transpose_label       = document.getElementById("html_key_edit_transpose_label"       );
        var html_key_edit_sustain_label         = document.getElementById("html_key_edit_sustain_label"         );

        var html_type_value_input               = document.getElementById("html_type_value_input"               );
        var html_key_modifier_sustain_value_dropdown = document.getElementById("html_key_modifier_sustain_value_dropdown");

        html_key_edit_note_label.style.display                  = "none";
        html_key_edit_transpose_label.style.display             = "none";
        html_key_edit_sustain_label.style.display               = "none";
        html_type_value_input.style.display                     = "none";
        html_key_modifier_sustain_value_dropdown.style.display  = "none";

        var key = ui_mouse_selected_key.key;

        html_key_input.value = key;

        // So far only 1 command per key is supported
        var action       = ui_mouse_selected_key.action_list[0];

        if (action != null)
        {
            var action_type  = action.action_type;
            var action_value = action.action_value;

            html_type_value_input.value = action_value;

            switch (action_type)
            {
                case PIANO_KEY_ACTION.NOTE:
                {
                    html_key_modifier_type_dropdown.value   = "note";
                    html_key_edit_note_label.style.display  = "block";
                    html_type_value_input.style.display     = "block";
                    break;
                }
                case PIANO_KEY_ACTION.TRANSPOSE:
                {
                    html_key_modifier_type_dropdown.value       = "transpose";
                    html_key_edit_transpose_label.style.display = "block";
                    html_type_value_input.style.display         = "block";
                    break;
                }
                case PIANO_KEY_ACTION.SUSTAIN:
                {
                    html_key_modifier_type_dropdown.value                   = "sustain";
                    html_key_edit_sustain_label.style.display               = "block";
                    html_key_modifier_sustain_value_dropdown.style.display  = "block";
                    break;
                }
                case PIANO_KEY_ACTION.NONE:
                default:
                {
                    html_key_modifier_sustain_value_dropdown.value = "none";
                    break;
                }
                
            } // end of switch (action_type)

        } // end of if (action != null)
        else
        {
            console.log("This key has no action associated with it");
        }
    }
}

function html_modifyKey()
{
    var html_key_modifier_type_dropdown     = document.getElementById("html_key_modifier_type_dropdown"     );

    var html_key_edit_note_label            = document.getElementById("html_key_edit_note_label"            );
    var html_key_edit_transpose_label       = document.getElementById("html_key_edit_transpose_label"       );
    var html_key_edit_sustain_label         = document.getElementById("html_key_edit_sustain_label"         );

    var html_type_value_input               = document.getElementById("html_type_value_input"               );
    var html_key_modifier_keystroke_dropdown= document.getElementById("html_key_modifier_keystroke_dropdown");
    var html_key_modifier_sustain_value_dropdown = document.getElementById("html_key_modifier_sustain_value_dropdown");

    var ui_key = null;
    var action = null;
    var action_type = null;
    var action_keystroke_direction = null;
    var action_key = html_key_input.value;
    var action_value = null;

    for (var i = 0; i < ui_piano_key_section.component.component_list.length; i++)
    {
        ui_key = ui_piano_key_section.component.component_list[i]
        if (html_key_input.value == ui_key.key)
        {
            break;
        }
    }
    if (ui_key != null)
    {
        action_type                 = convertActionString(html_key_modifier_type_dropdown.value);
        action_keystroke_direction  = html_key_modifier_keystroke_dropdown.value;

        switch (action_type)
        {
            case PIANO_KEY_ACTION.NOTE:
            {
                action_value = html_type_value_input.value;
                break;
            }
            case PIANO_KEY_ACTION.TRANSPOSE:
            {
                action_value = Number(html_type_value_input.value);
                break;
            }
            case PIANO_KEY_ACTION.SUSTAIN:
            {
                action_value = html_type_value_input.value;
                break;
            }
            case PIANO_KEY_ACTION.NONE:
            default:
            {
                break;
            }
        }

        action = new UI_Piano_Key_Action(action_key, action_keystroke_direction, action_type, action_value);
        ui_key.action_list[0] = action;
    }
}

function html_modifyTransposition()
{
    var html_transposition_input = document.getElementById("html_transposition_input");

    piano_instrument.setTransposition(html_transposition_input.value);
}