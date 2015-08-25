/// <reference path="../../typings/tsd.d.ts" />
'use strict';

import angular = require('angular');
require('angular-material')
require('angular-route')
import US = require('../services/UserService');
import UserService = US.UserService;
import User = US.User
import BS = require('../services/Bradley');
import BradleyService = BS.BradleyService;
import BirthStage = BS.BirthStage;

import Menu = require('../directives/Menu');

interface MainRouteParams extends angular.route.IRouteParamsService {
    stage?: string;
    progression?: string;
}

// @ngInject
export function BradleyController(
    $scope: MainScope,
    $mdSidenav: angular.material.ISidenavService,
    Bradley: BradleyService,
    $location: angular.ILocationService,
    $rootScope: angular.IRootScopeService,
    $timeout: angular.ITimeoutService,
    $routeParams: MainRouteParams,
    $log: angular.ILogService
    ) {
    $scope.isSidenavOpen = function() {
        return $mdSidenav('left').isOpen();
    };

    $scope.menu = [{
        name: "Introduction",
        type: Menu.MenuSectionType.Link,
        url: '/'
    }];

    $scope.sections = [
        { name: "Emotional Signs", key: "emotionalSigns" },
        { name: "Behavior", key: "behavior" },
        { name: "Physical Signs", key: "physicalSigns" },
        { name: "Contractions", key: "contractions" },
        { name: "Sensations", key: "sensations" },
        { name: "Needs", key: "needs" },
        { name: "Reminders", key: "reminders" }
    ]

    Bradley.getStages().then(function(Stage) {
        var stagesSection: Menu.MenuSection = {
            name: "Stages",
            pages: [],
            type: Menu.MenuSectionType.Toggle
        };

        for (var key in Stage.stages) {
            stagesSection.pages.push({
                name: Stage.stages[key].name,
                url: '/stage/' + Stage.stages[key].url,
                key: key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
            });
        }

        $scope.menu.push(stagesSection);

        $scope.menu.push({
            name: "Progressions",
            pages: $scope.sections.map(function(section) {
                var hyphenedKey = section.key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
                return {
                    name: section.name,
                    url: '/progression/' + hyphenedKey,
                    key: section.key
                }
            }),
            type: Menu.MenuSectionType.Toggle
        });

        $scope.stage = Stage;
        onLocationChange();
    });

    $scope.toggleList = function($event: MouseEvent) {
        $mdSidenav('left').toggle();
        angular.element($event.target).blur();
    };

    $rootScope.$on('$routeChangeSuccess', onLocationChange);

    function onLocationChange() {
        if (!$scope.stage) {
            $log.debug('location changed before stage is loaded')
            return;
        }

        var path = $location.path();

        $mdSidenav('left').close();

        if (path == '/') {
            $timeout(function() {
                $scope.selected = {
                    name: "Introduction"
                };
            });
            return;
        }

        var matchPage = function(section: Menu.MenuSection, page: Menu.MenuPage) {
            if (page.url && path === page.url) {
                $timeout(function() {
                    $scope.stage.selectSection(section);
                    $scope.stage.selectPage(section, page);
                    console.log($routeParams);
                    if ("stage" in $routeParams) {
                        console.log(page);
                        $scope.selected = $scope.stage.stages[page.key];
                    } else {
                        console.log('sections ' + page.key);
                        $scope.selected = $scope.sections.filter(function(section) {
                            return section.key === page.key;
                        })[0];
                    }
                    $mdSidenav('left').close();
                });
            }
        };

        $scope.menu.forEach(function(section) {
            if (section.children) {
                // matches nested section toggles, such as API or Customization
                section.children.forEach(function(childSection) {
                    if (childSection.pages) {
                        childSection.pages.forEach(function(page) {
                            matchPage(childSection, page);
                        });
                    }
                });
            }
            else if (section.pages) {
                // matches top-level section toggles, such as Demos
                section.pages.forEach(function(page) {
                    matchPage(section, page);
                });
            }
            else if (section.type === Menu.MenuSectionType.Link) {
                // matches top-level links, such as "Getting Started"
                matchPage(section, section);
            }
        });
    }

    this.isOpen = isOpen;
    this.isSelected = isSelected;
    this.toggleOpen = toggleOpen;

    function isSelected(page: Menu.MenuPage) {
        return $scope.stage.isPageSelected(page);
    }

    function isOpen(section: Menu.MenuSection) {
        return $scope.stage.isSectionSelected(section);
    }

    function toggleOpen(section: Menu.MenuSection) {
        $scope.stage.toggleSelectSection(section);
    }
}

interface Section {
    name: string;
    key: string;
}

interface Selectable {
    name: string;
}

export interface MainScope extends angular.IScope {
    isSidenavOpen(): boolean;
    selected: Selectable;
    menu: Menu.MenuSection[];
    stage: BS.Stage;
    sections: Section[];

    toggleList($event: MouseEvent): void;
}

