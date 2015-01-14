MobileProgramGuide.controller = (function($, dataContext, util, document)
{
		"use strict";

		var
				splashPageTransitionTime = 2500, // Milliseconds
				searchPanelAnimationSpeed = 200, // Milliseconds
				defaultTransitionType = "none",
				splashToLandingTransition = "flip",
				detailSwipingTransition = "slide",
				imageAccentPath = "/iPad/recruitment/img/accents/",
				splashPageId = "splashPage",
				splashPageSel = "#splashPage",
				landingToDetailTransition = "slide",
				landingPageId = "landingPage",
				landingPageSel = "#landingPage",
				landingPageContentSel = "#progList",
				detailFieldsSel = ".detailItem",
				detailImageThumbs = "#detailImageThumbs",
				detailToLandingTransition = "none",
				detailPageId = "programDetails",
				detailPageSel = "#programDetails",
				detailPageVideoLink = "#detailVideoLink",
				detailPopupContainerSel = "#detailVideoPopup",
				detailPopupContentSel = "#popupContent",
				detailPopupRelatedSel = "#popupContentRelated",
				backToLandingButtonSel = ".btnBackToLanding",
				searchPanelOpenLinkSel = "#hlSearch",
				searchPanelCloseLinkSel = "#hlCloseSearch",
				searchPanelSel = "#popupPanel",
				searchPanelArrowSel = "#popupSearchArrow",
				searchPanelSchoolSearchSel = "#hlSchoolSearch",
				searchPanelLocationSearchSel = "#hlLocationSearch",
				searchPanelBackLinkSel = "#hlSearchGoBack",
				searchPanelTextSearch = "#tbTextSearch",
				searchPanelHeightDefault = "209px",
				searchPanelHeightSchool = "285px",
				searchPanelHeightLocation = "595px",
				searchPanelRootPanel = "#subPanelMain",
				searchPanelSchoolSubpanelSel = "#subPanelSchoolSearch",
				searchPanelLocationSubpanelSel = "#subPanelLocationSearch",

				searchResultsPageId = "searchResults",
				searchResultsPageSel = "#searchResults",
				searchResultsContainerSel = "#searchResultsContainer",
				searchResultsCountSel = "#searchResultsCount",
				searchResultsQuerySel = "#searchResultsQuery"
			;

		//===================================================================
		// Private methods
		//===================================================================

		var splashToLandingPage = function()
		{
			util.gotoPage("#" + landingPageId, splashToLandingTransition, false, false, false);
		};

		var hideSearchBox = function()
		{
			$(searchPanelSel).hide();
			$(searchPanelArrowSel).hide();
		};

		var toggleSearchBox = function()
		{
			$(searchPanelSel).toggle();
			$(searchPanelArrowSel).toggle();
		};

		var doTextSearch = function(event)
		{
			if(event.which === 13) // Enter key
			{
				var href = searchResultsPageSel + "?type=N&query=" + $(searchPanelTextSearch).val();
				util.gotoPage(href, defaultTransitionType, false, true, true);
			}
		};

		var showSearchPanel = function()
		{
			var currentAnimOpt = {}
			var nextAnimOpt = {}
			var targetDiv = null;
			var nextDiv = null;
			var departingDivLockPos = "";
			var newContainerHeight = searchPanelHeightDefault;

			// Back button is an exception as it exists outside of the rest of the slide menus
			if(this.id == searchPanelBackLinkSel.replace("#", ""))
			{
				if($(searchPanelSchoolSubpanelSel).css("left").indexOf("0") == 0) // Startswith '0', Safari uses '0%' rather then '0px' so this accomodates both
				{
					targetDiv = searchPanelSchoolSubpanelSel;
				}
				else if($(searchPanelLocationSubpanelSel).css("left").indexOf("0") == 0) // Startswith '0', Safari uses '0%' rather then '0px' so this accomodates both
				{
					targetDiv = searchPanelLocationSubpanelSel;
				}

				nextDiv = $(targetDiv).siblings("div " + searchPanelRootPanel);

				currentAnimOpt = { left: "+100%" };
				nextAnimOpt = { left: "0%" };

				departingDivLockPos = "100%"; // Lock the div thats leaving to offscreen right
			}
			else
			{
				targetDiv = $(this).closest("div"); //$(this).parent();

				departingDivLockPos = "-100%"; // Lock the div thats leaving to offscreen left

				if(this.id == searchPanelSchoolSearchSel.replace("#", ""))
				{
					newContainerHeight = searchPanelHeightSchool;
					currentAnimOpt = { left: "-50%" };
					nextAnimOpt = { left: "0%" };
					nextDiv = $(searchPanelSchoolSubpanelSel); //$(targetDiv).nextAll("#subPanelSchoolSearch");
				}
				else if(this.id == searchPanelLocationSearchSel.replace("#", ""))
				{
					newContainerHeight = searchPanelHeightLocation;
					currentAnimOpt = { left: "-50%" };
					nextAnimOpt = { left: "0%" };
					nextDiv = $(searchPanelLocationSubpanelSel); //$(targetDiv).nextAll("#subPanelLocationSearch");
				}
			}

			// Now animate the currently visible diff
    	$(targetDiv).animate(currentAnimOpt, searchPanelAnimationSpeed, function()
    	{
        $(targetDiv).css("left", departingDivLockPos);
        $(targetDiv).appendTo(searchPanelSel);
    	});

    	// and the incoming one
    	$(nextDiv).animate(nextAnimOpt, searchPanelAnimationSpeed);

			// Resize search container to accomodate whichever content panel we're displaying
			$(searchPanelSel).css("height", newContainerHeight);

    	// Toggle 'Back' button (only shows if we're one level deep)
			$(searchPanelBackLinkSel).toggle();
		}

		var renderSearchResults = function(searchType, searchQuery)
		{
			util.printMessage("Showing search, type: " + searchType + ", query: " + searchQuery, "debug");

			// Store search query in data object on result page as we need it for prev/next functionality
			$(searchResultsPageSel).jqmData("searchType", searchType);
			$(searchResultsPageSel).jqmData("searchQuery", searchQuery);

			var results = new Array();
			var searchQueryMsg = "";
			switch(searchType)
			{
				case "L": // Location search
					results = dataContext.getProgramsByLocation(searchQuery);
					if(dataContext.getLocationById(searchQuery) != null) { searchQueryMsg = (dataContext.getLocationById(searchQuery)).Name; }
					break;

				case "N": // Name search
					results = dataContext.getProgramsByName(searchQuery);
					searchQueryMsg = searchQuery;
					break;

				case "S": // School Search
					results = dataContext.getProgramsBySchool(searchQuery);
					if(dataContext.getSchoolById(searchQuery) != null) { searchQueryMsg = (dataContext.getSchoolById(searchQuery)).Name; }
					break;
			}
			$(searchResultsQuerySel).html(searchQueryMsg);
			$(searchResultsCountSel).html(results.length);

			$(searchResultsContainerSel + " tbody").empty();
			for(var i = 0; i < results.length; i++)
			{
				var row = renderSearchResultRow(results[i]);
				$(searchResultsContainerSel + " tbody").append(renderSearchResultRow(results[i]));
			}
		};

		var renderSearchResultRow = function(obj)
		{
			var href = "#" + detailPageId + "?progid=" + obj.AcadProg + "&planid=" + obj.AcadPlan;
			return $("<tr></tr>").jqmData("trlink", href)
													 .attr("valign", "top")
													 .append("<td><span class='"+ obj.AcadGroup +"'>" + obj.AcadPlanDescr + "</span></td><td>" + obj.Duration + "</td><td>" + obj.Credential + "</td><td>&nbsp;</td>");
		};


		var renderProgramDetail = function(progId, planId)
		{
			var sortType = "A"; // Default to standard (all) sort type
			var sortQuery = "";
						
			if($(searchResultsPageSel).jqmData("searchType") != null
					&& $(searchResultsPageSel).jqmData("searchQuery") != null)
			{
				util.printMessage("Directed here via search, type: " + $(searchResultsPageSel).jqmData("searchType") + ", query: " + $(searchResultsPageSel).jqmData("searchQuery"), "debug");
				sortType = $(searchResultsPageSel).jqmData("searchType");
				sortQuery = $(searchResultsPageSel).jqmData("searchQuery");
			}

			util.printMessage("Show details for progid: " + progId + ", planid: " + planId, "debug");
			var prog = dataContext.getProgramById(progId, planId, sortType, sortQuery);

			$(detailPageSel).jqmData("prevProg", prog.PreviousProg);
			$(detailPageSel).jqmData("nextProg", prog.NextProg);

			$("#detailHeaderImage").attr("src", imageAccentPath + prog.AcadPlan + "_4.jpg");
			$("#detailDuration").html(prog.Duration);
			$("#detailCredential").html(prog.Credential);
			$("#detailStartDate").html(prog.StartDate);
			$("#detailPlanType").html(prog.AcadPlanType);
			$("#detailLongDesc").html(prog.PlanDescrLong);
			$("#detailProgId").html(prog.AcadProg);
			$("#detailPlanId").html(prog.AcadPlan);
			$("#detailGroup").html(prog.AcadGroup);
			$("#detailDesc").html(prog.AcadPlanDescr);
			$("#detailHighlight1").html(prog.HighLightOne);
			$("#detailHighlight2").html(prog.HighLightTwo);
			$("#detailHighlight3").html(prog.HighLightThree);
			$("#detailTagline").html(util.encodeString(prog.TagLine));
			$("#detailTuition").html(prog.Tuition);
			$("#detailAdmissionRequirements").html(prog.AdmissionRequirements);

			// Thumbnail handling
			if(prog.HasPhotos)
			{
				var thumbs = "<li><a href='" + imageAccentPath + prog.AcadPlan + "_1.jpg' class='lightbox'><img src='" + imageAccentPath + prog.AcadPlan + "_1.jpg'/></a></li>"
										 + "<li><a href='" + imageAccentPath + prog.AcadPlan + "_2.jpg' class='lightbox'><img src='" + imageAccentPath + prog.AcadPlan + "_2.jpg'/></a></li>"
										 + "<li><a href='" + imageAccentPath + prog.AcadPlan + "_3.jpg' class='lightbox'><img src='" + imageAccentPath + prog.AcadPlan + "_3.jpg'/></a></li>";
				$(detailImageThumbs).html(thumbs);
			}
			else
			{
				$(detailImageThumbs).empty();
			}

			// Program school and web link
			var ProgSchool = "<h1>" + prog.AcadPlanDescr + "<span class='" + prog.AcadGroup + "'></span>"
										+ "<a href='http://www.nscc.ca/learning_programs/programs/plandescr.aspx?prg=" + prog.AcadProg + "&pln=" + prog.AcadPlan + "' class='web' data-rel='external' target='_parent'></a></h1>";


			$("#detailProgSchool").html(ProgSchool);

			// Map Link
			var ProgMapLink = "<img src='" + prog.MapLink + "' />";
			$("#detailMapLink").html(ProgMapLink);

			// '+' Popup handling
			if(prog.VideoLink !== "" || prog.RelatedPrograms !== null)
			{
				$(detailPopupContentSel + " h1").html(prog.AcadPlanDescr);

				if(prog.VideoLink !== "") { $(detailPopupContentSel + " iframe").attr("src", prog.VideoLink); $(detailPopupContentSel + " iframe").show(); }
				else { $(detailPopupContentSel + " iframe").attr("src", ""); $(detailPopupContentSel + " iframe").hide(); }

				$(detailPopupContentSel + " .related-progs").hide();				
				if(prog.RelatedPrograms !== null && prog.RelatedPrograms !== "")
				{
					$(detailPopupRelatedSel).empty();
					for(var i=0; i < prog.RelatedPrograms.length; i++)
					{
						var href = prog.RelatedPrograms[i].DetailsLink;
						//$(detailPopupRelatedSel).append($("<li></li>").jqmData("lilink", href).append(prog.RelatedPrograms[i].Name));
						//$(detailPopupRelatedSel).append($("<li></li>").attr("data-lnk", href).append(prog.RelatedPrograms[i].Name));
						//$(detailPopupRelatedSel).append($("<li></li>").append("<a href='" + href + "' data-transition='none'>" + prog.RelatedPrograms[i].Name + "</a>"));
						$(detailPopupRelatedSel).append($("<li></li>").append(prog.RelatedPrograms[i].Name));
					}
					$(detailPopupContentSel + " .related-progs").show();
				}

				$(detailPageVideoLink).show();
			}
			else { $(detailPageVideoLink).hide(); }

			// Locations
			var locationList = "";
			for(var x = 0; x < prog.Locations.length; x++)
			{
				locationList += "<li>" + prog.Locations[x].Name + "</li>";
			}
			$("#detailLocations").html(locationList);

		};

		var getNextProgramDetail = function(event)
		{
			util.printMessage($(detailPageSel).jqmData("prevProg"), "debug");
			util.printMessage($(detailPageSel).jqmData("nextProg"), "debug");

			var prog = null;
			var rev = false;
			var isIndexer = false;
			var progId = null;
			var planId = null;

			if(typeof $(detailPageSel).jqmData("nextProg") === "number"
					|| typeof $(detailPageSel).jqmData("prevProg") === "number") { isIndexer = true; }

			switch(event.type)
			{
				case "swipeleft":
					if(isIndexer && $(detailPageSel).jqmData("nextProg") != null)
					{
						prog = dataContext.getProgramByIndex($(detailPageSel).jqmData("nextProg"));
						progId = prog.AcadProg; planId = prog.AcadPlan;
					}
					else if($(detailPageSel).jqmData("nextProg") != null)
					{
						var pieces = $(detailPageSel).jqmData("nextProg").split("^");
						progId = pieces[0]; planId = pieces[1];
					}
					break;

				case "swiperight":
					if(isIndexer && $(detailPageSel).jqmData("prevProg") != null)
					{
						prog = dataContext.getProgramByIndex($(detailPageSel).jqmData("prevProg"));
						progId = prog.AcadProg; planId = prog.AcadPlan;
					}
					else if($(detailPageSel).jqmData("prevProg") != null)
					{
						var pieces = $(detailPageSel).jqmData("prevProg").split("^");
						progId = pieces[0]; planId = pieces[1];
					}
					rev = true;
					break;
			}

			if(progId != null && planId != null)
			{
				var href = "#" + detailPageId + "?progid=" + progId + "&planid=" + planId;
				util.printMessage("going to: " + href, "debug");
				util.gotoPage(href, detailSwipingTransition, rev, true, true)
			}
			else
			{
				util.printMessage("going nowhere, at beginning or end", "debug");
			}
		};

		//===================================================================
		// Event methods (public)
		//===================================================================

		var onSplashPageShow = function(eventType, matchObj, ui, page, evt)
		{
			hideSearchBox();
			setTimeout(splashToLandingPage, splashPageTransitionTime);
		};

		var onLandingPageInit = function(eventType, matchObj, ui, page, evt)
		{
			$("#updateData").bind("click", function(e)
			{
				$.gritter.add({ title: "Data Update", text: "Updating data from web, you will be notified when it completes.", image: "/iPad/recruitment/img/designelements/btn-refresh.png"});				
				dataContext.getProgramDataFromWs();
				e.preventDefault();
			})
		};

		var onLandingPageBeforeShow = function(eventType, matchObj, ui, page, evt)
		{
			hideSearchBox();			
			
			// Reset sort type to 'A' (all)
			$(searchResultsPageSel).jqmData("searchType", null);
			$(searchResultsPageSel).jqmData("searchQuery", null);
		};

		var onDetailPageInit = function(eventType, matchObj, ui, page, evt)
		{
			$(detailPageSel).bind("swipeleft", getNextProgramDetail);
			$(detailPageSel).bind("swiperight", getNextProgramDetail);

			$(detailImageThumbs + " li a").live("click", function(e)
			{
				$.fancybox.open({href: $(this).attr("href"), title: ""});
				e.preventDefault();
				e.stopPropagation();
			});

			$(detailPageVideoLink).bind("click", function(e)
			{
				$.fancybox.open({href: detailPopupContainerSel, title: "", afterLoad: function()
				{
					this.inner.prepend($(detailPopupContentSel).html());
				}});

				//e.preventDefault();
				e.stopPropagation();
			});

			util.printMessage("onDetailPageInit fired, event: " + eventType, "debug");
		};

		var onDetailPageBeforeShow = function(eventType, matchObj, ui, page, evt)
		{
			util.printMessage("onDetailPageBeforeShow fired, event: " + eventType, "debug");

			hideSearchBox();

			var progId = matchObj[1];
			var planId = matchObj[2];

			renderProgramDetail(progId, planId);
		};

		var onDetailPageBeforeHide = function(eventType, matchObj, ui, page, evt)
		{
			util.printMessage("onDetailPageBeforeHide fired, event: " + eventType, "debug");
			$("#detailHeaderImage").attr("src", imageAccentPath + "placeholder.jpg");			
			$.fancybox.close();
		};

		var onDetailPageShow = function(eventType, matchObj, ui, page, evt)
		{
			// Hack / Workaround for issue #4078 (https://github.com/jquery/jquery-mobile/issues/4078)
			// 'Page receives display:none after samePageTransition' (for 'slide' type transition only)
			// jsFiddle demonstrating the issue: http://jsfiddle.net/MauriceG/2vz4G/
			// Further discussion: http://forum.jquery.com/topic/changepage-allowsamepagetransition-true-displays-blank-page
			//if(!$(this).hasClass("ui-btn-active")) { $(this).addClass("ui-page-active");}
			 //$(this).addClass("ui-page-active");
		};

		var onSearchResultsInit = function(eventType, matchObj, ui, page, evt)
		{
			util.printMessage("onSearchResultsInit fired, event: " + eventType);
			// Make whole rows clickable and fire the href inside

			$(searchResultsContainerSel + " tbody tr").live("tap", function(e)			
			{
				var href = $(this).jqmData("trlink"); //$("td > a", this);
				util.gotoPage(href, defaultTransitionType, false, true, false);
				e.stopPropagation(); 
				e.preventDefault();
			});
		};

		var onSearchResultsBeforeShow	= function(eventType, matchObj, ui, page, evt)
		{
			util.printMessage("onSearchResultsBeforeShow fired, event: " + eventType, "debug");

			var searchType = matchObj[1];
			var searchQuery = matchObj[2];

			renderSearchResults(searchType, searchQuery);

			hideSearchBox();
		};

		var onProgramsAtoZPageInit = function(eventType, matchObj, ui, page, evt)
		{			
			$(".az-group li").live("click", function(e)
			{
				var yCoord = 0;
				var href = $(this).children();

				href.css({"background-color": "#4a4a4a", "color": "#fff"});
				$(this).siblings().children().css({"background-color": "#bebebe", "color": "#0d4c82"});

console.log(href.attr("href"));

				switch(href.attr("href"))
				{
					case "#abc":
						if(util.isLandscape()) { yCoord = 0; } else { yCoord = 0; }
						break;
					case "#def":
						if(util.isLandscape()) { yCoord = 1756; } else { yCoord = 2632; }					
						break;
					case "#ghi":
						if(util.isLandscape()) { yCoord = 2632; } else { yCoord = 3946; }					
						break;
					case "#jkl":
						if(util.isLandscape()) { yCoord = 4676; } else { yCoord = 7158; }					
						break;
					case "#mno":
						if(util.isLandscape()) { yCoord = 4822; } else { yCoord = 7304; }					
						break;
					case "#pqr":
						if(util.isLandscape()) { yCoord = 5990; } else { yCoord = 8910; }					
						break;
					case "#stu":
						if(util.isLandscape()) { yCoord = 6866; } else { yCoord = 10224; }					
						break;
					case "#vwx":
						if(util.isLandscape()) { yCoord = 7458; } else { yCoord = 11109; }					
						break;
					case "#yz":
						if(util.isLandscape()) { yCoord = 7658; } else { yCoord = 14109; }					
						break;
				}

				$(".az-group").css("z-index", 5000);
				//util.scrollTo(yCoord);
				console.log("2222");
				$.event.special.scrollstart.enabled = false;
				window.scrollTo( 0, yCoord );
				$(".az-group").css("z-index", 5000);

			});
		};

		var onProgramsAtoZBeforeShow = function(eventType, matchObj, ui, page, evt)
		{
			util.printMessage("onProgramsAtoZBeforeShow fired, event: " + eventType, "debug");
			$(".az-group li a").css({"background-color": "#bebebe", "color": "#0d4c82"});
			hideSearchBox();
			
			// Reset sort type to 'A' (all)
			$(searchResultsPageSel).jqmData("searchType", null);
			$(searchResultsPageSel).jqmData("searchQuery", null);			
		};

		var onWebViewBeforeShow = function(eventType, matchObj, ui, page, evt)
		{

			util.printMessage("onWebViewBeforeShow fired, event: " + eventType, "debug");

			console.log("W:" + $(window).width() + ", H:" + $(window).height());

			var width = "100%"; //768;
			var height = 878;
			if(util.isLandscape()) { width = 1024; height = 622; }

			var progId = matchObj[1];
			var planId = matchObj[2];			
			var src = "http://www.nscc.ca/learning_programs/programs/PlanDescr.aspx?prg=" + progId + "&pln=" + planId;

			$("#webviewBack").attr("href", "#programDetails?progid=" + progId + "&planid=" + planId);
			$("#webviewIframe").attr({ "width": width, "height": height, "src": src});			
		};

		//===================================================================
		// Initializer
		//===================================================================

    var init = function()
    {
    	// Initialize datacontext
			dataContext.init();
			util.printMessage("Data Context inited", "info");

			var d = $(document);

			// Set these popup events here since the search popup is not bound to any one page init event (floats outside of 'pages')
			d.delegate(searchPanelOpenLinkSel + "," + searchPanelCloseLinkSel, "click", toggleSearchBox);
			d.delegate(searchPanelBackLinkSel, "click", showSearchPanel);
			d.delegate(searchPanelSchoolSearchSel + "," + searchPanelLocationSearchSel, "tap", showSearchPanel);
			d.delegate(searchPanelTextSearch, "keydown", doTextSearch);
			//d.delegate("#hlProgramsAtoZ, " +  searchPanelLocationSubpanelSel + " ul li, " + searchPanelSchoolSubpanelSel + " ul li", "tap", function(e)
			d.delegate(searchPanelLocationSubpanelSel + " ul li, " + searchPanelSchoolSubpanelSel + " ul li", "tap", function(e)
			{
				util.gotoPage(String($(this).jqmData("lnk")), defaultTransitionType, false, true, true)
			});


			util.printMessage("Controller inited", "info");
						
		};

		//===================================================================
		// Public method exposure
		//===================================================================
    var pub =
    {
        init: init,
        onSplashPageShow: onSplashPageShow,
        onLandingPageInit: onLandingPageInit,
        onLandingPageBeforeShow: onLandingPageBeforeShow,
        onDetailPageInit: onDetailPageInit,
        onDetailPageBeforeShow: onDetailPageBeforeShow,
        onDetailPageBeforeHide: onDetailPageBeforeHide,
        onDetailPageShow: onDetailPageShow,
        onSearchResultsInit: onSearchResultsInit,
        onSearchResultsBeforeShow: onSearchResultsBeforeShow,
        onProgramsAtoZPageInit: onProgramsAtoZPageInit,
        onProgramsAtoZBeforeShow: onProgramsAtoZBeforeShow,
        onWebViewBeforeShow: onWebViewBeforeShow
    };

    return pub;

} (jQuery, MobileProgramGuide.dataContext, MobileProgramGuide.utility, document));

