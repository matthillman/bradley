/// <reference path="../../typings/tsd.d.ts" />

'use strict';

import angular = require('angular');

export let DirectiveFactory = {
	toggleMenu: ToggleMenuFactory,
	menuLink: MenuLinkFactory
};

interface ToggleScope extends angular.IScope {
	section: MenuSection;
	isOpen(): boolean;
	toggle(): void;
}

interface LinkScope extends angular.IScope {
	section: MenuPage;

	isSelected(): boolean;
}

export interface MenuSection extends MenuPage {
	children?: MenuSection[];
	type: MenuSectionType;
	pages?: MenuPage[];
}

export class MenuSectionType {
	constructor(public value: string) { }

    toString(): string {
        return this.value;
    }

	static Toggle = new MenuSectionType('toggle');
	static Link = new MenuSectionType('link');
}

export interface MenuPage {
	name: string;
	url?: string;
	key?: string;
}

/**
 * @ngInject
 */
function ToggleMenuFactory($timeout: angular.ITimeoutService) {
	return {
		restrict: 'E',
		scope: {
			section: '='
		},
		templateUrl: 'views/partials/menu-toggle.tmpl.html',
		link: /*@ngInject*/function($scope: ToggleScope, $element: angular.IAugmentedJQuery) {
			var controller = $element.parent().controller();
			var $ul = $element.find('md-list');
			var padding = $ul.css('padding');

			$scope.isOpen = function() {
				return controller.isOpen($scope.section);
			};
			$scope.toggle = function() {
				controller.toggleOpen($scope.section);
			};

			$scope.$watch(
				function() {
					return controller.isOpen($scope.section);
				},
				function(open) {
					var targetHeight = open ? getTargetHeight() : 0;
					var targetPadding = open ? padding : '0px';
					$timeout(function() {
						$ul.css({
							height: targetHeight + 'px',
							padding: targetPadding
						});
					}, 0, false);

					function getTargetHeight(): number {
						var targetHeight: number;
						$ul.addClass('no-transition');
						$ul.css('height', '');
						targetHeight = $ul.prop('clientHeight');
						$ul.css('height', 0);
						$ul.removeClass('no-transition');
						return targetHeight;
					}
				}
			);
		}
	}
}

/**
 * @ngInject
 */
function MenuLinkFactory() {
	return {
		scope: {
			section: '='
		},
		templateUrl: 'views/partials/menu-link.tmpl.html',
		link: function($scope: LinkScope, $element: angular.IAugmentedJQuery) {
			var controller = $element.parent().controller();

			$scope.isSelected = function() {
				return controller.isSelected($scope.section);
			}
		}
	}
}