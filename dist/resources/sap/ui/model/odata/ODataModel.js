/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./CountMode","./ODataContextBinding","./ODataListBinding","./ODataMetadata","./ODataPropertyBinding","./ODataTreeBinding","./ODataUtils","sap/base/assert","sap/base/Log","sap/base/i18n/Localization","sap/base/security/encodeURL","sap/base/util/each","sap/base/util/extend","sap/base/util/isEmptyObject","sap/base/util/isPlainObject","sap/base/util/merge","sap/base/util/uid","sap/ui/core/Supportability","sap/ui/model/BindingMode","sap/ui/model/Context","sap/ui/model/FilterProcessor","sap/ui/model/Model","sap/ui/model/odata/ODataAnnotations","sap/ui/model/odata/ODataMetaModel","sap/ui/thirdparty/datajs","sap/ui/thirdparty/URI"],function(e,t,a,s,i,r,n,o,d,u,h,f,c,l,p,y,_,g,b,m,v,M,R,T,C,U){"use strict";var A=M.extend("sap.ui.model.odata.ODataModel",{constructor:function(t,a,i,r,o,d,h,f){M.apply(this,arguments);var c,l,p,y=null,_,m,v,R,T,U,q=this;if(typeof t==="object"){a=t;t=a.serviceUrl}if(typeof a==="object"){i=a.user;r=a.password;o=a.headers;d=a.tokenHandling;f=a.loadMetadataAsync;h=a.withCredentials;p=a.maxDataServiceVersion;c=a.useBatch;l=a.refreshAfterChange;y=a.annotationURI;_=a.loadAnnotationsJoined;v=a.defaultCountMode;m=a.metadataNamespaces;R=a.serviceUrlParams;T=a.metadataUrlParams;U=a.skipMetadataAnnotationParsing;a=a.json}this.oServiceData={};this.sDefaultBindingMode=b.OneWay;this.mSupportedBindingModes={OneWay:true,OneTime:true,TwoWay:true};this.mUnsupportedFilterOperators={Any:true,All:true};this.bCountSupported=true;this.bJSON=a;this.bCache=true;this.aPendingRequestHandles=[];this.oRequestQueue={};this.aBatchOperations=[];this.oHandler=undefined;this.bTokenHandling=d!==false;this.bWithCredentials=h===true;this.bUseBatch=c===true;this.bRefreshAfterChange=l!==false;this.sMaxDataServiceVersion=p;this.bLoadMetadataAsync=!!f;this.bLoadAnnotationsJoined=_===undefined?true:_;this.sAnnotationURI=y;this.sDefaultCountMode=v||e.Both;this.oMetadataLoadEvent=null;this.oMetadataFailedEvent=null;this.bSkipMetadataAnnotationParsing=U;this.oHeaders={};this.setHeaders(o);this.oData={};this.oMetadata=null;this.oAnnotations=null;this.aUrlParams=[];if(t.indexOf("?")==-1){this.sServiceUrl=t}else{var E=t.split("?");this.sServiceUrl=E[0];if(E[1]){this.aUrlParams.push(E[1])}}if(g.isStatisticsEnabled()){this.aUrlParams.push("sap-statistics=true")}this.sServiceUrl=this.sServiceUrl.replace(/\/$/,"");var P=this._createRequestUrl("$metadata",undefined,T);if(!A.mServiceData[P]){A.mServiceData[P]={}}this.oServiceData=A.mServiceData[P];if(this.bTokenHandling&&this.oServiceData.securityToken){this.oHeaders["x-csrf-token"]=this.oServiceData.securityToken}this.sUser=i;this.sPassword=r;this.oHeaders["Accept-Language"]=u.getLanguageTag().toString();if(!this.oServiceData.oMetadata){this.oServiceData.oMetadata=new s(P,{async:this.bLoadMetadataAsync,user:this.sUser,password:this.sPassword,headers:this.mCustomHeaders,namespaces:m,withCredentials:this.bWithCredentials})}this.oMetadata=this.oServiceData.oMetadata;this.pAnnotationsLoaded=this.oMetadata.loaded();if(this.sAnnotationURI||!this.bSkipMetadataAnnotationParsing){var S=this._getAnnotationParser();if(!this.bSkipMetadataAnnotationParsing){if(!this.bLoadMetadataAsync){this.addAnnotationXML(this.oMetadata.sMetadataBody,!!this.sAnnotationURI)}else{this.pAnnotationsLoaded=this.oMetadata.loaded().then(function(e,t){if(this.bDestroyed){return Promise.reject()}return this.addAnnotationXML(t["metadataString"],e)}.bind(this,!!this.sAnnotationURI))}}if(this.sAnnotationURI){if(this.bLoadMetadataAsync){this.pAnnotationsLoaded=this.pAnnotationsLoaded.then(S.addUrl.bind(S,this.sAnnotationURI))}else{this.pAnnotationsLoaded=Promise.all([this.pAnnotationsLoaded,S.addUrl(this.sAnnotationURI)])}}}if(R){this.aUrlParams=this.aUrlParams.concat(n._createUrlParamsArray(R))}this.onMetadataLoaded=function(e){q._initializeMetadata();q.initialize()};this.onMetadataFailed=function(e){q.fireMetadataFailed(e.getParameters())};if(!this.oMetadata.isLoaded()){this.oMetadata.attachLoaded(this.onMetadataLoaded);this.oMetadata.attachFailed(this.onMetadataFailed)}if(this.oMetadata.isFailed()){this.refreshMetadata()}if(this.oMetadata.isLoaded()){this._initializeMetadata(true)}if(this.bJSON){if(this.sMaxDataServiceVersion==="3.0"){this.oHeaders["Accept"]="application/json;odata=fullmetadata"}else{this.oHeaders["Accept"]="application/json"}this.oHandler=C.jsonHandler}else{this.oHeaders["Accept"]="application/atom+xml,application/atomsvc+xml,application/xml";this.oHandler=C.atomHandler}this.oHeaders["MaxDataServiceVersion"]="2.0";if(this.sMaxDataServiceVersion){this.oHeaders["MaxDataServiceVersion"]=this.sMaxDataServiceVersion}this.oHeaders["DataServiceVersion"]="2.0"},metadata:{publicMethods:["create","remove","update","submitChanges","getServiceMetadata","read","hasPendingChanges","refresh","refreshMetadata","resetChanges","isCountSupported","setCountSupported","setDefaultCountMode","getDefaultCountMode","forceNoCache","setProperty","getSecurityToken","refreshSecurityToken","setHeaders","getHeaders","setUseBatch"]}});A.M_EVENTS={RejectChange:"rejectChange",MetadataLoaded:"metadataLoaded",MetadataFailed:"metadataFailed",AnnotationsLoaded:"annotationsLoaded",AnnotationsFailed:"annotationsFailed"};A.mServiceData={};A.prototype.fireRejectChange=function(e){this.fireEvent("rejectChange",e);return this};A.prototype.attachRejectChange=function(e,t,a){this.attachEvent("rejectChange",e,t,a);return this};A.prototype.detachRejectChange=function(e,t){this.detachEvent("rejectChange",e,t);return this};A.prototype._initializeMetadata=function(e){var t=this;this.bUseBatch=this.bUseBatch||this.oMetadata.getUseBatch();var a=function(e){if(e){t.metadataLoadEvent=setTimeout(a.bind(t),0)}else if(t.oMetadata){t.fireMetadataLoaded({metadata:t.oMetadata});d.debug("ODataModel fired metadataloaded")}};if(this.sAnnotationURI&&this.bLoadAnnotationsJoined){if(this.oAnnotations&&(this.oAnnotations.bInitialized||this.oAnnotations.isFailed())){a(!this.bLoadMetadataAsync)}else{this.oAnnotations.attachEventOnce("loaded",function(){a(true)})}}else{a(e)}};A.prototype.fireAnnotationsLoaded=function(e){if(!this.bLoadMetadataAsync){setTimeout(this.fireEvent.bind(this,"annotationsLoaded",e),0)}else{this.fireEvent("annotationsLoaded",e)}return this};A.prototype.attachAnnotationsLoaded=function(e,t,a){this.attachEvent("annotationsLoaded",e,t,a);return this};A.prototype.detachAnnotationsLoaded=function(e,t){this.detachEvent("annotationsLoaded",e,t);return this};A.prototype.fireAnnotationsFailed=function(e){if(!this.bLoadMetadataAsync){setTimeout(this.fireEvent.bind(this,"annotationsFailed",e),0)}else{this.fireEvent("annotationsFailed",e)}d.debug("ODataModel fired annotationsFailed");return this};A.prototype.attachAnnotationsFailed=function(e,t,a){this.attachEvent("annotationsFailed",e,t,a);return this};A.prototype.detachAnnotationsFailed=function(e,t){this.detachEvent("annotationsFailed",e,t);return this};A.prototype.fireMetadataLoaded=function(e){this.fireEvent("metadataLoaded",e);return this};A.prototype.attachMetadataLoaded=function(e,t,a){this.attachEvent("metadataLoaded",e,t,a);return this};A.prototype.detachMetadataLoaded=function(e,t){this.detachEvent("metadataLoaded",e,t);return this};A.prototype.fireMetadataFailed=function(e){this.fireEvent("metadataFailed",e);return this};A.prototype.attachMetadataFailed=function(e,t,a){this.attachEvent("metadataFailed",e,t,a);return this};A.prototype.detachMetadataFailed=function(e,t){this.detachEvent("metadataFailed",e,t);return this};A.prototype.refreshMetadata=function(){if(this.oMetadata&&this.oMetadata.refresh){this.oMetadata.refresh().catch(e=>{d.fatal(e)})}};A.prototype._createRequestUrl=function(e,t,a,s,i){var r,o,d,u="";if(e&&e.indexOf("?")!=-1){d=e.substr(e.indexOf("?")+1);e=e.substr(0,e.indexOf("?"))}o=this._normalizePath(e,t);if(!s){u=this.sServiceUrl+o}else{u=o.substr(o.indexOf("/")+1)}r=n._createUrlParamsArray(a);if(this.aUrlParams){r=r.concat(this.aUrlParams)}if(d){r.push(d)}if(r.length>0){u+="?"+r.join("&")}if(i===undefined){i=true}if(i===false){var h=Date.now();var f=u.replace(/([?&])_=[^&]*/,"$1_="+h);u=f+(f===u?(/\?/.test(u)?"&":"?")+"_="+h:"")}return u};A.prototype._loadData=function(e,t,a,s,i,r,n){var o,u=[],h=this._createRequestUrl(e,null,t,null,i||this.bCache),f=this._createRequest(h,"GET",true),c=this;function l(e,t){var s=e,i={};if(t.statusCode==204){if(a){a(null)}if(n){n(null)}c.fireRequestCompleted({url:f.requestUri,type:"GET",async:f.async,info:"Accept headers:"+c.oHeaders["Accept"],infoObject:{acceptHeaders:c.oHeaders["Accept"]},success:true});return undefined}if(!s){d.fatal("The following problem occurred: No data was retrieved by service: "+t.requestUri);c.fireRequestCompleted({url:f.requestUri,type:"GET",async:f.async,info:"Accept headers:"+c.oHeaders["Accept"],infoObject:{acceptHeaders:c.oHeaders["Accept"]},success:false});return false}if(c.bUseBatch){var r=c._getBatchErrors(e);if(r.length>0){p(r[0]);return false}if(s.__batchResponses&&s.__batchResponses.length>0){s=s.__batchResponses[0].data}else{d.fatal("The following problem occurred: No data was retrieved by service: "+t.requestUri)}}u=u.concat(s.results);if(s.__next){var o=new U(s.__next);f.requestUri=o.absoluteTo(t.requestUri).toString();y(f)}else{if(s.results){var h,l;for(l in u){h=u[l];if(u===h){continue}s.results[l]=h}}if(s.results&&!Array.isArray(s.results)){s=s.results}c._importData(s,i);if(c.sChangeKey&&i){var _=c.sChangeKey.substr(c.sChangeKey.lastIndexOf("/")+1);if(i[_]){delete c.oRequestQueue[c.sChangeKey];c.sChangeKey=null}}if(a){a(s)}c.checkUpdate(false,false,i);if(n){n(s)}c.fireRequestCompleted({url:f.requestUri,type:"GET",async:f.async,info:"Accept headers:"+c.oHeaders["Accept"],infoObject:{acceptHeaders:c.oHeaders["Accept"]},success:true})}return undefined}function p(e){if(c.bTokenHandling&&e.response){var t=c._getHeader("x-csrf-token",e.response.headers);if(!f.bTokenReset&&e.response.statusCode=="403"&&t&&t.toLowerCase()=="required"){c.resetSecurityToken();f.bTokenReset=true;y();return}}var a=c._handleError(e);if(s){s(e,o&&o.bAborted)}c.fireRequestCompleted({url:f.requestUri,type:"GET",async:f.async,info:"Accept headers:"+c.oHeaders["Accept"],infoObject:{acceptHeaders:c.oHeaders["Accept"]},success:false,errorobject:a});if(!o||!o.bAborted){a.url=f.requestUri;c.fireRequestFailed(a)}}function y(){if(c.bUseBatch){c.updateSecurityToken();var t=U.parse(f.requestUri).query;var a=c._createRequestUrl(e,null,t,c.bUseBatch);f=c._createRequest(a,"GET",true);if(c.bTokenHandling){delete f.headers["x-csrf-token"]}var s=c._createBatchRequest([f],true);o=c._request(s,l,p,C.batchHandler,undefined,c.getServiceMetadata())}else{o=c._request(f,l,p,c.oHandler,undefined,c.getServiceMetadata())}if(r){var i={abort:function(){o.bAborted=true;o.abort()}};r(i)}}if(c.bTokenHandling){delete f.headers["x-csrf-token"]}this.fireRequestSent({url:f.requestUri,type:"GET",async:f.async,info:"Accept headers:"+this.oHeaders["Accept"],infoObject:{acceptHeaders:this.oHeaders["Accept"]}});y()};A.prototype._importData=function(e,t){var a=this,s,i,r,n;if(e.results){s=[];f(e.results,function(e,i){s.push(a._importData(i,t))});return s}else{i=this._getKey(e);n=this.oData[i];if(!n){n=e;this.oData[i]=n}f(e,function(e,s){if(s&&(s.__metadata&&s.__metadata.uri||s.results)&&!s.__deferred){r=a._importData(s,t);if(Array.isArray(r)){n[e]={__list:r}}else{n[e]={__ref:r}}}else if(!s||!s.__deferred){n[e]=s}});t[i]=true;return i}};A.prototype._removeReferences=function(e){var t=this,a;if(e.results){a=[];f(e.results,function(e,s){a.push(t._removeReferences(s))});return a}else{f(e,function(t,a){if(a){if(a["__ref"]||a["__list"]){delete e[t]}}});return e}};A.prototype._restoreReferences=function(e){var t=this,a,s=[];if(e.results){a=[];f(e.results,function(e,s){a.push(t._restoreReferences(s))});return a}else{f(e,function(a,i){if(i&&i["__ref"]){var r=t._getObject("/"+i["__ref"]);o(r,"ODataModel inconsistent: "+i["__ref"]+" not found!");if(r){delete i["__ref"];e[a]=r;t._restoreReferences(r)}}else if(i&&i["__list"]){f(i["__list"],function(e,a){var r=t._getObject("/"+i["__list"][e]);o(r,"ODataModel inconsistent: "+i["__list"][e]+" not found!");if(r){s.push(r);t._restoreReferences(r)}});delete i["__list"];i.results=s;s=[]}});return e}};A.prototype.removeData=function(){this.oData={}};A.prototype.initialize=function(){var e=this.getBindings();f(e,function(e,t){t.initialize()})};A.prototype.refresh=function(e,t){if(t){this.removeData()}this._refresh(e)};A.prototype._refresh=function(e,t,a){var s=this.getBindings();f(s,function(s,i){i.refresh(e,t,a)})};A.prototype.checkUpdate=function(e,t,a,s){if(t){if(!this.sUpdateTimer){this.sUpdateTimer=setTimeout(function(){this.checkUpdate(e,false,a)}.bind(this),0)}return}if(this.sUpdateTimer){clearTimeout(this.sUpdateTimer);this.sUpdateTimer=null}var i=this.getBindings();f(i,function(t,i){if(!s||this.isMetaModelPath(i.getPath())){i.checkUpdate(e,a)}}.bind(this))};A.prototype.bindProperty=function(e,t,a){var s=new i(this,e,t,a);return s};A.prototype.bindList=function(e,t,s,i,r){var n=new a(this,e,t,s,i,r);return n};A.prototype.bindTree=function(e,t,a,s){var i=new r(this,e,t,a,s);return i};A.prototype.createBindingContext=function(e,t,a,s,i){var r=this.resolve(e,t);i=!!i;if(typeof t=="function"){s=t;t=null}if(typeof a=="function"){s=a;a=null}if(!r){if(s){s(null)}return null}var n=this._getObject(e,t),o,d,u=this;if(!i){i=this._isReloadNeeded(r,n,a)}if(!i){o=this._getKey(n);d=this.getContext("/"+o);if(s){s(d)}return d}if(s){var h=!e.startsWith("/");if(r){var f=[],c=this.createCustomParams(a);if(c){f.push(c)}this._loadData(r,f,function(a){o=a?u._getKey(a):undefined;if(o&&t&&h){var i=t.getPath();i=i.substr(1);if(u.oData[i]){u.oData[i][e]={__ref:o}}}d=u.getContext("/"+o);s(d)},function(){s(null)})}else{s(null)}}return undefined};A.prototype._isReloadNeeded=function(e,t,a){var s,i,r,n,o,d,u=[],h=[];if(!e){return false}if(!t){return true}if(a&&a["expand"]){r=a["expand"].replace(/\s/g,"");u=r.split(",")}if(u){for(i=0;i<u.length;i++){var f=u[i].indexOf("/");if(f!==-1){var c=u[i].slice(0,f);var l=u[i].slice(f+1);u[i]=[c,l]}}}for(i=0;i<u.length;i++){var p=u[i];if(Array.isArray(p)){var y=t[p[0]];var _=p[1];if(!y||y&&y.__deferred){return true}else if(y){if(y.__list&&y.__list.length>0){for(var g=0;g<y.__list.length;g++){n="/"+y.__list[g];s=this.getObject(n);o=this._isReloadNeeded(n,s,{expand:_});if(o){return true}}}else if(y.__ref){n="/"+y.__ref;s=this.getObject(n);o=this._isReloadNeeded(n,s,{expand:_});if(o){return true}}}}else if(t[p]===undefined||t[p]&&t[p].__deferred){return true}}if(a&&a["select"]){d=a["select"].replace(/\s/g,"");h=d.split(",")}for(i=0;i<h.length;i++){if(t[h[i]]===undefined){return true}}if(h.length==0){var b=this.oMetadata._getEntityTypeByPath(e);if(!b){return false}else{for(i=0;i<b.property.length;i++){if(t[b.property[i].name]===undefined){return true}}}}return false};A.prototype.destroyBindingContext=function(e){};A.prototype.createCustomParams=function(e){var t,a,s=[],i,r={expand:true,select:true};for(a in e){if(a in r){s.push("$"+a+"="+h(e[a]))}if(a=="custom"){i=e[a];for(t in i){if(t.indexOf("$")==0){d.warning("Trying to set OData parameter "+t+" as custom query option!")}else{s.push(t+"="+h(i[t]))}}}}return s.join("&")};A.prototype.bindContext=function(e,a,s){var i=new t(this,e,a,s);return i};A.prototype.setCountSupported=function(e){this.bCountSupported=e};A.prototype.isCountSupported=function(){return this.bCountSupported};A.prototype.setDefaultCountMode=function(e){this.sDefaultCountMode=e};A.prototype.getDefaultCountMode=function(){return this.sDefaultCountMode};A.prototype._getKey=function(e,t){var a,s;if(e instanceof m){a=e.getPath().substr(1)}else if(e&&e.__metadata&&e.__metadata.uri){s=e.__metadata.uri;a=s.substr(s.lastIndexOf("/")+1)}if(t){a=decodeURIComponent(a)}return a};A.prototype.getKey=function(e,t){return this._getKey(e,t)};A.prototype.createKey=function(e,t,a){var s=this.oMetadata._getEntityTypeByPath(e),i=e,r=this,d,u,h;o(s,'Could not find entity type of collection "'+e+'" in service metadata!');i+="(";if(s.key.propertyRef.length==1){d=s.key.propertyRef[0].name;o(d in t,'Key property "'+d+'" is missing in object!');h=this.oMetadata._getPropertyMetadata(s,d);u=n.formatValue(t[d],h.type);i+=a?u:encodeURIComponent(u)}else{f(s.key.propertyRef,function(e,f){if(e>0){i+=","}d=f.name;o(d in t,'Key property "'+d+'" is missing in object!');h=r.oMetadata._getPropertyMetadata(s,d);u=n.formatValue(t[d],h.type);i+=d;i+="=";i+=a?u:encodeURIComponent(u)})}i+=")";return i};A.prototype.getProperty=function(e,t,a){var s=this._getObject(e,t);if(a==null||a==undefined){return s}if(!p(s)){return s}s=y({},s);if(a==true){return this._restoreReferences(s)}else{return this._removeReferences(s)}};A.prototype._getObject=function(e,t){var a=this.isLegacySyntax()?this.oData:null,s=this.resolve(e,t),i,r,n,o,d,u;if(this.oMetadata&&s&&s.indexOf("/#")>-1){if(this.isMetaModelPath(s)){i=s.indexOf("/##");u=this.getMetaModel();if(!this.bMetaModelLoaded){return null}r=s.substr(0,i);n=s.substr(i+3);o=u.getMetaContext(r);a=u.getProperty(n,o)}else{a=this.oMetadata._getAnnotation(s)}}else{if(t){d=t.getPath();d=d.substr(1);a=this.oData[d]}if(!e){return a}var h=e.split("/"),f=0;if(!h[0]){a=this.oData;f++}while(a&&h[f]){a=a[h[f]];if(a){if(a.__ref){a=this.oData[a.__ref]}else if(a.__list){a=a.__list}else if(a.__deferred){a=undefined}}f++}}return a};A.prototype.updateSecurityToken=function(){if(this.bTokenHandling){if(!this.oServiceData.securityToken){this.refreshSecurityToken()}if(this.bTokenHandling){this.oHeaders["x-csrf-token"]=this.oServiceData.securityToken}}};A.prototype.resetSecurityToken=function(){delete this.oServiceData.securityToken;delete this.oHeaders["x-csrf-token"]};A.prototype.getSecurityToken=function(){var e=this.oServiceData.securityToken;if(!e){this.refreshSecurityToken();e=this.oServiceData.securityToken}return e};A.prototype.refreshSecurityToken=function(e,t,a){var s=this,i,r;a=a===true;i=this._createRequestUrl("/");var n=this._createRequest(i,"GET",a);n.headers["x-csrf-token"]="Fetch";function o(t,a){if(a){r=s._getHeader("x-csrf-token",a.headers);if(r){s.oServiceData.securityToken=r;s.oHeaders["x-csrf-token"]=r}else{s.resetSecurityToken();s.bTokenHandling=false}}if(e){e(t,a)}}function d(e){s.resetSecurityToken();s.bTokenHandling=false;s._handleError(e);if(t){t(e)}}return this._request(n,o,d,undefined,undefined,this.getServiceMetadata())};A.prototype._submitRequest=function(e,t,a,s,i,r){var n=this,o,d={};function u(s,u){if(t&&i){var c=n._getBatchErrors(s);if(c.length>0){h(c[0]);return false}if(s.__batchResponses&&s.__batchResponses.length>0){o=s.__batchResponses[0].data;if(!o&&s.__batchResponses[0].__changeResponses){o=s.__batchResponses[0].__changeResponses[0].data}}s=o}if(r){if(s&&s.__batchResponses){f(s.__batchResponses,function(e,t){if(t&&t.data){n._importData(t.data,d)}})}}n._handleETag(e,u,t);n._updateRequestQueue(e,t);if(n._isRefreshNeeded(e,u)){n._refresh(false,e.keys,e.entityTypes)}if(a){a(s,u)}return undefined}function h(t){if(n.bTokenHandling&&t.response){var a=n._getHeader("x-csrf-token",t.response.headers);if(!e.bTokenReset&&t.response.statusCode=="403"&&a&&a.toLowerCase()=="required"){n.resetSecurityToken();e.bTokenReset=true;c();return}}n._handleError(t);if(s){s(t)}}function c(){if(n.bTokenHandling){delete e.headers["x-csrf-token"]}if(n.bTokenHandling&&e.method!=="GET"){n.updateSecurityToken();if(n.bTokenHandling){e.headers["x-csrf-token"]=n.oServiceData.securityToken}}if(t){return n._request(e,u,h,C.batchHandler,undefined,n.getServiceMetadata())}else{return n._request(e,u,h,n.oHandler,undefined,n.getServiceMetadata())}}return c()};A.prototype._createBatchRequest=function(e,t){var a,s,i={},r={},n={},o={};r.__batchRequests=e;a=this.sServiceUrl+"/$batch";if(this.aUrlParams.length>0){a+="?"+this.aUrlParams.join("&")}c(i,this.mCustomHeaders,this.oHeaders);delete i["Content-Type"];s={headers:i,requestUri:a,method:"POST",data:r,user:this.sUser,password:this.sPassword,async:t};if(t){s.withCredentials=this.bWithCredentials}f(e,function(e,t){if(t["__changeRequests"]){f(t["__changeRequests"],function(e,t){if(t.keys&&t.method!="POST"){f(t.keys,function(e,t){n[e]=t})}else if(t.entityTypes&&t.method=="POST"){f(t.entityTypes,function(e,t){o[e]=t})}})}});s.keys=n;s.entityTypes=o;return s};A.prototype._handleETag=function(e,t,a){var s,i,r,n,o,u;if(a){o=e.data.__batchRequests;u=t.data.__batchResponses;if(u&&o){for(var h=0;h<o.length;h++){r=o[h].__changeRequests;if(u[h]){n=u[h].__changeResponses;if(r&&n){for(var f=0;f<r.length;f++){if(r[f].method=="MERGE"||r[f].method=="PUT"){s=r[f].requestUri.replace(this.sServiceUrl+"/","");if(!s.startsWith("/")){s="/"+s}i=this._getObject(s);if(i&&i.__metadata&&n[f].headers&&n[f].headers.ETag){i.__metadata.etag=n[f].headers.ETag}}}}}else{d.warning("could not update ETags for batch request: corresponding response for request missing")}}}else{d.warning("could not update ETags for batch request: no batch responses/requests available")}}else{s=e.requestUri.replace(this.sServiceUrl+"/","");if(!s.startsWith("/")){s="/"+s}i=this._getObject(s);if(i&&i.__metadata&&t.headers.ETag){i.__metadata.etag=t.headers.ETag}}};A.prototype._handleBatchErrors=function(e,t){this._getBatchErrors(t);this._handleETag()};A.prototype._getBatchErrors=function(e){var t=[],a;f(e.__batchResponses,function(e,s){if(s.message){a="The following problem occurred: "+s.message;if(s.response){a+=s.response.statusCode+","+s.response.statusText+","+s.response.body}t.push(s);d.fatal(a)}if(s.__changeResponses){f(s.__changeResponses,function(e,s){if(s.message){a="The following problem occurred: "+s.message;if(s.response){a+=s.response.statusCode+","+s.response.statusText+","+s.response.body}t.push(s);d.fatal(a)}})}});return t};A.prototype._handleError=function(e){var t={},a;var s="The following problem occurred: "+e.message;t.message=e.message;if(e.response){if(this.bTokenHandling){a=this._getHeader("x-csrf-token",e.response.headers);if(e.response.statusCode=="403"&&a&&a.toLowerCase()=="required"){this.resetSecurityToken()}}s+=e.response.statusCode+","+e.response.statusText+","+e.response.body;t.statusCode=e.response.statusCode;t.statusText=e.response.statusText;t.responseText=e.response.body}d.fatal(s);return t};A.prototype.getData=function(e,t,a){return this.getProperty(e,t,a)};A.prototype._getETag=function(e,t,a){var s,i,r;if(a){s=a}else if(t&&t.__metadata){s=t.__metadata.etag}else if(e){i=e.replace(this.sServiceUrl+"/","");r=i.indexOf("?");if(r>-1){i=i.substr(0,r)}if(this.oData.hasOwnProperty(i)){s=this.getProperty("/"+i+"/__metadata/etag")}}return s};A.prototype._createRequest=function(e,t,a,s,i){var r={},n;c(r,this.mCustomHeaders,this.oHeaders);n=this._getETag(e,s,i);if(n&&t!="GET"){r["If-Match"]=n}if(this.bJSON&&t!="DELETE"&&this.sMaxDataServiceVersion==="2.0"){r["Content-Type"]="application/json"}if(t=="MERGE"&&!this.bUseBatch){r["x-http-method"]="MERGE";t="POST"}var o={headers:r,requestUri:e,method:t,user:this.sUser,password:this.sPassword,async:a};if(s){o.data=s}if(a){o.withCredentials=this.bWithCredentials}return o};A.prototype._isRefreshNeeded=function(e,t){var a=false,s,i=[],r=this;if(!this.bRefreshAfterChange){return a}if(e.data&&Array.isArray(e.data.__batchRequests)){if(t){i=r._getBatchErrors(t.data);f(i,function(e,t){if(t.response&&t.response.statusCode=="412"){s=t.response.statusCode;return false}return true});if(s){return false}}f(e.data.__batchRequests,function(e,t){if(Array.isArray(t.__changeRequests)){f(t.__changeRequests,function(e,t){a=a||r._isRefreshNeeded(t);return!a})}return!a})}else if(e.method==="GET"){return false}else if(t&&t.statusCode=="412"){a=false}else{a=true}return a};A.prototype.update=function(e,t,a){var s,i,r,n,o,d,u,h,f,c,l,p,y=false;if(a instanceof m||arguments.length>3){d=a;s=arguments[3];i=arguments[4];r=arguments[5]}else{d=a.context||a.oContext;s=a.success||a.fnSuccess;i=a.error||a.fnError;u=a.eTag||a.sETag;r=typeof a.merge=="undefined"?a.bMerge===true:a.merge===true;y=typeof a.async=="undefined"?a.bAsync===true:a.async===true;p=a.urlParameters}o=this._createRequestUrl(e,d,p,this.bUseBatch);if(r){n=this._createRequest(o,"MERGE",y,t,u)}else{n=this._createRequest(o,"PUT",y,t,u)}e=this._normalizePath(e,d);c=this._getObject(e);n.keys={};if(c){l=this._getKey(c);n.keys[l]=true}if(this.bUseBatch){f=this._createBatchRequest([{__changeRequests:[n]}],y);h=this._submitRequest(f,this.bUseBatch,s,i,true)}else{h=this._submitRequest(n,this.bUseBatch,s,i)}return h};A.prototype.create=function(e,t,a){var s,i,r,n,o,d,u,h,f=false,c;if(a&&typeof a=="object"&&!(a instanceof m)){d=a.context;u=a.success;c=a.urlParameters;h=a.error;f=a.async===true}else{d=a;u=arguments[3];h=arguments[4]}r=this._createRequestUrl(e,d,c,this.bUseBatch);s=this._createRequest(r,"POST",f,t);e=this._normalizePath(e,d);o=this.oMetadata._getEntityTypeByPath(e);s.entityTypes={};if(o){s.entityTypes[o.entityType]=true}if(this.bUseBatch){i=this._createBatchRequest([{__changeRequests:[s]}],f);n=this._submitRequest(i,this.bUseBatch,u,h,true)}else{n=this._submitRequest(s,this.bUseBatch,u,h)}return n};A.prototype.remove=function(e,t){var a,s,i,r,n,o,d,u,h,f,c,l,p,y,_=false,g=this;if(t instanceof m||arguments[2]){a=t;r=arguments[2];n=arguments[3]}else if(t){a=t.context||t.oContext;r=t.success||t.fnSuccess;n=t.error||t.fnError;u=t.eTag||t.sETag;f=t.payload||t.oPayload;_=typeof t.async=="undefined"?t.bAsync===true:t.async===true;y=t.urlParameters}c=function(e,t){s=d.substr(d.lastIndexOf("/")+1);if(s.indexOf("?")!=-1){s=s.substr(0,s.indexOf("?"))}delete g.oData[s];delete g.mContexts["/"+s];if(r){r(e,t)}};d=this._createRequestUrl(e,a,y,this.bUseBatch);o=this._createRequest(d,"DELETE",_,f,u);e=this._normalizePath(e,a);i=this._getObject(e);o.keys={};if(i){h=this._getKey(i);o.keys[h]=true}if(this.bUseBatch){l=this._createBatchRequest([{__changeRequests:[o]}],_);p=this._submitRequest(l,this.bUseBatch,c,n,true)}else{p=this._submitRequest(o,this.bUseBatch,c,n)}return p};A.prototype.callFunction=function(e,t){var a,s,i,r,u,h,c,l,p,y,_="GET",g={},b=this;if(t&&typeof t=="object"){_=t.method?t.method:_;h=t.urlParameters;c=t.context;l=t.success;p=t.error;y=t.async===true}else{_=t;h=arguments[2];c=arguments[3];l=arguments[4];p=arguments[5];y=arguments[6]===true}u=this.oMetadata._getFunctionImportMetadata(e,_);o(u,"Function "+e+" not found in the metadata !");if(u){i=this._createRequestUrl(e,c,null,this.bUseBatch);var m=new U(i);if(u.parameter!=null){f(h,function(t,a){var s=u.parameter.filter(function(e){return e.name==t&&e.mode=="In"});if(s.length>0){var i=s[0];g[t]=n.formatValue(a,i.type)}else{d.warning("Parameter "+t+" is not defined for function call "+e+"!")}})}if(_==="GET"){return b.read(e,c,g,true,l,p)}else{f(g,function(e,t){m.addQuery(e,t)});a=this._createRequest(m.toString(),_,y);if(this.bUseBatch){s=this._createBatchRequest([{__changeRequests:[a]}],y);r=this._submitRequest(s,this.bUseBatch,l,p,true)}else{r=this._submitRequest(a,this.bUseBatch,l,p)}return r}}return undefined};A.prototype.read=function(e,t){var a,s,i,r,o,u,h,f,c,l,p,y,_,g,b,M,R;if(t&&typeof t=="object"&&!(t instanceof m)){o=t.context;u=t.urlParameters;h=t.async!==false;f=t.success;c=t.error;l=t.filters;p=t.sorters}else{o=t;u=arguments[2];h=arguments[3]!==false;f=arguments[4];c=arguments[5]}h=h!==false;R=n._createUrlParamsArray(u);_=n.createSortParams(p);if(_){R.push(_)}if(l&&!this.oMetadata){d.fatal("Tried to use filters in read method before metadata is available.")}else{M=this._normalizePath(e,o);b=this.oMetadata&&this.oMetadata._getEntityTypeByPath(M);g=v.groupFilters(l);y=n.createFilterParams(g,this.oMetadata,b);if(y){R.push(y)}}s=this._createRequestUrl(e,o,R,this.bUseBatch);a=this._createRequest(s,"GET",h);if(this.bUseBatch){r=this._createBatchRequest([a],h);i=this._submitRequest(r,this.bUseBatch,f,c,true)}else{i=this._submitRequest(a,this.bUseBatch,f,c)}return i};A.prototype.createBatchOperation=function(e,t,a,s){var i={},r,n,o,d;c(i,this.mCustomHeaders,this.oHeaders);if(e.startsWith("/")){e=e.substr(1)}if(s){r=s.sETag}if(t!="GET"){r=this._getETag(e,a,r);if(r){i["If-Match"]=r}}if(this.bJSON){if(t!="DELETE"&&t!="GET"&&this.sMaxDataServiceVersion==="2.0"){i["Content-Type"]="application/json"}}else{i["Content-Type"]="application/atom+xml"}var u={requestUri:e,method:t.toUpperCase(),headers:i};if(a){u.data=a}if(t!="GET"&&t!="POST"){if(e&&e.indexOf("/")!=0){e="/"+e}n=this._getObject(e);if(n){o=this._getKey(n);u.keys={};u.keys[o]=true}}else if(t=="POST"){var h=e;if(e.indexOf("?")!=-1){h=e.substr(0,e.indexOf("?"))}d=this.oMetadata._getEntityTypeByPath(h);if(d){u.entityTypes={};u.entityTypes[d.entityType]=true}}return u};A.prototype.addBatchReadOperations=function(e){if(!Array.isArray(e)||e.length<=0){d.warning("No array with batch operations provided!");return false}var t=this;f(e,function(e,a){if(a.method!="GET"){d.warning("Batch operation should be a GET operation!");return false}t.aBatchOperations.push(a);return true});return undefined};A.prototype.addBatchChangeOperations=function(e){if(!Array.isArray(e)||e.length<=0){return false}f(e,function(e,t){if(t.method!="POST"&&t.method!="PUT"&&t.method!="MERGE"&&t.method!="DELETE"){d.warning("Batch operation should be a POST/PUT/MERGE/DELETE operation!");return false}return true});this.aBatchOperations.push({__changeRequests:e});return undefined};A.prototype.clearBatch=function(){this.aBatchOperations=[]};A.prototype.submitBatch=function(e,t,a,s){var i,r,n=this;function o(t,a){if(e){e(t,a,n._getBatchErrors(t))}}if(!(typeof e=="function")){var u=a;var h=t;a=e;e=h;t=u}a=a!==false;if(this.aBatchOperations.length<=0){d.warning("No batch operations in batch. No request will be triggered!");return false}i=this._createBatchRequest(this.aBatchOperations,a);r=this._submitRequest(i,true,o,t,false,s);this.clearBatch();return r};A.prototype.getServiceMetadata=function(){if(this.oMetadata&&this.oMetadata.isLoaded()){return this.oMetadata.getServiceMetadata()}return undefined};A.prototype.getServiceAnnotations=function(){if(this.oAnnotations&&this.oAnnotations.getAnnotationsData){return this.oAnnotations.getAnnotationsData()}return undefined};A.prototype.submitChanges=function(e,t,a){var s,i,r=this,n,o,d,u,h,c;if(this.sChangeKey){n=this.sChangeKey.replace(this.sServiceUrl,"");h=this._getObject(n);i=h;if(p(h)){i=y({},h);if(i.__metadata){d=i.__metadata.type;u=i.__metadata.etag;delete i.__metadata;if(d||u){i.__metadata={}}if(d){i.__metadata.type=d}if(u){i.__metadata.etag=u}}f(i,function(e,t){if(t&&t.__deferred){delete i[e]}});var _=this.oMetadata._getEntityTypeByPath(n);if(_){var g=this.oMetadata._getNavigationPropertyNames(_);f(g,function(e,t){delete i[t]})}i=this._removeReferences(i)}if(a&&a.sETag){o=a.sETag}s=this._createRequest(this.sChangeKey,"MERGE",true,i,o);if(this.sUrlParams){s.requestUri+="?"+this.sUrlParams}s.keys={};if(h){c=this._getKey(h);s.keys[c]=true}this.oRequestQueue[this.sChangeKey]=s}if(l(this.oRequestQueue)){return undefined}if(this.bUseBatch){var b=[];f(this.oRequestQueue,function(e,t){delete t._oRef;var a=y({},t);t._oRef=a;a.requestUri=a.requestUri.replace(r.sServiceUrl+"/","");if(a.data._bCreate){delete a.data._bCreate}b.push(a)});s=this._createBatchRequest([{__changeRequests:b}],true);this._submitRequest(s,this.bUseBatch,e,t,true)}else{f(this.oRequestQueue,function(a,s){delete s._oRef;var i=y({},s);s._oRef=i;if(i.data&&i.data._bCreate){delete i.data._bCreate}r._submitRequest(i,this.bUseBatch,e,t,true)})}return undefined};A.prototype._updateRequestQueue=function(e,t){var a,s,i,r=this;if(t){a=e.data.__batchRequests;if(a){for(var n=0;n<a.length;n++){s=a[n].__changeRequests;if(s){for(var o=0;o<s.length;o++){i=s[o];f(this.oRequestQueue,function(e,t){if(t._oRef===i&&e!==r.sChangeKey){delete r.oRequestQueue[e];delete r.oData[e];delete r.mContexts["/"+e]}else if(r.sChangeKey&&e===r.sChangeKey){delete r.oRequestQueue[e];r.sChangeKey=null}})}}}}}else{f(this.oRequestQueue,function(t,a){if(a._oRef===e&&t!==r.sChangeKey){delete r.oRequestQueue[t];delete r.oData[t];delete r.mContexts["/"+t]}else if(r.sChangeKey&&t===r.sChangeKey){delete r.oRequestQueue[t];r.sChangeKey=null}})}};A.prototype.resetChanges=function(e,t){var a;if(this.sChangeKey){a=this.sChangeKey.replace(this.sServiceUrl,"");this._loadData(a,null,e,t)}};A.prototype.setProperty=function(e,t,a,s){var i,r={},n={},o=this._createRequestUrl(e,a),d=e.substring(0,e.lastIndexOf("/")),u,h,f={},c=false;if(!this.resolve(e,a)){return false}o=o.replace(this.sServiceUrl+"/","");o=o.substring(0,o.indexOf("/"));o=this.sServiceUrl+"/"+o;i=e.substr(e.lastIndexOf("/")+1);n=this._getObject(d,a);if(!n){return false}h=d.split("/");for(var l=h.length-1;l>=0;l--){r=this._getObject(h.join("/"),a);if(r){u=this._getKey(r);if(u){break}}h.splice(l-1,1)}if(!u){u=this._getKey(a)}if(u){f[u]=true}if(n._bCreate){n[i]=t;c=true;this.checkUpdate(false,s,f)}else{if(!this.sChangeKey){this.sChangeKey=o}if(this.sChangeKey==o){n[i]=t;c=true;this.checkUpdate(false,s,f)}else{this.fireRejectChange({rejectedValue:t,oldValue:n[i]})}}return c};A.prototype._isHeaderPrivate=function(e){switch(e.toLowerCase()){case"accept":case"accept-language":case"maxdataserviceversion":case"dataserviceversion":return true;case"x-csrf-token":return this.bTokenHandling;default:return false}};A.prototype.setHeaders=function(e){var t={},a=this;if(e){f(e,function(e,s){if(a._isHeaderPrivate(e)){d.warning("Not allowed to modify private header: "+e)}else{t[e]=s}});this.mCustomHeaders=t}else{this.mCustomHeaders={}}if(this.oAnnotations){this.oAnnotations.setHeaders(this.mCustomHeaders)}};A.prototype.getHeaders=function(){return c({},this.mCustomHeaders,this.oHeaders)};A.prototype._getHeader=function(e,t){var a;for(a in t){if(a.toLowerCase()===e.toLowerCase()){return t[a]}}return null};A.prototype.hasPendingChanges=function(){return this.sChangeKey!=null};A.prototype.updateBindings=function(e){this.checkUpdate(e)};A.prototype.forceNoCache=function(e){this.bCache=!e};A.prototype.setTokenHandlingEnabled=function(e){this.bTokenHandling=e};A.prototype.setUseBatch=function(e){this.bUseBatch=e};A.prototype.formatValue=function(e,t){return n.formatValue(e,t)};A.prototype.deleteCreatedEntry=function(e){if(e){var t=e.getPath();delete this.mContexts[t];if(t.startsWith("/")){t=t.substr(1)}delete this.oRequestQueue[t];delete this.oData[t]}};A.prototype.createEntry=function(e,t){var a={},s,i,r;if(!e.startsWith("/")){e="/"+e}var n=this.oMetadata._getEntityTypeByPath(e);if(!n){o(n,"No Metadata for collection "+e+" found");return undefined}if(typeof t==="object"&&!Array.isArray(t)){a=t}else{for(var d=0;d<n.property.length;d++){var u=n.property[d];var h=t&&t.indexOf(u.name)>-1;if(!t||h){a[u.name]=this._createPropertyValue(u.type);if(h){t.splice(t.indexOf(u.name),1)}}}if(t){o(t.length===0,"No metadata for the following properties found: "+t.join(","))}}a._bCreate=true;s=e.substring(1)+"('"+_()+"')";this.oData[s]=a;a.__metadata={type:""+n.entityType};i=this._createRequestUrl(e);r=this._createRequest(i,"POST",true,a);r.entityTypes={};r.entityTypes[n.entityType]=true;this.oRequestQueue[s]=r;return this.getContext("/"+s)};A.prototype._createPropertyValue=function(e){var t=this.oMetadata._splitName(e);var a=t.namespace;var s=t.name;if(a.toUpperCase()!=="EDM"){var i={};var r=this.oMetadata._getObjectMetadata("complexType",s,a);o(r,"Complex type "+e+" not found in the metadata !");for(var n=0;n<r.property.length;n++){var d=r.property[n];i[d.name]=this._createPropertyValue(d.type)}return i}else{return this._getDefaultPropertyValue(s,a)}};A.prototype._getDefaultPropertyValue=function(e,t){return undefined};A.prototype._normalizePath=function(e,t){if(e&&e.indexOf("?")!=-1){e=e.substr(0,e.indexOf("?"))}if(!t&&!e.startsWith("/")){e="/"+e;d.warning(this+" path "+e+" should be absolute if no Context is set")}return this.resolve(e,t)};A.prototype.setRefreshAfterChange=function(e){this.bRefreshAfterChange=e};A.prototype.isList=function(e,t){e=this.resolve(e,t);return e&&e.substr(e.lastIndexOf("/")).indexOf("(")===-1};A.prototype.isMetaModelPath=function(e){return e.indexOf("##")==0||e.indexOf("/##")>-1};A.prototype._request=function(e,t,a,s,i,r){var n;if(this.bDestroyed){return{abort:function(){}}}var o=this;function d(e){return function(){if(o.aPendingRequestHandles){var t=o.aPendingRequestHandles.indexOf(n);if(t>-1){o.aPendingRequestHandles.splice(t,1)}}if(!(n&&n.bSuppressErrorHandlerCall)){e.apply(this,arguments)}}}n=C.request(e,d(t||C.defaultSuccess),d(a||C.defaultError),s,i,r);if(e.async!==false){this.aPendingRequestHandles.push(n)}return n};A.prototype.destroy=function(){this.bDestroyed=true;if(this.aPendingRequestHandles){for(var e=this.aPendingRequestHandles.length-1;e>=0;e--){var t=this.aPendingRequestHandles[e];if(t&&t.abort){t.bSuppressErrorHandlerCall=true;t.abort()}}delete this.aPendingRequestHandles}if(this.oMetadataLoadEvent){clearTimeout(this.oMetadataLoadEvent)}if(this.oMetadataFailedEvent){clearTimeout(this.oMetadataFailedEvent)}if(this.oMetadata){this.oMetadata.detachLoaded(this.onMetadataLoaded);this.oMetadata.detachFailed(this.onMetadataFailed);if(!this.oMetadata.isLoaded()&&!this.oMetadata.hasListeners("loaded")){this.oMetadata.destroy();delete this.oServiceData.oMetadata}delete this.oMetadata}if(this.oAnnotations){this.oAnnotations.detachFailed(this.onAnnotationsFailed);this.oAnnotations.detachLoaded(this.onAnnotationsLoaded);this.oAnnotations.destroy();delete this.oAnnotations;delete this.pAnnotationsLoaded}M.prototype.destroy.apply(this,arguments)};A.prototype._getAnnotationParser=function(e){if(!this.oAnnotations){this.oAnnotations=new R({annotationData:e,url:null,metadata:this.oMetadata,async:this.bLoadMetadataAsync,headers:this.mCustomHeaders});this.oAnnotations.attachFailed(this.onAnnotationsFailed,this);this.oAnnotations.attachLoaded(this.onAnnotationsLoaded,this)}return this.oAnnotations};A.prototype.onAnnotationsFailed=function(e){this.fireAnnotationsFailed(e.getParameters())};A.prototype.onAnnotationsLoaded=function(e){this.fireAnnotationsLoaded(e.getParameters())};A.prototype.addAnnotationUrl=function(e){var t=[].concat(e),a=[],s=[],i=[],r=this;f(t,function(e,t){var i=t.indexOf("$metadata");if(i>=0){if(i==0){t=r.sServiceUrl+"/"+t}a.push(t)}else{s.push(t)}});return this.oMetadata._addUrl(a).then(function(e){return Promise.all(e.map(function(e){i=i.concat(e.entitySets);return r.addAnnotationXML(e["metadataString"])}))}).then(function(){return r._getAnnotationParser().addUrl(s)}).then(function(e){return{annotations:e.annotations,entitySets:i}})};A.prototype.addAnnotationXML=function(e,t){return new Promise(function(a,s){this._getAnnotationParser().setXML(null,e,{success:a,error:s,fireEvents:!t})}.bind(this))};A.prototype.getMetaModel=function(){var e=this;if(!this.oMetaModel){this.oMetaModel=new T(this.oMetadata,this.oAnnotations,this);this.oMetaModel.loaded().then(function(){e.bMetaModelLoaded=true;e.checkUpdate(false,false,null,true)})}return this.oMetaModel};A.prototype.annotationsLoaded=function(){return this.oMetadata.isLoaded()&&(!this.oAnnotations||this.oAnnotations.isLoaded())?null:this.pAnnotationsLoaded};return A});
//# sourceMappingURL=ODataModel.js.map