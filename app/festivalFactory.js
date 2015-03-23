'use strict';

/**
 * @ngdoc service
 * @name SC-app-festival.factory:festivalFactory
 * @factory
 *
 * @description
 * Factory for loading festival data into the app
 */

angular.module('SC-app-festival')
  .factory('festivalFactory', function ($http, $rootScope, $window, utilitiesFactory, angularMomentConfig, appConfig) {

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

  });