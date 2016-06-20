// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.services', 'app.config'])

.run(function($ionicPlatform, $rootScope, AuthService, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
    $rootScope.devicePlatform = ionic.Platform.platform();

    AuthService.userIsLoggedIn().then(function(response){
        

    },function(response){$state.go('login');});     
    
    
  });
  
    $ionicPlatform.on("resume", function(){ 
        AuthService.userIsLoggedIn().then(function(){},function(){$state.go('login');});
    });
      

    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){ // UI Router Authentication Check
      if (toState.data.authenticate){
          AuthService.userIsLoggedIn().then(function(response){},function(){$state.go('login');});
      }
      
      if (toState.name === "login"){
          document.getElementById("main-header-bar").style.display = 'none';
      }
      else{
          document.getElementById("main-header-bar").style.display = 'block';
      }
    });  

    $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams){ // UI Router Authentication Check
        
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.close();
        }        

        if (toState.name === "login"){
            AuthService.logout(); //make sure user is logged out if in this state
        }
    });  
  
  
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  
  $ionicConfigProvider.backButton.previousTitleText(false);
  $stateProvider

    .state('login', {
        url: '/login',
        templateUrl: "templates/login.html",
        controller: 'LoginCtrl',
        data: {
          authenticate: false
        }
    }) 

    .state('createteam', {
        url: '/createteam',
        templateUrl: "templates/create-team.html",
        controller: 'CreateTeamCtrl',
        data: {
          authenticate: false
        }
    })
    
    .state('jointeam', {
        url: '/jointeam',
        templateUrl: "templates/join-team.html",
        controller: 'JoinTeamCtrl',
        data: {
          authenticate: false
        }
    })    

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.groups', {
    url: '/groups',
    views: {
      'tab-groups': {
        templateUrl: 'templates/tab-groups.html',
        controller: 'GroupsCtrl'
      }
    },
    data: {
      authenticate: true
    }    
  })
  
  .state('tab.createteam', {
    url: '/groups/createteam',
    views: {
      'tab-groups': {
        templateUrl: 'templates/create-team2.html',
        controller: 'CreateTeam2Ctrl'
      }
    },
    data: {
      authenticate: true
    }    
  })
  .state('tab.jointeam', {
    url: '/groups/jointeam',
    views: {
      'tab-groups': {
        templateUrl: 'templates/join-team2.html',
        controller: 'JoinTeam2Ctrl'
      }
    },
    data: {
      authenticate: true
    }    
  })  
    .state('tab.groupdetail', {
      url: '/groups/:groupId',
      views: {
        'tab-groups': {
          templateUrl: 'templates/group-detail.html',
          controller: 'GroupDetailCtrl'
        }
      },
    data: {
      authenticate: true
    } 
    })




  .state('tab.tips', {
      url: '/tips',
      views: {
        'tab-tips': {
          templateUrl: 'templates/tab-tips.html',
          controller: 'TipsCtrl'
        }
      },
    data: {
      authenticate: true
    } 
    })
    .state('tab.tipdetail', {
      url: '/tips/:tipId',
      views: {
        'tab-tips': {
          templateUrl: 'templates/tip-detail.html',
          controller: 'TipDetailCtrl'
        }
      },
    data: {
      authenticate: true
    } 
    });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/groups');

});
