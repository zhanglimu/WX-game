var url = "https://private-14388b-cxsidemo1.apiary-mock.com/";
var app = angular.module('starter', ['ionic'])
var matchID = "1139";
app.run(function($ionicPlatform) {
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

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider

		.state('app', {
		url: "/app",
		abstract: true,
		templateUrl: "xl_menuNO.html",
		controller: 'AppCtrl'
	})

	.state('app.xl_zixunNO', {
		url: "/xl_zixunNO",
		views: {
			'menuContentNO': {
				templateUrl: "xl_zixuncontentNO.html",
				controller: 'zixuncontentCtrl'
			}
		}
	})


	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/app/xl_zixunNO');
})

//菜单内容
app.controller('AppCtrl', Appdetail);

function Appdetail($scope, $rootScope, $http) {
	$scope.weeks = ["亚洲冠军联赛", "澳大利亚超级联赛", "亚运会男足", "非洲杯"];
}

//中心内容
app.controller('zixuncontentCtrl', zixuncontent);

function zixuncontent($rootScope,$location, $scope, $http, homeAwayService) {
	console.log("PlaylistsCtrl");
	/*var adsUrl = $location.absUrl();
	if(adsUrl != null) {
		var adsUrls = adsUrl.split("matchID=");
		var matchIDs = adsUrls[1].split("#/");
		matchID = matchIDs[0];
	}*/
	$rootScope.jiantou=false;//默认不显示球队表现对比
	$scope.yuyansty="background-color: #808080";//默认中文；
	$scope.yuyanstyy="";
	content($location, $scope, $http, homeAwayService);

	//下拉刷新
	$scope.doRefresh = function() {
		content($location, $scope, $http, homeAwayService);
	}
	//语言切换
	$scope.yuyanClick = function(num) {
		if(num==1){
			$scope.yuyansty="background-color: #808080";//默认中文；
			$scope.yuyanstyy="";
		}else{
			$scope.yuyanstyy="background-color: #808080";//默认中文；
			$scope.yuyansty="";
		}
		
	}
	$rootScope.jiantouClick=function(num){
		
		if(num==1){//点击显示
			$rootScope.jiantou=true;
		}else{//隐藏
			$rootScope.jiantou=false;
		}
	}
}

function content($location, $scope, $http, homeAwayService) {
	var match = new Object();
	var promise = homeAwayService.matchInfo(); //查询主队信息
	promise.then(function(matchInfo) {
		match.league = matchInfo.leagueName;
		match.homeName = matchInfo.homeName;
		match.hwen = "(主队)";
		match.awayName = matchInfo.awayName;
		match.awen = "(客队)";
		
		match.homeImage = matchInfo.homeImage == null || matchInfo.homeImage == "" ? "web_img/zhudui.png" : matchInfo.homeImage;
		match.awayImage = matchInfo.awayImage == null || matchInfo.awayImage == "" ? "web_img/kedui.png" : matchInfo.awayImage;

		
		$scope.match = match;
		
	}, function(data) { // 处理错误 .reject 
		
		alert('查询中文賽事信息错误！');
	}).finally(function() {
		$scope.$broadcast('scroll.refreshComplete');
	});
}

function strToweek(date) {
	var arys1 = date.split("-");
	var arys2 = arys1[2].split(" ");
	var ssdate = new Date(arys1[0], parseInt(arys1[1] - 1), arys2[0]);
	var week = "";
	var num = ssdate.getDay();
	if(num == 1) {
		week = "星期一";
	} else if(num == 2) {
		week = "星期二";
	} else if(num == 3) {
		week = "星期三";
	} else if(num == 4) {
		week = "星期四";
	} else if(num == 5) {
		week = "星期五";
	} else if(num == 6) {
		week = "星期六";
	} else {
		week = "星期日";
	}
	return arys1[0] + "-" + arys1[1] + "-" + arys2[0] + "  " + week;
}
//查询主客队信息
app.factory('homeAwayService', ['$http', '$q', '$location', function($http, $q, $location) {

	return {
		matchInfo: function() {
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
				$http({
					method: 'GET',
					url: url + 'matchInfo/' + matchID
				}).
				success(function(data) {
					deferred.resolve(data); // 声明执行成功，即http请求数据成功，可以返回数据了  
				}).
				error(function(data) {
					deferred.reject(data); // 声明执行失败，即服务器返回错误  
				});
				return deferred.promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API  
			} // end query  
	};
}]);
