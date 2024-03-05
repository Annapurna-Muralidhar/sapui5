/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/i18n/Localization","sap/ui/core/Renderer","sap/ui/core/InvisibleText","sap/ui/Device","./library","./ListBaseRenderer","./ColumnListItemRenderer","sap/ui/core/Lib"],function(e,t,a,s,r,l,o,n){"use strict";var i=r.MultiSelectMode;var d=t.extend(l);d.apiVersion=2;var c=e.getRTL();d.columnAlign={left:c?"flex-end":"flex-start",center:"center",right:c?"flex-start":"flex-end"};d.renderColumns=function(e,t,r){var c=0,u=[],p=false,f,g=false,C=false,m=false,b=r=="Foot",T=t.getMode(),M=l.ModeOrder[T],H="sapMListTbl",L=t.getId("tbl"),h=r=="Head"?"th":"td",E="t"+r.toLowerCase(),I=t.getColumns(),S=t.getFixedLayout(),_=function(t,a,s){var l,i;if(typeof t=="string"){l=i=L+r+t}else{i=t;l=i.getId()}e.openStart(h,i);e.class(H+a);e.attr("aria-colindex",u.push(l));if(!g){o.makeFocusable(e)}if(s){e.attr("aria-label",n.getResourceBundleFor("sap.m").getText(s))}if(r=="Head"){e.class("sapMTableTH");e.attr("role","columnheader");if(C){e.attr("aria-selected","false")}}else{e.attr("role","gridcell")}return e},y=function(t,a){e.openStart(h,L+r+t);r=="Head"&&e.class("sapMTableTH");e.class(H+a);e.attr("role","presentation");e.openEnd();e.close(h);c++};if(r=="Head"){var v=I.find(function(e){return e.getVisible()});var A=I.reduce(function(e,t,a){t.setIndex(-1);t.setInitialOrder(a);t.setForcedColumn(false);return t.getVisible()&&t.getCalculatedMinScreenWidth()<e.getCalculatedMinScreenWidth()?t:e},v);var N=I.filter(function(e){return e.getVisible()&&!e.isHidden()}).length;if(!N&&A){A.setForcedColumn(true);N=1}if(N==1&&S==="Strict"){t._bCheckLastColumnWidth=true}g=!N||I.every(function(e){return!e.getHeader()||!e.getHeader().getVisible()||!e.getVisible()||e.isHidden()})}e.openStart(E).class("sapMTableT"+r).openEnd();e.openStart("tr",t.addNavSection(L+r+"er"));e.attr("role","row");if(g){e.class("sapMListTblHeaderNone");e.attr("aria-hidden","true")}else{e.class("sapMListTblRow").class("sapMListTbl"+r+"er");if(s.system.desktop){e.attr("tabindex","-1");e.class("sapMLIBFocusable").class("sapMTableRowCustomFocus")}if(r=="Head"){e.attr("aria-rowindex","1");if(t._bSelectionMode){e.attr("aria-selected","false");C=true}}else{e.attr("aria-rowindex",t.getVisibleItems().length+!t._headerHidden+1)}}e.openEnd();y("Highlight","HighlightCol");if(M==-1){_("ModeCol","SelCol","TABLE_SELECTION_COLUMNHEADER").openEnd();if(C&&T=="MultiSelect"){e.renderControl(t.getMultiSelectMode()==i.ClearAll?t._getClearAllButton():t._getSelectAllCheckbox())}e.close(h);c++}t.getColumns(true).forEach(function(s){if(!s.getVisible()){return}if(s.isPopin()){p=true;return}if(s.isHidden()){return}var l=s["get"+r+"er"](),o=N==1&&S!=="Strict"?"":s.getWidth(),n=s.getStyleClass().split(" ").filter(Boolean),i=s.getCssAlign(),u=false;if(r=="Head"){_(s,"Cell");var g=s.getSortIndicator().toLowerCase();if(g!="none"){e.attr("aria-sort",g)}if(l){var C=s.getHeaderMenuInstance();u=(C||t.bActiveHeaders)&&!l.isA("sap.ui.core.InvisibleText");if(u){e.attr("aria-haspopup",C?C.getAriaHasPopupType().toLowerCase():"dialog");m=true}if(l.isA("sap.m.Label")&&l.getRequired()){e.attr("aria-describedby",a.getStaticId("sap.m","CONTROL_IN_COLUMN_REQUIRED"))}}if(!f){f=!o||o=="auto"}if(!b){b=!!s.getFooter()}}else{_(s.getId()+"-footer","Cell");e.style("text-align",i)}n.forEach(function(t){e.class(t)});e.class(H+r+"erCell");e.attr("data-sap-ui-column",s.getId());e.style("width",o);e.openEnd();if(l){if(r==="Head"){e.openStart("div",s.getId()+"-ah");e.class("sapMColumnHeader");if(u){e.class("sapMColumnHeaderActive")}if(i){e.style("justify-content",d.columnAlign[i]);e.style("text-align",i)}e.openEnd();e.renderControl(l.addStyleClass("sapMColumnHeaderContent"));e.close("div")}else{e.renderControl(l)}}e.close(h);s.setIndex(c++)});if(r=="Head"){t._dummyColumn=f!=undefined&&!f&&S==="Strict"}if(p&&t._dummyColumn){y("DummyCell","DummyCell")}if(t.doItemsNeedTypeColumn()){_("Nav","NavCol","TABLE_ROW_ACTION").openEnd().close(h);c++}if(M==1){_("ModeCol","SelCol",T=="Delete"?"TABLE_ROW_ACTION":"TABLE_SELECTION_COLUMNHEADER").openEnd().close(h);c++}y("Navigated","NavigatedCol");if(!p&&t._dummyColumn){y("DummyCell","DummyCell")}e.close("tr");if(p){var x=L+"Popin"+r;e.openStart("tr").attr("role","none").openEnd();e.openStart("td").attr("role","none").attr("colspan",c).class("sapMTablePopinColumn").class("sapMTblItemNav").openEnd();if(r=="Head"){e.openStart("div",x);e.class("sapMListTblHeaderNone");e.attr("role",r=="Head"?"columnheader":"gridcell");e.attr("aria-colindex",u.push(x));e.attr("aria-label",n.getResourceBundleFor("sap.m").getText("TABLE_COLUMNHEADER_POPIN"));e.openEnd();e.close("div")}e.close("td");e.close("tr")}e.close(E);if(r==="Head"){t._colCount=c;t._hasPopin=p;t._hasFooter=b;t._headerHidden=g;t._colHeaderAriaOwns=u;t._columnHeadersActive=m}};d.renderContainerAttributes=function(e,t){e.attr("data-sap-ui-pasteregion","true");e.class("sapMListTblCnt")};d.renderListStartAttributes=function(e,t){e.openStart("table",t.getId("listUl"));e.accessibilityState(t,this.getAccessibilityState(t));e.attr("aria-roledescription",n.getResourceBundleFor("sap.m").getText("TABLE_ROLE_DESCRIPTION"));e.class("sapMListTbl");if(t.getFixedLayout()===false){e.style("table-layout","auto")}if(t.doItemsNeedTypeColumn()){e.class("sapMListTblHasNav")}};d.renderListHeadAttributes=function(e,t){t._aPopinHeaders=[];this.renderColumns(e,t,"Head");e.openStart("tbody",t.addNavSection(t.getId("tblBody")));e.class("sapMListItems");e.class("sapMTableTBody");if(t.hasPopin()){e.class("sapMListTblHasPopin")}e.openEnd()};d.renderListEndAttributes=function(e,t){e.close("tbody");t._hasFooter&&this.renderColumns(e,t,"Foot");e.close("table");this.renderPopinColumnHeaders(e,t)};d.renderPopinColumnHeaders=function(e,t){if(!t._aPopinHeaders||!t._aPopinHeaders.length){return}e.openStart("div",t.getId("popin-headers"));e.class("sapMTablePopinHeaders");e.attr("aria-hidden","true");e.openEnd();t._aPopinHeaders.forEach(function(t){e.renderControl(t)});e.close("div")};d.renderNoData=function(e,t){e.openStart("tr",t.getId("nodata"));e.class("sapMLIB").class("sapMListTblRow").class("sapMLIBTypeInactive");if(s.system.desktop){e.attr("tabindex","-1");e.class("sapMLIBFocusable").class("sapMTableRowCustomFocus")}if(!t._headerHidden||!t.getHeaderText()&&!t.getHeaderToolbar()){e.class("sapMLIBShowSeparator")}e.openEnd();var a=t.shouldRenderDummyColumn();e.openStart("td",t.getId("nodata-text"));e.attr("colspan",t.getColCount()-a);e.class("sapMListTblCell").class("sapMListTblCellNoData");e.openEnd();if(!t.shouldRenderItems()){if(t.getAggregation("_noColumnsMessage")){e.renderControl(t.getAggregation("_noColumnsMessage"))}else{e.text(n.getResourceBundleFor("sap.m").getText("TABLE_NO_COLUMNS"))}}else{this.renderNoDataArea(e,t)}e.close("td");if(a){o.renderDummyCell(e,t)}e.close("tr")};return d},true);
//# sourceMappingURL=TableRenderer.js.map