/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"de/mindsquare/zph_Thesis/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});