/// <reference path="../../typings/tsd.d.ts" />
'use strict';

import angular = require('angular');

export interface BradleyService {
	getBirthProgression(): angular.IPromise<BirthStage[]>
}

export interface BirthStage {
	order: number;
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
export function BradleyServiceFactory($http: angular.IHttpService, $q: angular.IQService) {
	return {
		getBirthProgression: loadBirthStages
	};

	function loadBirthStages(): angular.IPromise<BirthStage[]> {
		return $http.get('assets/bradley.json').then(onSuccess).catch(onError);
	}

	function onSuccess(response: angular.IHttpPromiseCallbackArg<BirthStage[]>): BirthStage[] {
		return response.data;
	}

	function onError(response: angular.IHttpPromiseCallbackArg<HttpErrorResponseData>): angular.IPromise<any> {
		if (!angular.isObject(response.data) || !response.data.message) {
			return $q.reject("An unknown error occured.");
		}
		return $q.reject(response.data.message);
	}
}