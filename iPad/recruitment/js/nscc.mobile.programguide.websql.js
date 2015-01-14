var MobileProgramGuide = MobileProgramGuide || {};

MobileProgramGuide.webSql = (function ($)
{
	"use strict";

	var webDb
		;

	var openDb = function()
	{
		var dbSize = 5 * 1024 * 1024; // 5mb
		webDb = openDatabase("MobileProgramGuide", "1.0", "NSCC Mobile Program Guide", dbSize);

		createTable();
	};

	var createTable = function()
	{ 	
  		webDb.transaction(function(tx) 
  		{
			tx.executeSql("CREATE TABLE IF NOT EXISTS programdata(ID INTEGER PRIMARY KEY ASC, json TEXT, updated_on DATETIME)", []);
  		});
	};

	var insertProgramData = function(programData, successFunction, errorFunction)
	{
		if(errorFunction === null) { errorFunction = onDbError; }

		webDb.transaction(function(tx)
		{
    		var updatedOn = new Date();
    		tx.executeSql("INSERT INTO programdata(id, json, updated_on) VALUES (1, ?,?)",
        	[programData, updatedOn],
        	successFunction,
        	errorFunction);
   		});
	};

	var updateProgramData = function(programData, successFunction, errorFunction)
	{
		if(errorFunction === null) { errorFunction = onDbError; }		

		webDb.transaction(function(tx)
		{
    		var updatedOn = new Date();
    		tx.executeSql("UPDATE programdata SET json = ?, updated_on = ? WHERE id = 1",
        	[programData, updatedOn],
        	successFunction,
        	errorFunction);
   		});
	};

	var getProgramData = function(successFunction, errorFunction)
	{
		if(errorFunction === null) { errorFunction = onDbError; }

		webDb.transaction(function(tx) 
		{
			tx.executeSql("SELECT json FROM programdata WHERE id = 1", [], successFunction, errorFunction);
  		});
	};

	var onDbError = function(tx, err) 
	{
  		console.log("There has been an websql error: " + err.message);
  		return true;
	};


	// Public method exposure
	var pub =
	{
		openDb: openDb,
		insertProgramData: insertProgramData,
		updateProgramData: updateProgramData,
		getProgramData: getProgramData
	};

	return pub;

} (jQuery));