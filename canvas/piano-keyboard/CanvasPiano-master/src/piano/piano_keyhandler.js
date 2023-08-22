//////////////////////////////////////////////////////////////////////////////////////////
//                                     class KeyHandler                                 //
// This class is it make it easier for me to handle keyboard input.                     //
// Instead of hardcoding everywhere what key is pressed, this will make it easier       //
// to integrate user-customizable input and separate keyboard logic from other classes. //
//                                                                                      //
// KeyHandler:                                                                          //
// +------------------+------------+--------------------------------------------------+ //
// |   member name    |    type    | return type|            description              | //
// +------------------+------------+------------+-------------------------------------+ //
// |     keylist      | Key  array |    n/a     |         List of Key objects         | //
// +------------------+------------+------------+-------------------------------------+ //
// |     register     |  function  |    none    |         Adds key to keylist         | //
// +------------------+------------+------------+-------------------------------------+ //
// |                  |            |            |   Determines which key is pressed   | //
// |      keydown     |  function  |    none    |   and sets isPressed to true        | //
// |                  |            |            |                                     | //
// +------------------+------------+------------+-------------------------------------+ //
// |                  |            |            |   Determines which key is pressed   | //
// |      keyup       |  function  |    none    |   and sets isPressed to false       | //
// |                  |            |            |                                     | //
// +------------------+------------+------------+-------------------------------------+ //
// |                  |            |            |   Loops through keylist and assigns | //
// |updateLastKeypress|  function  |    none    |   lastPressed of each element to    | //
// |                  |            |            |   isPressed                         | //
// +------------------+------------+------------+-------------------------------------+ //
// |                  |            |            |   Gets the corresponding Key object | //
// |   getKeybyName   |  function  |    Key     |   based on a string parameter       | //
// |                  |            |            |                                     | //
// +------------------+------------+------------+-------------------------------------+ //
// |                  |            |            |   Gets the corresponding Key object | //
// |   getKeybyCode   |  function  |    Key     |   based on an integer parameter     | //
// |                  |            |            |                                     | //
// +------------------+------------+------------+-------------------------------------+ //
// |                  |            |            |   Returns true if the key has just  | //
// |     isPressed    |  function  |    bool    |   been pressed and was not pressed  | //
// |                  |            |            |   in the previous frame             | //
// +------------------+------------+------------+-------------------------------------+ //
// |                  |            |            |   Returns true if the key has not   | //
// |    isUnPressed   |  function  |    bool    |   just been pressed and was pressed | //
// |                  |            |            |   in the previous frame             | //
// +------------------+------------+------------+-------------------------------------+ //
// |                  |            |            |   Returns true if the key is        | //
// |      isDown      |  function  |    bool    |   currently being pressed and was   | //
// |                  |            |            |   pressed in the last frame         | //
// +------------------+------------+------------+-------------------------------------+ //
// |                  |            |            |   Returns true if the key is not    | //
// |       isUp       |  function  |    bool    |   currently being pressed and was   | //
// |                  |            |            |   not pressed in the last frame     | //
// +------------------+------------+------------+-------------------------------------+ //
//////////////////////////////////////////////////////////////////////////////////////////
"use strict";

class KeyHandler
{
    constructor()
    {
        this.keylist = [];
        for (var i = 0; i < key_code_list.length; i++)
        {
            this.register(key_code_list[i]);
        }
    }
    register(key_string)
    {
        this.keylist.push(new Key(key_string));
    }
    keyup(key_string)
    {
        var key = null;
        var log_string = "pressed: ";
        
        key = this.getKeybyName(key_string);
        
        if (key == null)
        {
            console.log("bad key: " + key_string);
            return;
        }
        if (DEBUG_MODE) console.log(log_string + key.name + " " + key.isPressed);

        key.isPressed = false;
    }
    keydown(key_string)
    {
        var key = null;
        var log_string = "unpressed: ";

        key = this.getKeybyName(key_string);

        if (key == null)
        {
            console.log("bad key: " + key_string);
            return;
        }
        if (DEBUG_MODE) console.log(log_string + key.name + " " + key.isPressed);
        key.isPressed = true;
    }
    updateLastKeypress()
    {
        for (var i = 0; i < this.keylist.length; i++)
        {
            var key = this.keylist[i];
            key.lastPressed = key.isPressed;
        }
    }
    getKeybyName(name)
    {
        for (var i = 0; i < this.keylist.length; i++)
        {
            if (this.keylist[i].key == name)
            {
                return this.keylist[i];
            }
        }
        return null;
    }
    isPressed(keyname)
    {
        var key = this.getKeybyName(keyname);
        if (key == null)
        {
            console.log("isPressed: Key not registered: " + keyname);
        }
        return key.isPressed && !key.lastPressed;
    }
    isUnpressed(keyname)
    {
        var key = this.getKeybyName(keyname);
        if (key == null)
        {
            console.log("isUnPressed: Key not registered: " + keyname);
        }
        return !key.isPressed && key.lastPressed;
    }
    isDown(keyname)
    {
        var key = this.getKeybyName(keyname);
        if (key == null)
        {
            console.log("isDown: Key not registered: " + keyname);
        }
        return key.isPressed && key.lastPressed;
    }
    isUp(keyname)
    {
        var key = this.getKeybyName(keyname);
        if (key == null)
        {
            console.log("isUp: Key not registered: " + keyname);
        }
        return !key.isPressed && !key.lastPressed;
    }
}