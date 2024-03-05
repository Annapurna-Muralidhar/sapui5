/*!
* OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/
sap.ui.define(["./library","sap/m/TileContent","sap/m/ActionTileContentRenderer"],function(t,e,r){"use strict";var n=t.Priority;var i=e.extend("sap.m.ActionTileContent",{metadata:{library:"sap.m",aggregations:{attributes:{type:"sap.m.TileAttribute",multiple:true,singularName:"attribute"}},events:{linkPress:{allowPreventDefault:true,parameters:{ctrlKey:{type:"boolean"},metaKey:{type:"boolean"},attribute:{type:"sap.m.TileAttribute"},link:{type:"sap.m.link"}}}}},renderer:{apiVersion:2,render:function(t,e){r.render(t,e)}}});i.prototype.onAfterRendering=function(){var t=this.getAttributes();if(t.length>0){this._addEventHandlersToAttributes(t)}e.prototype.onAfterRendering.apply(this,arguments)};i.prototype._addEventHandlersToAttributes=function(t){t.forEach(t=>{var e=t.getContentConfig()?.getInnerControl();var r=e=>{var{ctrlKey:r,metaKey:n}=e.mParameters;var i=this.fireLinkPress({ctrlKey:r,metaKey:n,attribute:t,link:t.getContentConfig()?.getInnerControl()});if(!i){e.preventDefault()}this._isLinkPressed=true};if(e?.isA("sap.m.Link")&&!e._bIseventAttached){e._bIseventAttached=true;e.attachPress(r)}})};i.prototype.getAltText=function(){var t="";var e=this.getPriorityText();var r=this.getAggregation("attributes");if(this.getPriority()!==n.None&&e){t+=e+"\n"}var i=[];for(var a=0;a<r.length&&a<4;a++){i.push(r[a].getLabel());i.push(r[a].getContentConfig()?.getText())}i=i.filter(function(t){return typeof t==="string"});return t+i.join("\n")};return i});
//# sourceMappingURL=ActionTileContent.js.map