/*global QUnit*/

sap.ui.define([
	"pruebasistem/controller/pruebaconsistem.controller"
], function (Controller) {
	"use strict";

	QUnit.module("pruebaconsistem Controller");

	QUnit.test("I should test the pruebaconsistem controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
