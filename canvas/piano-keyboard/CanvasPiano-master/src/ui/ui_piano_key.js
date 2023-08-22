//////////////////////////////////////////////////////////////////////
// ui_piano_key.js                                                  //
// Class definition for the UI Key element for the piano component  //
//////////////////////////////////////////////////////////////////////
"use strict";

class UI_Piano_Key extends UI_Component
{
    constructor(key, display_text, x, y)
    {
        super();

        this.key            = key                   ; // [String ] Associated key on your keyboard
        this.display_text   = display_text          ; // [String ] Text to be displayed on the ui
        this.width          = ui_default_key_width  ; // [Integer] This shape is intended to be a square
        this.height         = ui_default_key_width  ; // [Integer] This shape is intended to be a square
        this.action_list    = []                    ; // [Array  ] Contains a list of actions this key will perform when its action is fired

        this.button_component = new UI_Button(display_text, x, y, this.width, this.height);
    }
    update()
    {
        this.button_component.update();

        if (mdownright && checkPointCollision(this.button_component, mousepos))
        {
            ui_mouse_selected_key = this;
            html_selectKeyToModify();
        }

        for (var i = 0; i < this.action_list.length; i++)
        {
            this.action_list[i].performAction(this.button_component.is_clicked);
        }
    }
    draw()
    {
        this.button_component.draw();
    }
    setWidth(width)
    {
        this.button_component.setWidth(width);
    }
    getWidth()
    {
        return this.button_component.getWidth();
    }
    setHeight(height)
    {
        this.button_component.setHeight(height);
    }
    getHeight()
    {
        return this.button_component.getHeight();
    }
    emptyActionList()
    {
        this.action_list = [];
    }
    addAction(action)
    {
        this.action_list.push(action);
    }

    getText (       ){  return this.button_component.getText()      ;}
    setText (text   ){  this.button_component.setText(display_text) ;}
}