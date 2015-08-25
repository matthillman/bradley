/// <reference path="../../typings/tsd.d.ts" />
'use strict';

import angular = require('angular');

import Menu = require('../directives/Menu');
import MenuSection = Menu.MenuSection;
import MenuPage = Menu.MenuPage;

export interface BradleyService {
	getStages(): angular.IPromise<Stage>;
}

export interface Stage {
	stages: { [key: string]: BirthStage };
	selectSection(section: MenuSection): void;
	toggleSelectSection(section: MenuSection): void;
	isSectionSelected(section: MenuSection): boolean;
	selectPage(section: MenuSection, page: MenuPage): void;
	isPageSelected(page:  MenuPage): boolean;
}

export interface BirthStage {
	order: number;
	url: string;
	name: string;
	emotionalSigns: string;
	behavior: string;
	physicalSigns: string;
	contractions: string;
	sensations: string;
	needs: string;
	reminders: string;
}

interface HttpErrorResponseData {
	message?: string;
}

// @ngInject
export function BradleyServiceFactory($http: angular.IHttpService, $q: angular.IQService): BradleyService {
	var stages: { [key: string]: BirthStage } = {};
	var openSection: MenuSection;
	var currentPage:  MenuPage;
	var currentSection: MenuSection;

	return {
		getStages: loadBirthStages
	};

	function loadBirthStages(): angular.IPromise<Stage> {
		return $http.get('assets/bradley.json').then(onSuccess).catch(onError);
	}

	function onSuccess(response: angular.IHttpPromiseCallbackArg<BirthStage[]>): Stage {
		response.data.forEach(function(stage) {
			stages[stage.url] = stage;
		});
		return {
			stages: stages,

			selectSection: function(section: MenuSection): void {
				openSection = section;
			},
			toggleSelectSection: function(section: MenuSection): void {
				openSection = (openSection === section ? null : section);
			},
			isSectionSelected: function(section: MenuSection): boolean {
				return openSection === section;
			},

			selectPage: function(section: MenuSection, page:  MenuPage): void {
				currentSection = section;
				currentPage = page;
			},
			isPageSelected: function(page:  MenuPage): boolean {
				return currentPage === page;
			}
		};
	}

	function onError(response: angular.IHttpPromiseCallbackArg<HttpErrorResponseData>): angular.IPromise<any> {
		if (!angular.isObject(response.data) || !response.data.message) {
			return $q.reject("An unknown error occured.");
		}
		return $q.reject(response.data.message);
	}
}
