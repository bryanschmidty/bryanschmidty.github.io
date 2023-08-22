////////////////////////////////////////////////////////
// ui_func.js                                         //
//     Functions for interacting with the UI that the //
//     UI classes will use.                           //
////////////////////////////////////////////////////////
"use strict";

//////////////////////////////////////////////////////////
//                          ui                          //
// Function:                                            //
//     Main loop that draws all the canvas elements.    //
//     It is called repeatedly from the piano() function//
//     in the initialize.js file.                       //
// Return value:                                        //
//     none                                             //
//////////////////////////////////////////////////////////
function ui()
{
    for (var i = 0; i < ui_component_list.length; i++)
    {
        ui_component_list[i].draw();
        ui_component_list[i].update();
    }

    mlastdownleft   = mdownleft; // putting this here in case I have the game paused so I can still register 'press' vs 'unpress' mouse events
    mlastdownright  = mdownright;
    mlastwheel      = mwheel;
    mlastwheeldown  = mwheeldown;
    mlastwheelup    = mwheelup;

    // These lack a corresponding 'stop wheel' like how mouse has a 'mouseup' to signify user has stopped pressing mouse
    // so I am setting them to be false here
    mwheel          = false;
    mwheeldown      = false;
    mwheelup        = false;
}

//////////////////////////////////////////////
//              ui_keyStateDown             //
// Function:                                //
//     Links the UI buttons to key events   //
// Return value:                            //
//     none                                 //
//////////////////////////////////////////////
function ui_keyStateDown(key)
{
    for (var j = 0; j < ui_piano_key_section.component.component_list.length; j++)
    {
        var component = ui_piano_key_section.component.component_list[j];

        if (component instanceof UI_Piano_Key)
        {
            if (key == component.key)
            {
                component.button_component.is_pressed = true;
            }
        }
    }
}

//////////////////////////////////////////////
//               ui_keyStateUp              //
// Function:                                //
//     Links the UI buttons to key events   //
// Return value:                            //
//     none                                 //
//////////////////////////////////////////////
function ui_keyStateUp(key)
{
    for (var j = 0; j < ui_piano_key_section.component.component_list.length; j++)
    {
        var component = ui_piano_key_section.component.component_list[j];

        if (component instanceof UI_Piano_Key)
        {
            if (key == component.key)
            {
                component.button_component.is_pressed = false;
            }
        }
    }
}

////////////////////////////////////////////////////////////
//                       getFont                          //
// Function:                                              //
//     Formats the given parameters in the following way: //
//         "XXpx WWWWW"                                   //
//     Where XX is a number representing font size        //
//     and WWWW is text representing font style           //
// Return value:                                          //
//     string                                             //
////////////////////////////////////////////////////////////
function ui_getFont(font, fontsize)
{
    var base_10 = 10;
    return fontsize.toString(base_10) + "px" + " " + font;
}

////////////////////////////////////////////////////////////////
//                      prepareContext                        //
// Function:                                                  //
//     Replaces the default UI variables with the parameters. //
// Return value:                                              //
//     none                                                   //
////////////////////////////////////////////////////////////////
function ui_prepareContext(font, fontsize, text_color, background_color)
{
    ui_font             = font            ;
    ui_fontsize         = fontsize        ;
    ui_text_color       = text_color      ;
    ui_background_color = background_color;

    return;
}

/////////////////////////////////////////
//              drawLine               //
// Function:                           //
//     Draws a line between two points //
// Return value:                       //
//     none                            //
/////////////////////////////////////////
function ui_drawLine(srcx, srcy, dstx, dsty, line_style, line_width=2)
{
    var old_width       = ui_ctx.lineWidth;
    var old_style       = ui_ctx.strokeStyle;

    ui_ctx.strokeStyle  = style;
    ui_ctx.lineWidth    = line_width;

    ui_ctx.beginPath();
    ui_ctx.moveTo(srcx, srcy);
    ui_ctx.lineTo(dstx, dsty);
    ui_ctx.stroke();

    ui_ctx.lineWidth    = old_width;
    ui_ctx.strokeStyle  = old_style;

    return;
}

///////////////////////////////////////////////////////////////////////
//                           setFillColor                            //
// Function:                                                         //
//     Updates the ui_ctx with a new fill style specified by 'color' //
// Return value:                                                     //
//     none                                                          //
///////////////////////////////////////////////////////////////////////
function ui_setFillColor(color)
{
    ui_ctx.fillStyle = color;

    return;
}

//////////////////////////////////////////////////////////////////////////////////////////
//                                   ui_drawText                                        //
// Function:                                                                            //
//     Draws text at an absolute position (not relative position like in-game objects). //
// Return value:                                                                        //
//     none                                                                             //
//////////////////////////////////////////////////////////////////////////////////////////
function ui_drawText(text, x, y, color, alignment="center", font, fontsize)
{
    ui_ctx.font         = ui_getFont(font, fontsize);
    ui_ctx.fillStyle    = color;
    ui_ctx.textAlign    = alignment;
    ui_ctx.fillText(text, x, y);

    return;
}

//////////////////////////////////////////////////////////////////////
//                          ui_drawGradient                         //
// Function:                                                        //
//     Draws a color gradient in the target_x target_y direction    //
// Return value:                                                    //
//     none                                                         //
//////////////////////////////////////////////////////////////////////
function ui_drawGradient(x, y, w, h, from_color, to_color, target_x, target_y)
{
    var old_style = ui_ctx.fillStyle;

    // Create gradient
    var grd = ui_ctx.createLinearGradient(x, y, target_x, target_y);
    grd.addColorStop(0, from_color);
    grd.addColorStop(1, to_color);

    // Fill with gradient
    ui_ctx.fillStyle = grd;
    ui_ctx.fillRect(x, y, w, h);

    ui_ctx.fillStyle = old_style;
}

///////////////////////////////////////////////////////////////////////
//                             drawBox                               //
// Function:                                                         //
//     Draws a box with a specified position, dimensions, and style. //
// Return value:                                                     //
//     none                                                          //
///////////////////////////////////////////////////////////////////////
function ui_drawBox(x, y, w, h, style, line_width=2)
{
    var old_width       = ui_ctx.lineWidth;
    var old_style       = ui_ctx.strokeStyle;
    ui_ctx.strokeStyle  = style;
    ui_ctx.lineWidth    = line_width;

    ui_ctx.beginPath();
    ui_ctx.rect(x, y, w, h);    
    ui_ctx.stroke();

    ui_ctx.lineWidth    = old_width;
    ui_ctx.strokeStyle  = old_style;

    return;
}

////////////////////////////////////////////////////////////////////
//                       invertedClearRect                        //
// Function:                                                      //
//     Clears everything outside of a given rectangle.            //
//     +---------------------------------+                        //
//     |                1                |                        //
//     |                                 |                        //
//     |------#============#-------------|                        //
//     |   3  || rectangle||      4      |                        //
//     |      ||          ||             |                        //
//     |------#============#-------------|                        //
//     |                                 |                        //
//     |                                 |                        //
//     |                2                |                        //
//     |                                 |                        //
//     |                                 |                        //
//     +---------------------------------+                        //
//                                                                //
// Box 1 is only disqualified if rect.y <= 0                      //
// Box 2 is only disqualified if rect.y + rect.h >= SCREEN_HEIGHT //
// Box 3 is only disqualified if rect.x <= 0                      //
// Box 4 is only disqualified if rect.x + rect.w >= SCREEN_WIDTH  //
//     Parts 1, 2, 3, 4 will be cleared                           //
// Return value:                                                  //
//     none                                                       //
////////////////////////////////////////////////////////////////////
function ui_invertedClearRect(x, y, w, h)
{
    var rect1 = {x: 0    , y: 0    , w: SCREEN_WIDTH          , h: y                       };
    var rect2 = {x: 0    , y: y + h, w: SCREEN_WIDTH          , h: SCREEN_HEIGHT - (y + h) };
    var rect3 = {x: 0    , y: y    , w: x                     , h: h                       };
    var rect4 = {x: x + w, y: y    , w: SCREEN_WIDTH - (x + w), h: h                       };

    if (y > 0)                  { ui_ctx.clearRect(rect1.x, rect1.y, rect1.w, rect1.h); }
    if (y + h < SCREEN_HEIGHT)  { ui_ctx.clearRect(rect2.x, rect2.y, rect2.w, rect2.h); }
    if (x > 0)                  { ui_ctx.clearRect(rect3.x, rect3.y, rect3.w, rect3.h); }
    if (x + w < SCREEN_WIDTH )  { ui_ctx.clearRect(rect4.x, rect4.y, rect4.w, rect4.h); }

    return;
}

///////////////////////////////////////////////////////////////////////////////////////
//                                   fillBox                                         //
// Function:                                                                         //
//     Fills the contents of a box with a specified position, dimensions, and style. //
// Return value:                                                                     //
//     none                                                                          //
///////////////////////////////////////////////////////////////////////////////////////
function ui_fillBox(x, y, w, h, style)
{
    var old_style = ui_ctx.fillStyle;

    ui_ctx.fillStyle = style;
    ui_ctx.fillRect(x, y, w, h);

    ui_ctx.fillStyle = old_style;

    return;
}

//////////////////////////////////////////////////////////////////////////
//                           ui_fillRoundRect                           //
// Function:                                                            //
//     Draws a rounded rectangle using the current state of the canvas. //
//     If you omit the last three params, it will draw a rectangle      //
//     outline with a 5 pixel border radius                             //
//     [Number] x The top left x coordinate                             //
//     [Number] y The top left y coordinate                             //
//     [Number] width The width of the rectangle                        //
//     [Number] height The height of the rectangle                      //
//     [Number] [radius = 5] The corner radius; It can also be an object//
//                     to specify different radii for corners           //
//     [Number] [radius.tl = 0] Top left                                //
//     [Number] [radius.tr = 0] Top right                               //
//     [Number] [radius.br = 0] Bottom right                            //
//     [Number] [radius.bl = 0] Bottom left                             //
// Return value:                                                        //
//     none                                                             //
// Source:                                                              ////////////////////////
// https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas //
////////////////////////////////////////////////////////////////////////////////////////////////
function ui_fillRoundRect(x, y, width, height, radius=ui_default_rounded_rectangle_radius, style)
{
    if (typeof radius === 'number') 
    {
        radius = {tl: radius, tr: radius, br: radius, bl: radius};
    }
    else
    {
        var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
        for (var side in defaultRadius)
        {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }

    var old_style = ui_ctx.fillStyle;

    ui_ctx.fillStyle = style;

    ui_ctx.beginPath();
    ui_ctx.moveTo(x + radius.tl, y);
    ui_ctx.lineTo(x + width - radius.tr, y);
    ui_ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ui_ctx.lineTo(x + width, y + height - radius.br);
    ui_ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ui_ctx.lineTo(x + radius.bl, y + height);
    ui_ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ui_ctx.lineTo(x, y + radius.tl);
    ui_ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ui_ctx.closePath();
    ui_ctx.fill();

    ui_ctx.fillStyle = old_style;
}

//////////////////////////////////////////////////////////////////////////
//                           ui_drawRoundRect                           //
// Function:                                                            //
//     Draws a rounded rectangle using the current state of the canvas. //
//     If you omit the last three params, it will draw a rectangle      //
//     outline with a 5 pixel border radius                             //
//     [Number] x The top left x coordinate                             //
//     [Number] y The top left y coordinate                             //
//     [Number] width The width of the rectangle                        //
//     [Number] height The height of the rectangle                      //
//     [Number] [radius = 5] The corner radius; It can also be an object//
//                     to specify different radii for corners           //
//     [Number] [radius.tl = 0] Top left                                //
//     [Number] [radius.tr = 0] Top right                               //
//     [Number] [radius.br = 0] Bottom right                            //
//     [Number] [radius.bl = 0] Bottom left                             //
// Return value:                                                        //
//     none                                                             //
// Source:                                                              ////////////////////////
// https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas //
////////////////////////////////////////////////////////////////////////////////////////////////
function ui_drawRoundRect(x, y, width, height, radius=ui_default_rounded_rectangle_radius, style)
{
    if (typeof radius === 'number') 
    {
        radius = {tl: radius, tr: radius, br: radius, bl: radius};
    }
    else
    {
        var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
        for (var side in defaultRadius)
        {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }

    var old_style = ui_ctx.fillStyle;

    ui_ctx.strokeStyle = style;

    ui_ctx.beginPath();
    ui_ctx.moveTo(x + radius.tl, y);
    ui_ctx.lineTo(x + width - radius.tr, y);
    ui_ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ui_ctx.lineTo(x + width, y + height - radius.br);
    ui_ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ui_ctx.lineTo(x + radius.bl, y + height);
    ui_ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ui_ctx.lineTo(x, y + radius.tl);
    ui_ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ui_ctx.closePath();
    ui_ctx.stroke();

    ui_ctx.strokeStyle = old_style;
}