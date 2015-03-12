'use strict';

/**
 * @ngdoc controller
 * @name SC-app-festival.controller:FestivalNavCtrl
 * @controller
 *
 * @description
 * Defines the state and behaviour of the $scope for the festivalNavView state
 */
angular.module('SC-app-festival')
  .controller('FestivalNavCtrl', function ($scope) {

    $scope.$on('$stateChangeSuccess', function() {
      // Close mobile version of nav on location change
      $scope.navOpen = false;
    });

  });