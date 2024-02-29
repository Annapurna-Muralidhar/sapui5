//The "Hello World" text is now displayed by a SAPUI5 control
//Instead of using native JavaScript to display a dialog we want to use a simple SAPUI5 control. Controls are used to define appearance and behavior of parts of the screen.
sap.ui.define([
	"sap/m/Text"
], (Text) => {
	"use strict";

	new Text({
		text: "Hello World"
	}).placeAt("content");
});




//contains application logic