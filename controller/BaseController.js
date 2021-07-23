sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/routing/History",
		"sap/ui/core/UIComponent"
	],
	function (Controller, History, UIComponent) {
		"use strict";

		return Controller.extend("de.mindsquare.zph_Thesis.controller.BaseController", {
			getRouter: function () {
				return UIComponent.getRouterFor(this);
			},

			onNavBack: function () {
				var oHistory, sPreviousHash;

				oHistory = History.getInstance();
				sPreviousHash = oHistory.getPreviousHash();

				//	console.log(sPreviousHash);

				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					this.getRouter().navTo("home", true);
				}
			}

		});
	}
);