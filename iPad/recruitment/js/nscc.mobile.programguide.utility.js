MobileProgramGuide.utility = (function ($)
{
	"use strict";
	
	var isProduction = false,
			cacheStatusValues = ["uncached", "idle", "checking", "downloading", "updateready", "obsolete"];	
			;

	var gotoPage = function(href, transition, rev, setDataUrl, allowSamePageTrans)
	{
			if(transition === "") { transition = defaultTransitionType; }
		
			var options = { transition: transition, reverse: rev }
			if(setDataUrl) { options.dataUrl = href; }
			if(allowSamePageTrans) { options.allowSamePageTransition = true; }
	    
	    $.mobile.changePage(href, options);
	};
	
	var encodeString = function(s)
	{
		if(s != null && s != "")
		{
			s = s.replace(/–/g, "&ndash;");
			s = s.replace(/&amp;/g, "&");
		}

		return s;
	};

	var isLandscape = function()
	{
		if(window.orientation === 0 || window.orientation === 180)
		{
			return false;			
		}
		
		return true;
	};
	
	var getAppCacheStatus = function()
	{
		var appCache = window.applicationCache;
		return cacheStatusValues[appCache.status];
	};
		
	var handleCacheEvents = function()
	{
		var appCache = window.applicationCache;
		appCache.addEventListener("cached", logCacheEvent, false);
		appCache.addEventListener("checking", logCacheEvent, false);
		appCache.addEventListener("downloading", logCacheEvent, false);
		appCache.addEventListener("error", logCacheEvent, false);
		appCache.addEventListener("noupdate", logCacheEvent, false);
		appCache.addEventListener("obsolete", logCacheEvent, false);
		appCache.addEventListener("progress", logCacheEvent, false);
		appCache.addEventListener("updateready", logCacheEvent, false);	
	};	
	
	var logCacheEvent = function(e)
	{
		var appCache = window.applicationCache;		
		
		var online, status, type, message;		
    status = cacheStatusValues[appCache.status];
    type = e.type;
    
    message = "online: " + isOnline();
    message += ", event: " + type;
    message += ", status: " + status;
    if (type == "error" && isOnline()) { message += " (probably a syntax error in manifest)"; }
    
    printMessage(message, "");
    
	};
	
	var isOnline = function()
	{
		if(navigator.onLine)
		{
			return true;
		}

		return false;
	};

	var scrollTo = function(yCoord)
	{
		$.mobile.silentScroll(yCoord);
	};

	var queryStringToObject = function(queryString)
  	{
		var queryStringObj = {};
		var e;
		var a = /\+/g;  // Regex for replacing addition symbol with a space
		var r = /([^&;=]+)=?([^&;]*)/g;
		var d = function (s) { return decodeURIComponent(s.replace(a, " ")); };

		e = r.exec(queryString);
		while (e)
		{
		  queryStringObj[d(e[1])] = d(e[2]);
		  e = r.exec(queryString);

		}
		return queryStringObj;
  	};


	var printMessage = function(message, level)
	{
		if(!isProduction)
		{
			if(typeof (console) !== "undefined")
			{
				switch(level)
				{
					case "info":
						console.info(message);
						break;
					case "warn":
						console.warn(message);
						break;
					case "debug":
						console.debug(message);
						break;
					case "error":
						console.error(message);
						break;
					default:
						console.log(message);
						break;
				}
			}
		}
	};


	// Public method exposure
	var pub =
	{
		gotoPage: gotoPage,
		encodeString: encodeString,
		scrollTo: scrollTo,
		isOnline: isOnline,
		printMessage: printMessage,
		queryStringToObject: queryStringToObject,
		isLandscape: isLandscape,
		getAppCacheStatus: getAppCacheStatus,
		handleCacheEvents: handleCacheEvents
	};

	return pub;


} (jQuery));