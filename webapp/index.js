//The "Hello World" text is now displayed by a SAPUI5 control
//Instead of using native JavaScript to display a dialog we want to use a simple SAPUI5 control. Controls are used to define appearance and behavior of parts of the screen.
//package.json->npm init
//ui5.yaml->ui5 init


sap.ui.define([
	"sap/m/Text"
], (Text) => {
	"use strict";

	new Text({
		text: "Hello World"
	}).placeAt("content");
});




// js file contains contains application logic

/**SAPUI5 supports multiple view types (XML, HTML, JavaScript).
 *  When working with UI5, we recommend the use of XML,
 *  as this produces the most readable code and will
 *  force us to separate the view declaration from the controller logic.
 *  Yet the look of our UI will not change. 
 * 
 * */