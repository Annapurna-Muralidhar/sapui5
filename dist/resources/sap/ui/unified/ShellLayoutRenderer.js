/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/ControlBehavior"],function(i){"use strict";var e={};e.render=function(e,a){var d=a.getId();e.write("<div");e.writeControlData(a);e.addClass("sapUiUfdShell");if(a._animation){e.addClass("sapUiUfdShellAnim")}if(!a.getHeaderVisible()){e.addClass("sapUiUfdShellNoHead")}e.addClass("sapUiUfdShellHead"+(a._showHeader?"Visible":"Hidden"));if(a.getShowCurtain()){e.addClass("sapUiUfdShellCurtainVisible")}else{e.addClass("sapUiUfdShellCurtainHidden");e.addClass("sapUiUfdShellCurtainClosed")}e.writeClasses();e.write(">");e.write("<hr id='",d,"-brand' class='sapUiUfdShellBrand'>");e.write("<header id='",d,"-hdr'  class='sapUiUfdShellHead'");if(i.isAccessibilityEnabled()){e.writeAttribute("role","banner")}e.write("><div><div id='",d,"-hdrcntnt' class='sapUiUfdShellCntnt'>");if(a.getHeader()){e.renderControl(a.getHeader())}e.write("</div>","</div>","</header>");e.write("<section id='",d,"-curt' class='sapUiUfdShellCntnt sapUiUfdShellCurtain'>");e.write("<div id='",d,"-curtcntnt' class='sapUiUfdShellCntnt'>");e.renderControl(a._curtCont);e.write("</div>");e.write("<span id='",d,"-curt-focusDummyOut' tabindex='0'></span>");e.write("</section>");e.write("<div id='",d,"-cntnt' class='sapUiUfdShellCntnt sapUiUfdShellCanvas sapUiGlobalBackgroundColor sapUiGlobalBackgroundColorForce'>");e.write("<div id='",d,"-strgbg' class='sapUiUfdShellBG"+(a._useStrongBG?" sapUiStrongBackgroundColor":"")+"'></div>");e.write("<div class='sapUiGlobalBackgroundImage sapUiGlobalBackgroundImageForce sapUiUfdShellBG'></div>");e.renderControl(a._cont);e.write("</div>");e.write("<span id='",d,"-main-focusDummyOut' tabindex='"+(a.getShowCurtain()?0:-1)+"'></span>");e.write("</div>")};return e},true);
//# sourceMappingURL=ShellLayoutRenderer.js.map