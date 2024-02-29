sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
 ], (Controller,MessageToast,JSONModel) => {
    "use strict";
 
    return Controller.extend("ui5.walkthrough.controller.App", {
        onInit() {
            // set data model on view
            const oData = {
               recipient : {
                  name : "World"
               }
            };
            const oModel = new JSONModel(oData);
            this.getView().setModel(oModel);
         },
       
        onShowHello() {
          // show a native JavaScript alert
          //alert("Hello World");
          MessageToast.show("Hello World");
       }
    });
 });

 /**We add an onInit function to the controller. This is one of SAPUI5’s
  *  lifecycle methods that is invoked by the framework when the controller is created, 
  * similar to the constructor of a control.

Inside the function we instantiate a JSON model. 
The data for the model only contains a single property for the “recipient”, 
and inside this it also contains one additional property for the name.

To be able to use this model from within the XML view,
 we call the setModel function on the view and pass on our 
 newly created model. The model is now set on the view.

The message toast is just showing the static "Hello World" message.
 We will show how to load a translated text here in the next step.*/