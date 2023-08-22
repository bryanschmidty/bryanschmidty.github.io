//////////////////////////////////
// ui_button.js                 //
// Contains the UI_Button class //
//////////////////////////////////
"use strict";

class UI_Button extends UI_Component
{
    constructor(text, x, y, w, h,
                button_background_color = ui_default_background_color,
                font                    = ui_default_font,
                fontsize                = ui_default_fontsize,
                text_color              = ui_default_text_color)
    {
        super();
        this.x                          = x;
        this.y                          = y;
        this.width                      = w;
        this.height                     = h;
        this.button_background_color    = button_background_color;
        this.text_label                 = new UI_Label
        (
            text,
            x + w / 2,
            y,          // For some reason adding h / 2 is too much
            font,
            fontsize,
            text_color,
            button_background_color,
            "center"
        );
        this.is_clicked                 = false;
        this.is_pressed                 = false;
        this.last_clicked               = false;
        this.last_pressed               = false;
    }
    /////////////////////////////////////////////////////////
    //                        draw                         //
    // Function:                                           //
    //     Invert the color of the button if it is clicked //
    //     Fill in the button background, Draw the text    //
    // Return value:                                       //
    //     None                                            //
    /////////////////////////////////////////////////////////
    draw(xoffset=0, yoffset=0)
    {
        var old_text_color = this.text_label.text_color;        
        
        if (this.is_clicked || this.is_pressed)
        {
            this.button_background_color = ui_default_pressed_background_color_button;
        }

        // Slowly approach the goal color for smooth transition
        this.button_background_color = colorTransition
        (
            stringToRGB(this.button_background_color),
            stringToRGB(ui_default_background_color),
            ui_default_key_color_transition_rate
        );

        ui_fillRoundRect
        (
            this.x + xoffset,   // x,
            this.y + yoffset,   // y,
            this.width,         // width,
            this.height,        // height,
            ui_default_rounded_rectangle_radius,
            this.button_background_color
        );

        this.text_label.draw(xoffset, yoffset + 20);

        // Preserving the original text color
        this.text_label.text_color = old_text_color;
    }
    //////////////////////////////////////////////////////////////
    //                          update                          //
    // Function:                                                //
    //     Checking if the button has been clicked or pressed   //
    // Return value:                                            //
    //     None                                                 //
    //////////////////////////////////////////////////////////////
    update(xoffset=0, yoffset=0)
    {
        if (mdownleft && checkPointCollision(this, mousepos))
        {
            this.is_clicked = true;
        }
        else
        {
            this.is_clicked = false;
        }

        this.last_pressed = this.is_pressed;
        this.last_clicked = this.is_clicked;
    }
    onClick()
    {
        // this should be defined where the instance is defined
    }
    getText()
    {
        return this.text_label.getText();
    }
    setWidth(width)
    {
        this.width = width;
        this.text_label.updatePosition(this.x + this.width / 2, this.y);
    }
    getWidth()
    {
        return this.width;
    }
    setHeight(height)
    {
        this.height = height;
    }
    getHeight()
    {
        return this.height;
    }
}