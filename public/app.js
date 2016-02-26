angular.module('App',[
	'ui.router',
	'ngMessages',
	'App.appCtrl',
	'App.homeCtrl',
	'App.loginCtrl',
	'App.signupCtrl',
	'App.userProfileCtrl',
	'App.userprofile-registerCtrl',
	'App.userprofile-profileInfoCtrl',
	'App.userprofile-chartsCtrl',
	'App.userprofile-triggerCtrl',
	'appFactory',
	'userProfileFactory',
	'ui.bootstrap',
	'ngAnimate',
	'ngMaterial',
	'duScroll'
	])
	.config(function($stateProvider, $urlRouterProvider,  $httpProvider){
		$stateProvider
			.state('home',{
				url: '/',
				authenticate: false,
				views: {
					'': {
						templateUrl: 'pages/home/home.html',
						controller: 'homeCtrl'
					}
				}
			})
			.state('signin',{
				url: '/signin',
				authenticate: false,
				views: {
					'': {
						templateUrl: 'pages/signin/login.html',
						controller: 'loginCtrl'
					}
				}
			})
			.state('signup',{
				url: '/signup',
				authenticate: false,
				views: {
					'': {
						templateUrl: 'pages/signup/signup.html',
						controller: 'signupCtrl'
					}
				}
			})
			.state('userprofile',{
				url: '/userprofile',
				authenticate: true,
				views: {
					'': {
						templateUrl: 'pages/userProfile/userprofile.html',
						controller: 'userProfileCtrl'
					},
					'register@userprofile': {
						templateUrl: 'pages/userProfile/templates/userprofile-register.html',
						controller: 'userprofile-registerCtrl'
					},
					'profileInfo@userprofile': {
						templateUrl: 'pages/userProfile/templates/userprofile-profileInfo.html',
						controller: 'userprofile-profileInfoCtrl'
					},
					'charts@userprofile': {
						templateUrl: 'pages/userProfile/templates/userprofile-charts.html',
						controller: 'userprofile-chartsCtrl'
					},
					'trigger@userprofile': {
						templateUrl: 'pages/userProfile/templates/userprofile-trigger.html',
						controller: 'userprofile-triggerCtrl'
					}
				}
			})

		$urlRouterProvider
			.otherwise('/');
	})
	.run(function($rootScope, $state, appFactory, $location) {
	  $rootScope.$on('$stateChangeStart', function(e, to) {
	    if (!to.authenticate) {
				return;
			};
			e.preventDefault();
			appFactory.isAuth($state).then(function(result){
				if(result){
					to.authenticate = false;
					$state.go(to.name);
				}else{
					$state.go('home');
				}
			})
	  });
	})
