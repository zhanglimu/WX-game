//var url = "https://private-14388b-cxsidemo1.apiary-mock.com/";
//var url = "http://123.57.229.101:12317/CaiexOpenNewsApi/";
var url = "http://www.caiex.com:12317/CaiexOpenNewsApi/";
var app = angular.module('player', ['ionic'])
var playerID = ""; //球员id
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

//菜单内容
app.controller('Players', Appdetail);

function Appdetail($scope, $rootScope, $http, $location, playerService) {

	var adsUrl = $location.absUrl();
	if(adsUrl != null) {
		var adsUrls = adsUrl.split("playerid=");
		playerID = adsUrls[1];
	}
	var obj = new Object();
	var promise = playerService.queryPlayers(); // 查询阵容
	promise.then(function(playerBasicInfo) {
		//var playerBasicInfo = matchData.response.PlayerBasicInfo;
		if(playerBasicInfo!=null && playerBasicInfo!=""){
			//obj.src = playerBasicInfo.playerImg;
			obj.src ="web_img/0.jpg";
			obj.name = playerBasicInfo.playerName;
			obj.team = playerBasicInfo.team;
			obj.nat = playerBasicInfo.nationality;
			obj.place = playerBasicInfo.position;
			obj.rate = playerBasicInfo.importance;
			obj.gamenum = playerBasicInfo.matchNum;
			obj.rele = playerBasicInfo.firstNum;
			obj.goals = playerBasicInfo.goalNum;
			obj.yello = playerBasicInfo.yellNum;
			obj.red = playerBasicInfo.redNum;
			var list = new Array();
			for(var i = 0; i < playerBasicInfo.fiveGames.length; i++) {
				var teams = new Object();
				var gameObj = playerBasicInfo.fiveGames[i];
				teams.name = gameObj.homeName + " " + gameObj.score + " " + gameObj.awayName;
				if(gameObj.bunko == "输") {
					teams.shuying = '<img src="web_img/shu.png" />';
				} else if(gameObj.bunko == "赢") {
					teams.shuying = '<img src="web_img/ying.jpg" />';
				}
				var imghtml = "";
				if(gameObj.expression != null && gameObj.expression != "") {
					var expressions = gameObj.expression.split("-");
					for(var j = 0; j < expressions.length; j++) {
						if(expressions[j] == "1") { //黄牌
							imghtml = imghtml + '<img src="web_img/yellow.png" />';
						} else if(expressions[j] == "2") { //红牌
							imghtml = imghtml + '<img src="web_img/red.png" />';
						} else if(expressions[j] == "3") { //换上
							imghtml = imghtml + '<img src="web_img/pu_on.png" />';
						} else if(expressions[j] == "4") { //换下
							imghtml = imghtml + '<img src="web_img/pu_down.png" />';
						} else if(expressions[j] == "5") { //首发
							imghtml = imghtml + '<img src="web_img/yes.png" />';
						} else if(expressions[j] == "6") { //进球
							imghtml = imghtml + '<img src="web_img/penalty.png" />';
						} else if(expressions[j] == "7") { //乌龙球
							imghtml = imghtml + '<img src="web_img/usual.png" />';
						}
					}
				}
	
				teams.imghtml = imghtml;
				list[i] = teams;
			}
			obj.teams = list;
		}
		
		$scope.user = obj;
	}, function(data) { // 处理错误 .reject  
		alert('查询主队信息错误！');
	})

}

//查询球员信息
app.factory('playerService', ['$http', '$q', '$location', function($http, $q, $location) {

	return {
		queryPlayers: function() {
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
				$http({
					method: 'GET',
					url: url+'player_en?playerId='+playerID
					//url: url + 'player/1213'
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