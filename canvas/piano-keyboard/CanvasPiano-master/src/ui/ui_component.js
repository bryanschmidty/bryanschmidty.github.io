////////////////////////////////////////////////////////
// ui_component.js                                    //
//     A generic assortment of labels and UI elements //
//     For things that don't make sense to be their   //
//     own classes but need certain objects to        //
//     be displayed                                   //
//                                                    //
//     All subcomponents are required to have at      //
//     least a 'draw' function                        //
////////////////////////////////////////////////////////
"use strict";

class UI_Component
{
    constructor()
    {
        this.component_list = [];
        this.bDrawable = true;
    }
    ///////////////////////////////////////////////////////
    //                  addComponent                     //
    // Function:                                         //
    //     Adds a component object to the component_list //
    // Return value:                                     //
    //     component object                              //
    ///////////////////////////////////////////////////////
    addComponent(component)
    {
        this.component_list.push(component);
        return component;
    }
    draw(xoffset=0, yoffset=0)
    {
        if (this.bDrawable)
        {
            this.component_list.forEach
            (
                function(component)
                {
                    component.draw(xoffset, yoffset);
                }
            );
        }
    }
    update()
    {
        this.component_list.forEach
        (
            function(component)
            {
                component.update();
            }
        );
    }
    ////////////////////////////////////////////////////////////
    //                      getComponent                      //
    // Function:                                              //
    //     Returns the index'th element of the component_list //
    // Return value:                                          //
    //     UI_Component or Label or Menu or Menuitem          //
    ////////////////////////////////////////////////////////////
    getComponent(index)
    {
        return this.component_list[index];
    }
    //////////////////////////////////////////////////////////
    //                    draw_If_True                      //
    // Function:                                            //
    //     Takes a function or boolean value to determine   //
    //     whether the component should be drawn            //
    //                                                      //
    //     The result of the function or boolean expression //
    //     is assigned to the bDrawable member variable     //
    //                                                      //
    //     If the parameter is a function, it must return   //
    //     a boolean value                                  //
    // Return value:                                        //
    //     none                                             //
    //////////////////////////////////////////////////////////
    draw_If_True(fc)
    {
        if (DEBUG_MODE) console.log(typeof fc);
        if (typeof fc === "boolean")
        {
            this.bDrawable = fc;
        }
        else
        {
            // trusting that the parameter is a function
            this.bDrawable = fc();
        }
    }
    ///////////////////////////////////////////////////////////////////
    //                          killSelf                             //
    // Function:                                                     //
    //     Removes subcomponents and self from global component list //
    // Return value:                                                 //
    //     none                                                      //
    ///////////////////////////////////////////////////////////////////
    killSelf()
    {
        // Kill my children
        for (var i = 0; i < this.component_list.length; i++)
            if (this.component_list[i] == this)
                this.component_list.killSelf();

        // Kill myself
        for (var i = 0; i < ui_component_list.length; i++)
            if (ui_component_list[i] == this)
                ui_component_list.splice(i, 1);

        // Aint that depressing?
    }
}