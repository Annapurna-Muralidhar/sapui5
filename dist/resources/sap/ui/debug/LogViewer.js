/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define("sap/ui/debug/LogViewer",function(){"use strict";var t=function(e,o){this.oWindow=e;this.oDomNode=e.querySelector("#"+o);if(!this.oDomNode){var i=this.oWindow.document.createElement("DIV");i.setAttribute("id",o);i.style.overflow="auto";i.style.tabIndex="-1";i.style.position="absolute";i.style.bottom="0px";i.style.left="0px";i.style.right="202px";i.style.height="200px";i.style.border="1px solid gray";i.style.fontFamily="Arial monospaced for SAP,monospace";i.style.fontSize="11px";i.style.zIndex="999999";this.oWindow.document.body.appendChild(i);this.oDomNode=i}this.iLogLevel=3;this.sLogEntryClassPrefix=undefined;this.clear();this.setFilter(t.NO_FILTER)};t.NO_FILTER=function(t){return true};t.prototype.clear=function(){this.oDomNode.innerHTML=""};t.xmlEscape=function(t){t=t.replace(/\&/g,"&amp;");t=t.replace(/\</g,"&lt;");t=t.replace(/\"/g,"&quot;");return t};t.prototype.addEntry=function(e){var o=this.oWindow.ownerDocument.createElement("div");if(this.sLogEntryClassPrefix){o.className=this.sLogEntryClassPrefix+e.level}else{o.style.overflow="hidden";o.style.textOverflow="ellipsis";o.style.height="1.3em";o.style.width="100%";o.style.whiteSpace="noWrap"}var i=t.xmlEscape(e.time+"  "+e.message),s=this.oWindow.ownerDocument.createTextNode(i);o.appendChild(s);o.title=e.message;o.style.display=this.oFilter(i)?"":"none";this.oDomNode.appendChild(o);return o};t.prototype.fillFromLogger=function(t){this.clear();this.iFirstEntry=t;if(!this.oLogger){return}var e=this.oLogger.getLogEntries();for(var o=this.iFirstEntry,i=e.length;o<i;o++){if(e[o].level<=this.iLogLevel){this.addEntry(e[o])}}this.scrollToBottom()};t.prototype.scrollToBottom=function(){this.oDomNode.scrollTop=this.oDomNode.scrollHeight};t.prototype.truncate=function(){this.clear();this.fillFromLogger(this.oLogger.getLogEntries().length)};t.prototype.setFilter=function(e){this.oFilter=e=e||t.NO_FILTER;var o=this.oDomNode.childNodes;for(var i=0,s=o.length;i<s;i++){var r=o[i].innerText;if(!r){r=o[i].innerHTML}o[i].style.display=e(r)?"":"none"}this.scrollToBottom()};t.prototype.setLogLevel=function(t){this.iLogLevel=t;if(this.oLogger){this.oLogger.setLevel(t)}this.fillFromLogger(this.iFirstEntry)};t.prototype.lock=function(){this.bLocked=true};t.prototype.unlock=function(){this.bLocked=false;this.fillFromLogger(0)};t.prototype.onAttachToLog=function(t){this.oLogger=t;this.oLogger.setLevel(this.iLogLevel);if(!this.bLocked){this.fillFromLogger(0)}};t.prototype.onDetachFromLog=function(t){this.oLogger=undefined;this.fillFromLogger(0)};t.prototype.onLogEntry=function(t){if(!this.bLocked){var e=this.addEntry(t);if(e&&e.style.display!=="none"){this.scrollToBottom()}}};return t},true);
//# sourceMappingURL=LogViewer.js.map