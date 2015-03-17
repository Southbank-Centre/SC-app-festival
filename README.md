# Southbank Centre App: Festival

## Installation

### Step 0

Check [this app's dependencies](https://github.com/Southbank-Centre/SC-app-festival/blob/master/bower.json) and make sure that you follow the installation instructions for the SC-app-* modules that this one depends on.

### Step 1
Run the following command in your app's root directory.

    $ bower install --save Southbank-Centre/SC-app-festival#n.n.n

Replace n.n.n with the version number of this module that you require. See [the list of releases](https://github.com/Southbank-Centre/SC-app-festival/releases).

*Please don't install without a release number or your app will be unstable.*

### Step 2

Add **SC-app-festival** to the dependency list in **[YourAppName].module.js**

### Step 3
Specify the following values in your app's **appConfig** constant:

- festivalAlias
- ticketingVocabularyId

### Step 4

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

This adds an extra navigation bar into the header provided by the SC-app-header module and includes the festival's navigation.

*This feature requires the [SC-app-header](https://github.com/Southbank-Centre/SC-app-header) module to be installed.*

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

*This feature requires the [SC-app-footer](https://github.com/Southbank-Centre/SC-app-footer) module to be installed.*

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