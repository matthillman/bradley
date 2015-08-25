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
	selectPage(section: MenuSection, page: MenuPage): void;
	isSectionSelected(section: MenuSection): boolean;
	toggleSelectSection(section: MenuSection): void;
	selectSection(section: MenuSection): void;
	isPageSelected(page:  MenuPage): boolean;
	stages: { [key: string]: BirthStage };
}

export interface BirthStage {
	emotionalSigns: string;
	physicalSigns: string;
	contractions: string;
	sensations: string;
	reminders: string;
	behavior: string;
	order: number;
	needs: string;
	name: string;
	url: string;
}

interface HttpErrorResponseData {
	message?: string;
}

// @ngInject
export function BradleyServiceFactory($http: angular.IHttpService, $q: angular.IQService): BradleyService {
	var stages: { [key: string]: BirthStage } = {};
	var currentSection: MenuSection;
	var openSection: MenuSection;
	var currentPage:  MenuPage;

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
