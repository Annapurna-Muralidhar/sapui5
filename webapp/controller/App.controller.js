sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
 ], (Controller, MessageToast) => {
    "use strict";
 
    return Controller.extend("ui5.walkthrough.controller.App", {

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

 /**In the onInit function we instantiate the ResourceModel that points to the new message
  *  bundle file where our texts are now located (i18n.properties file). The bundle name 
  * ui5.walkthrough.i18n.i18n consists of the application namespace ui5.walkthrough (the application root 
  * as defined in the index.html), the folder name i18n and finally the file name i18n without extension. 
  * The SAPUI5 runtime calculates the correct path to the resource; in this case the path to our i18n.properties file.
  *  Next, the model instance is set on the view as a named model with the key i18n. You use named models when you need to have several 
  * models available in parallel.

In the onShowHello event handler function we access
 the i18n model to get the text from the message bundle file and
  replace the placeholder {0} with the recipient from our data model. 
  The getProperty method can be called in any model and takes the data path
   as an argument. In addition, the resource bundle has a specific getText
    method that takes an array of strings as second argument.

The resource bundle can be accessed with the getResourceBundle method 
of a ResourceModel. Rather than concatenating translatable texts manually,
 we can use the second parameter of getText to replace parts of the text with non-static data.
  During runtime, SAPUI5 tries to load the correct i18n_*.properties file based on your browser
   settings and your locale. In our case we have only created one i18n.properties file to make 
   it simple. However, you can see in the network traffic of your browser’s developer tools that 
   SAPUI5 tries to load one or more i18n_*.properties files before falling back to the default 
   i18n.properties file. */

   /**The resource model for internationalization is called the i18n model.

The default filename is i18n.properties.

Resource bundle keys are written in (lower) camelCase.

Resource bundle values can contain parameters like {0}, {1}, {2}, …

Never concatenate strings that are translated, always use placeholders.

Use Unicode escape sequences for special characters. */