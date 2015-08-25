'use strict';

import angular = require('angular');

var app = angular.module('bradley.birth');

app.config(/*@ngInject*/ function($mdThemingProvider: angular.material.IThemingProvider) {
		$mdThemingProvider.theme('default')
			.primaryPalette('indigo')
			.accentPalette('blue-grey');
});

import Bradley = require('./Bradley');
app.service('Bradley', Bradley.BradleyServiceFactory);

app.filter('nospace', function () {
  return function (value: string): string {
    return (!value) ? '' : value.replace(/ /g, '');
  };
});
