var url = "https://sbc.caiex.com/SBC/";
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if(window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if(window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
	});
})

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider

		.state('app', {
		url: "/app",
		abstract: true,
		templateUrl: "menu.html",
		controller: 'AppCtrl'
	})

	.state('app.playlists', {
		url: "/playlists",
		views: {
			'menuContent': {
				templateUrl: "playlists.html",
				controller: 'PlaylistsCtrl'
			}
		}
	})

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/app/playlists');
})

.controller('AppCtrl', function($scope, $rootScope, $http) {
		var weeks = new Array();
		var j = 0;
		for(var i = -1; i < 6; i++) {
			var zt = getNowFormatDate(i); //昨天
			var obj = new Object();

			obj.day = zt;
			obj.weekNo = weekDates(zt);
			weeks[j] = obj;
			j++;
		}
		//$scope.weeks=["周一","周二","周三","周四","周五","周六","周日"]
		$scope.weeks = weeks;
		//点击哪一天
		$scope.weekClick = function(day) {
			//window.location.href ="ion-menus.html"; 
			sessionStorage.setItem('match_day', day);
			$rootScope.newDate = day;
			$rootScope.oddsf = false;
			matchList($http, $scope, $rootScope, day);

		}
	})
	.controller('PlaylistsCtrl', function($scope, $rootScope, $http) {
		console.log("PlaylistsCtrl");
		var mday = sessionStorage.getItem('match_day');
		var zt = "";
		if(mday == null || mday == "") {
			zt = getNowFormatDate(0);
		} else {
			zt = mday;
		}

		$rootScope.oddsf = false;
		$rootScope.newDate = zt;

		matchList($http, $scope, $rootScope, zt);
		//下拉刷新
		$scope.doRefresh = function() {
			var mday = sessionStorage.getItem('match_day');
			if(mday == null) {
				mday = getNowFormatDate(0);
			}
			matchList($http, $scope, $rootScope, mday);

		}

	})