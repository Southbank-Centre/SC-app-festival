# Southbank Centre App: Festival

## Installation

### Step 1
Run the following command in your app's root directory.

    $ bower install --save Southbank-Centre/SC-app-festival#n.n.n

Replace n.n.n with the version number of this module that you require. See [the list of releases](https://github.com/Southbank-Centre/SC-app-festival/releases).

*Please don't install without a release number or your app will be unstable.*

### Step 2
Specify the following values in your app's **appConfig** constant:

- festivalAlias
- ticketingVocabularyId

### Step 3

Install the optional features of this module.

#### Festival Banner

This is the large hero image that appears at the top of the homepage with the festival's main image and description.

Add the following view to your app's **app.home** state:

	.state('app.home', {
        url: '/',
        views: {
            ...
            'festivalBanner@': {
                templateUrl: 'bower_components/SC-app-festival/release/festivalBannerView.html'
            }
            ...
        }
    }
    
#### Festival Navigation

This adds an extra navigation bar into the header for navigating the festival.

Add the following view to your app's **app** state:

    .state('app', {
        url: '',
        views: {
            ...
            'festivalNav@app' : {
                templateUrl: 'bower_components/SC-app-festival/release/festivalNavView.html'
              }
            ...
        }
    }
    
#### Festival Footer

This adds an extra footer above the footer provided by the SC-app-footer module and includes the festival's footer navigation.

Add the following view to your app's **app** state:

    .state('app', {
        url: '',
        views: {
            ...
            'festivalFooter@app' : {
                templateUrl: 'bower_components/SC-app-festival/release/festivalFooterView.html'
              }
            ...
        }
    }