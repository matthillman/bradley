'use strict';

import angular = require('angular');
require('angular-material')
import US = require('../services/UserService');

import UserService = US.UserService;
import User = US.User

// @ngInject
export function UserController($scope: UserScope, userService: UserService, $mdSidenav: angular.material.ISidenavService, $mdBottomSheet: angular.material.IBottomSheetService, $log: angular.ILogService, $q: angular.IQService) {
    $scope.selected     = null;
    $scope.users = [ ];
    $scope.selectUser  = selectUser;
    $scope.toggleList   = toggleUsersList;
    $scope.showContactOptions  = showContactOptions;

    $scope.isSidenavOpen = function() {
      return $mdSidenav('left').isOpen();
    };
    // Load all registered users

    userService
          .loadAllUsers()
          .then( function( users: User[] ) {
            $scope.users    = [].concat(users);
            $scope.selected = users[0];
          });

    // *********************************
    // Internal methods
    // *********************************

    /**
     * First hide the bottomsheet IF visible, then
     * hide or Show the 'left' sideNav area
     */
    function toggleUsersList() {
      var pending = bottomSheetPromise || $q.when(true);

      pending.then(function() {
        $mdSidenav('left').toggle();
      });

      $mdBottomSheet.hide();
    }

    /**
     * Select the current avatars
     * @param menuId
     */
    function selectUser ( user: User ) {
      $scope.selected = user;
      $scope.toggleList();
    }

    var bottomSheetPromise: angular.IPromise<any>;
    /**
     * Show the bottom sheet
     */
    function showContactOptions($event: MouseEvent): angular.IPromise<any> {
        var user: User = $scope.selected;

        bottomSheetPromise = $mdBottomSheet.show({
          parent: angular.element(document.getElementById('content')),
          templateUrl: 'views/partials/contactSheet.html',
          controller: ContactPanelController,
          controllerAs: "cp",
          bindToController : true,
          targetEvent: $event
        }).then(function(clickedItem: BottomSheetAction) {
          clickedItem && $log.debug( clickedItem.name + ' clicked!');
        });

        return bottomSheetPromise;

        /**
         *  Bottom Sheet controller for the Avatar Actions
         *
         *  @ngInject
         */
        function ContactPanelController( $mdBottomSheet: angular.material.IBottomSheetService ) {
          this.user = user;
          this.actions = [
            { name: 'Phone'       , icon: 'phone'       , icon_url: 'assets/svg/phone.svg'},
            { name: 'Twitter'     , icon: 'twitter'     , icon_url: 'assets/svg/twitter.svg'},
            { name: 'Google+'     , icon: 'google_plus' , icon_url: 'assets/svg/google_plus.svg'},
            { name: 'Hangout'     , icon: 'hangouts'    , icon_url: 'assets/svg/hangouts.svg'}
          ];
          this.submitContact = function(action: BottomSheetAction) {
            $mdBottomSheet.hide(action);
          };
        }
    }
}

interface BottomSheetAction {
    name: string;
    icon: string;
    icon_url: string;
}

export interface UserScope extends angular.IScope {
    selected: User;
    users: User[];
    selectUser(user: User): void;
    toggleList(): void;
    showContactOptions($event: MouseEvent): angular.IPromise<any>;
    isSidenavOpen(): boolean
}
