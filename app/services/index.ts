'use strict';

import angular = require('angular');

var app = angular.module('bradley.birth');

app.config(/*@ngInject*/ function($mdThemingProvider: angular.material.IThemingProvider, $mdIconProvider: angular.material.IIconProvider) {
	$mdIconProvider
		.defaultIconSet("./assets/svg/avatars.svg", 128)
		.icon("menu"       , "./assets/svg/menu.svg"        , 24)
		.icon("share"      , "./assets/svg/share.svg"       , 24)
		.icon("google_plus", "./assets/svg/google_plus.svg" , 512)
		.icon("hangouts"   , "./assets/svg/hangouts.svg"    , 512)
		.icon("twitter"    , "./assets/svg/twitter.svg"     , 512)
		.icon("phone"      , "./assets/svg/phone.svg"       , 512)
		.icon('arrow', 'assets/svg/arrow.svg', 24);

		$mdThemingProvider.theme('default')
			.primaryPalette('indigo')
			.accentPalette('blue-grey');

});

import US = require('./UserService');
app.service('userService', US.UserServiceFactory);

import Bradley = require('./Bradley');
app.service('Bradley', Bradley.BradleyServiceFactory);

app.filter('nospace', function () {
  return function (value: string): string {
    return (!value) ? '' : value.replace(/ /g, '');
  };
});
