'use strict';

/**
 * @ngdoc overview
 * @name SC-app-festival
 * @description
 *
 * Provides the app with the ability to display festival content and features
 */
angular
  .module('SC-app-festival', []);;'use strict';

/**
 * @ngdoc controller
 * @name SC-app-festival.controller:FestivalNavCtrl
 * @controller
 *
 * @description
 * Defines the state and behaviour of the $scope for the festivalNavView state
 */
angular.module('SC-app-festival')
  .controller('FestivalNavCtrl', ["$scope", function ($scope) {

    $scope.$on('$stateChangeSuccess', function() {
      // Close mobile version of nav on location change
      $scope.navOpen = false;
    });

  }]);;'use strict';

angular
  .module('SC-app-festival').run(["$rootScope", "festivalFactory", "utilitiesFactory", function ($rootScope, festivalFactory, utilitiesFactory) {

  	/**
     * Method for getting one festival from the API
     */
    festivalFactory.getFestivalSingle(function(data) {
      // Validation
      // Location, event name and start date must be present for the event to display
      if (!data.field_date_start || !data.title) {
        $rootScope.$broadcast('event:pageNotFound');
      }

      // Success
      // Attach the festival data to the root scope
      $rootScope.festival = data;

      // Set the website title and description meta tag
      $rootScope.websiteTitle = $rootScope.festival.title + ' at Southbank Centre';
      $rootScope.websiteDescription = $rootScope.festival.field_description.value.replace(/(<([^>]+)>)/ig,'');

      // Set festivalDataLoaded to true and broadcast the festivalDataLoaded event
      $rootScope.festivalDataLoaded = true;
      $rootScope.$broadcast('event:festivalDataLoaded');

    }, utilitiesFactory.genericHTTPCallbackError);

    /**
     * Method for getting the menus for the festival from the API
     */
    festivalFactory.getNavigation(function(data) {

      // Failure
      // If there is no menu for this festival, show website error
      if (data.festivalNav.length > 0) {
        for (var i in data) {
          $rootScope[i] = data[i];
        }
        if (typeof $rootScope.festivalFooter !== 'undefined') {
          if (typeof $rootScope.festivalFooter.field_component !== 'undefined' && $rootScope.festivalFooter.field_component.length > 0) {
            $rootScope.festivalFooter.field_component.reverse();
          }
        }
      } else {
        // Broadcast the serverError event
        $rootScope.$broadcast('event:error');
      }

    }, utilitiesFactory.genericHTTPCallbackError);

    /**
     * Method for getting the ticket types from the API
     */
    festivalFactory.getTicketTypes(function(data) {

      angular.forEach(data.list, function(ticketType, i) {

        // Remove 'free ticketed' from list
        if (ticketType.name === 'Free ticketed') {
          data.list.splice(i, 1);
        }

      });

      // Add ticket types to root scope
      $rootScope.ticketTypes = data;

      // Set festivalDataLoaded to true and broadcast the festivalDataLoaded event
      $rootScope.ticketingDataLoaded = true;
      $rootScope.$broadcast('event:ticketingDataLoaded');

    }, utilitiesFactory.genericHTTPCallbackError);

  }]);;'use strict';

/**
 * @ngdoc service
 * @name SC-app-festival.factory:festivalFactory
 * @factory
 *
 * @description
 * Factory for loading festival data into the app
 */

angular.module('SC-app-festival')
  .factory('festivalFactory', ["$http", "$rootScope", "$window", "utilitiesFactory", "angularMomentConfig", "appConfig", function ($http, $rootScope, $window, utilitiesFactory, angularMomentConfig, appConfig) {

    return {

      /**
       * @ngdoc method
       * @methodOf SC-app-festival.factory:festivalFactory
       * @name SC-app-festival.factory:festivalFactory#getFestivalSingle
       * @returns {undefined} Undefined
       * @param {function} callbackSuccess The function to call when the HTTP request succeeds
       * @param {function} callbackError The function to call when the HTTP request fails
       *
       * @description
       * For getting data for the app's festival, using the festival ID stored in appConfig.festivalId
       */
      getFestivalSingle: function (callbackSuccess, callbackError) {

        if (appConfig.festivalAlias) {

          $http.get('/json/api/festival/' + appConfig.festivalAlias)

            .success(function(festival) {

              // Correct date format for start and end dates
              festival.field_date_start = utilitiesFactory.timestampSecondsToMS(festival.field_date_start);
              festival.field_date_end = utilitiesFactory.timestampSecondsToMS(festival.field_date_end);

              // Convert festival duration into array of days for use by events list filter
              var s = $window.moment(festival.field_date_start).tz(angularMomentConfig.timezone);
              var e = $window.moment(festival.field_date_end).tz(angularMomentConfig.timezone);
              var a = [];

              while (!s.isAfter(e)) {
                a.push({
                  'day' : $window.moment(s)
                });
                s = s.add(1, 'days');
              }

              festival.festivalDays = a;

              callbackSuccess(festival);


            })
            .error(callbackError);

          } else {

            console.error('No Festival has been defined for this app');
            $rootScope.$broadcast('event:error');

          }

      },

      /**
       * @ngdoc method
       * @methodOf SC-app-festival.factory:festivalFactory
       * @name SC-app-festival.factory:festivalFactory#getNavigation
       * @returns {undefined} Undefined
       * @param {function} callbackSuccess The function to call when the HTTP request succeeds
       * @param {function} callbackError The function to call when the HTTP request fails
       *
       * @description
       * For getting navigation data for the app's festival
       */
      getNavigation: function (callbackSuccess, callbackError) {

        if (appConfig.festivalId) {

          $http.get('/json/node.json?type=navigation&field_festival=' + appConfig.festivalId)
            .success(function(data) {

              if (data.list[0]) {
                var navigation = {
                  festivalNav: data.list[0].field_navigation_link,
                  festivalFooter: data.list[0].field_footer
                };

                callbackSuccess(navigation);

              } else {

                $rootScope.$broadcast('event:error');

              }

            })
            .error(callbackError);

          } else {

            console.error('No Festival has been defined for this app');
            $rootScope.$broadcast('event:error');

          }

      },

      /**
       * @ngdoc method
       * @methodOf SC-app-festival.factory:festivalFactory
       * @name SC-app-festival.factory:festivalFactory#getTicketTypes
       * @returns {undefined} Undefined
       * @param {function} callbackSuccess The function to call when the HTTP request succeeds
       * @param {function} callbackError The function to call when the HTTP request fails
       *
       * @description
       * For getting ticket type information
       */
      getTicketTypes: function(callbackSuccess, callbackError) {

        if (appConfig.festivalId) {

          $http.get('/json/taxonomy_term.json?vocabulary=' + appConfig.ticketingVocabularyId)
            .success(callbackSuccess)
            .error(callbackError);

        } else {

          console.error('No ticketing vocabulary has been defined for this app');
          $rootScope.$broadcast('event:error');

        }

      }

    };

  }]);