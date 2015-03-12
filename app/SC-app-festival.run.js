'use strict';

angular
  .module('SC-app-festival').run(function ($rootScope, utilitiesFactory) {

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

  });