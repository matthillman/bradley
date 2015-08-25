/// <reference path="../../typings/tsd.d.ts" />
'use strict';

import angular = require('angular');
require('angular-route');

var app = angular.module('bradley.birth');

import BS = require('../services/Bradley')

// app.config(/*@ngInject*/function($locationProvider: angular.ILocationProvider) {
// 	$locationProvider.html5Mode(true);
// });

app.config(/*@ngInject*/function($routeProvider: angular.route.IRouteProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'views/main.tmpl.html'
	})
	.when('/stage/:stage', {
		templateUrl: 'views/stage.tmpl.html'
	})
	.when('/progression/:progression', {
		templateUrl: 'views/progression.tmpl.html'
	});
});