MobileProgramGuide.routes = (function($, controller)
{
	"use strict";

	var router = new $.mobile.Router([
	        { "#splashPage": { events: "s", handler: MobileProgramGuide.controller.onSplashPageShow } },	        
	        { "#landingPage": { events: "i", handler: MobileProgramGuide.controller.onLandingPageInit } },
	        { "#landingPage": { events: "bs", handler: MobileProgramGuide.controller.onLandingPageBeforeShow } },
	        { "#programDetails[?]progid=(\\S+)&planid=(\\S+)": { events: "i", handler: MobileProgramGuide.controller.onDetailPageInit } },
	        { "#programDetails[?]progid=(\\S+)&planid=(\\S+)": { events: "bs", handler: MobileProgramGuide.controller.onDetailPageBeforeShow } },
	        { "#programDetails[?]progid=(\\S+)&planid=(\\S+)": { events: "bh", handler: MobileProgramGuide.controller.onDetailPageBeforeHide } },
					//{ "#programDetails[?]progid=(\\S+)&planid=(\\S+)": { events: "s", handler: MobileProgramGuide.controller.onDetailPageShow } },
					{ "#searchResults[?]type=(\\S+)&query=(\\S+)" : { events: "i", handler: MobileProgramGuide.controller.onSearchResultsInit} },
	        { "#searchResults[?]type=(\\S+)&query=(\\S+)" : { events: "bs", handler: MobileProgramGuide.controller.onSearchResultsBeforeShow} },
	        { "#programsAtoZ" : { events: "i", handler: MobileProgramGuide.controller.onProgramsAtoZPageInit } },
	        { "#programsAtoZ" : { events: "bs", handler: MobileProgramGuide.controller.onProgramsAtoZBeforeShow } },
	        { "#webview[?]progid=(\\S+)&planid=(\\S+)" : { events: "bs", handler: MobileProgramGuide.controller.onWebViewBeforeShow } }
	]);

  var init = function()
  {
		controller.init();
	};

  var pub =
  {
		init: init
	};

	return pub;

}(jQuery, MobileProgramGuide.controller));

MobileProgramGuide.routes.init();
