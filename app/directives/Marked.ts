/// <reference path="../../typings/tsd.d.ts" />
'use strict';

import angular = require('angular');
import marked = require('marked');

export let DirectiveFactory = {
	marked: MarkedFactory
};

interface MarkedScope extends angular.IScope {
	marked: string;
}

// @ngInject
function MarkedFactory($log: angular.ILogService) {
	return {
		restrict: 'A',
		scope: {
			marked: '='
		},
		link: function($scope: MarkedScope, $element: angular.IAugmentedJQuery) {
			$scope.$watch('marked', function(newVal: string, oldVal: string) {
				if (newVal !== oldVal) {
					$element.html(marked(newVal || ''));
				}
			});
		}
	}
}