//////////////////////////////////////////////
// ui_action.js                             //
// Contains the UI_Piano_Key_Action class   //
//////////////////////////////////////////////
"use strict";

class UI_Piano_Key_Action
{
    constructor(key, key_direction, action_type, action_value)
    {
        this.key            = key           ;
        this.key_direction  = key_direction ;
        this.action_type    = convertActionString(action_type);
        this.action_value   = action_value  ;
        this.sustain        = true          ;
        this.current_action = null          ;
        this.is_pressed     = false         ;
    }
    
    performAction(parent_button_is_pressed)
    {
        var valid_action = false;

        if (this.key_direction == "keyup")
        {
            if (piano_keyhandler.isUnpressed(this.key))
            {
                valid_action = true;
            }
        }
        else if (this.key_direction == "keydown")
        {
            if (piano_keyhandler.isPressed(this.key))
            {
                valid_action = true;
            }
        }

        if (piano_keyhandler.isUnpressed(this.key))
        {
            // Is sustain off
            if (!document.getElementById("myonoffswitch").checked)
            {
                if (this.current_action != null)
                {
                    this.current_action.stop();
                }
            }
        }

        if (parent_button_is_pressed)
        {
            valid_action = (mdownleft && !mlastdownleft) || (!this.is_pressed);
            this.is_pressed = true;
        }
        else
        {
            this.is_pressed = false;
        }

        if (valid_action)
        {

            switch(this.action_type)
            {
                case PIANO_KEY_ACTION.NOTE:
                {
                    this.current_action = piano_instrument.playNote(this.action_value);
                    break;
                }
                case PIANO_KEY_ACTION.TRANSPOSE:
                {
                    piano_instrument.changeTransposition(this.action_value);
                    break;
                }
                case PIANO_KEY_ACTION.SUSTAIN:
                {
                    document.getElemenyById("myonoffswitch").checked = !(document.getElemenyById("myonoffswitch").checked);
                    break;
                }
                case PIANO_KEY_ACTION.NONE:
                default:
                {

                    break;
                }
                
            } // end switch(this.action_type)

        } // end of if (valid_action)

    } // end of performAction()
    
}