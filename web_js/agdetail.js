var app = angular.module("agdetails", ['ionic']);
var url = "http://101.200.156.97/CAIEX-GAME/";
var urls = "http://www.caiex.com/";
var matchID = "";
var player_id = getCookie("TGamePlayers"); //用户id     getCookie("TGamePlayers")
//登录
//var userNickName =getTGamePlayersCookie().player_nickname;
var appid = 'wxd67f8fc253fdc6f3';
var headPicUrl = '';
	var pcnavbox = [
		{"url":"index.html","text":"赛事游戏"},
//		{"url":"web_news.html","text":"赛事信息","selected":true},
		{"url":"web_gameuser.html","text":"个人中心"},
//		{"url":"web_gift.html","text":"兑奖中心"},
//		{"url":"web_giftlist.html","text":"兑奖记录"},
		{"url":"http://www.caiex.com/caiex/","text":"公司介绍"}
	];
	app.controller("agpcnavctrl",function($rootScope){
		this.pcnavbox = pcnavbox;
		this.src = "web_img/logoSI.png";
		this.src0 = "web_img/logo.png";
//		this.header = "web_img/0.jpg";
				// ============ 初始化数据 ====================
		//点击关闭登录二维码页面
		$('.theme-poptit .close').click(function() {
			$('.theme-popover-mask').fadeOut(100);
			$('.theme-popover').slideUp(200);
		});
		//登录
		this.header = headPicUrl;
		if(player_id == '' || player_id == null) {
			$rootScope.loginFagle = false;
			$rootScope.loginClass = "signin";
		} else {
			$rootScope.loginFagle = true;
			$rootScope.loginClass = "cart-info";
			//$rootScope.userNickName = userNickName;
			$rootScope.headPicUrl = headPicUrl;
		}	
		$('#loginHref').click(function() {
			loginMethod();
		});
		$rootScope.loginMethod = function() {
				var obj = new WxLogin({
					id: "code",
					appid: appid,
					scope: "snsapi_login",
					redirect_uri: "http%3a%2f%2fwww.caiex.com%2fCAIEX-GAME%2floginController%2fwebLoginGame.shtml%3fpageName%3d55",
					state: randomString(6),
					style: "black",
					href: ""
				});
				$('.theme-popover-mask').fadeIn(100);
				$('.theme-popover').slideDown(200);
			}
			//退出登录
		$rootScope.quitOut = function() {
			clearCookie();
			window.location.href = "web_falls.html";
		};
	});

var navbox = [{
	"url": "web_falls.html",
	"text": "赛事日期"
}, {
	"url": "web_news.html",
	"text": "赛事信息",
	"selected": true
}, {
	"url": "web_gameuser.html",
	"text": "个人中心"
}, ];

//获取用户信息
app.factory('userService', ['$http', '$q', '$location', function($http, $q, $location) {
	return {
		query: function() {
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
				$http({
					method: 'GET',
					url: url + 'fallsList/getMatchUser.shtml?player_id=' + player_id
				}).
				success(function(data) {
					deferred.resolve(data.data); // 声明执行成功，即http请求数据成功，可以返回数据了  
				}).
				error(function(data) {
					deferred.reject(data.data); // 声明执行失败，即服务器返回错误  
				});
				return deferred.promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API  
			} // end query  
	};
}]);
app.controller("agdetailctrl", function($location, $scope, userService, matchInfoService, homeAwayService, battleService, articlesService, $rootScope) {

	var adsUrl = $location.absUrl();
	if(adsUrl != null) {
		var adsUrls = adsUrl.split("matchID=");
		matchID = adsUrls[1];
	}
	$scope.refresh = function() {
		detailMatch(matchInfoService, $rootScope);
		zhudui(homeAwayService, $rootScope);
		kectrl(homeAwayService, $rootScope);
		zhenctrl(battleService, $rootScope);
		saictrl(articlesService, $rootScope);

	}
	var user = this;
	var promiseUser = userService.query(); // 同步调用，获得承诺接口  
	promiseUser.then(function(datas) {
		var headPicUrl = datas.headPicUrl;
		user.src0 = "web_img/white.png";
		user.src1 = "web_img/icon.png";
		user.word = "赛事信息";
		user.url = "web_gameuser.html";
		user.src = headPicUrl;
		user.navbox = navbox;
	}, function(data) { // 处理错误 .reject  
		alert('用户头像查询错误！');
	});

});

//查询赛事信息
app.factory('matchInfoService', ['$http', '$q', '$location', function($http, $q, $location) {

	return {
		matches: function() {
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
				$http({
					method: 'GET',
					url: urls + 'matches/' + matchID
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
app.controller("detailctrl", function(matchInfoService, $interval, $rootScope) { //比赛

	detailMatch(matchInfoService, $rootScope);
	$interval(function() {
		detailMatch(matchInfoService, $rootScope);
	}, 10000);
});

function detailMatch(matchInfoService, $rootScope) {
	var matchInfo = new Object();
	var promise = matchInfoService.matches(); // 查询赛事信息
	promise.then(function(data) {
		var match = data.response.matchStatistic;
		if(data != null) {
			switch(match.state) {
				case '未':

					matchInfo.word = "-- : --";
					matchInfo.wor = "未开赛";
					matchInfo.wod = match.matchTimes;
					break;
				case '完':
					var scores = match.homeScore.split("-");
					matchInfo.word = scores[0] + ":" + scores[1];
					matchInfo.wor = "已结束";
					matchInfo.wod = "";
					break;
				case '中':
					var scores = match.homeScore.split("-");
					matchInfo.word = scores[0] + ":" + scores[1];
					matchInfo.wor = "中场休息";
					matchInfo.wod = "45分钟";
					break;
				default:
					var scores = match.homeScore.split("-");
					matchInfo.word = scores[0] + ":" + scores[1];
					matchInfo.wor = "进行中";
					matchInfo.wod = match.duration_time + "分钟  " + match.half + "半场";
					break;
			}
			matchInfo.src = "web_img/Mexico.png";
			matchInfo.text = match.homeTeam;
			if(match.homeFmConfirm == 1) {
				matchInfo.st1 = "web_img/set.png";
			} else {
				matchInfo.st1 = "web_img/set_gray.png";
				$(".checkboxFive label").css("opacity", "0.2");

			}
			if(match.awayFmConfirm == 1) {

				matchInfo.st2 = "web_img/set.png";

			} else {
				matchInfo.st2 = "web_img/set_gray.png";
				$(".checkboxFive1 label").css("opacity", "0.2");
			}

			var matchDataList = match.keyEvents;
			var zhunum = 0;
			var kenum = 0;
			var pointer = new Array();
			var poiner = new Array();
			for(var i = 0; i < matchDataList.length; i++) {
				var matchData = matchDataList[i];
				var per = matchData.minute * 100 / 95;
				var perPic = per - 0.4;
				if(matchData.team == 1) { //主队
					var zhuObj = new Object();
					switch(matchData.eventType) {

						case 1:
							//进球
							zhuObj.src = "web_img/usual.png";
							zhuObj.src1 = "web_img/little.png";
							zhuObj.tit = matchData.minute + "分钟" + "主队" + matchData.relative_player + "进球";
							break;
						case 2:
							//点球
							zhuObj.src = "web_img/penalty.png";
							zhuObj.src1 = "web_img/little.png";
							zhuObj.tit = matchData.minute + "分钟" + "主队" + matchData.relative_player + "点球";
							break;
						case 5:
							//黄牌
							zhuObj.src = "web_img/yellow.png";
							zhuObj.src1 = "web_img/little.png";
							zhuObj.tit = matchData.minute + "分钟" + "主队" + matchData.relative_player + "黄牌";
							break;
						case 6:
							//红牌
							zhuObj.src = "web_img/red.png";
							zhuObj.src1 = "web_img/little.png";
							zhuObj.tit = matchData.minute + "分钟" + "主队" + matchData.relative_player + "红牌";
							break;
						case 7:
							//两黄
							zhuObj.src = "web_img/yere.png";
							zhuObj.src1 = "web_img/little.png";
							zhuObj.tit = matchData.minute + "分钟" + "主队" + matchData.relative_player + "两黄";
							break;
					}
					zhuObj.perPic = "position: absolute;top: -22px; left:" + perPic + "%;";
					zhuObj.per = "position: absolute;top: -2px; left:" + per + "%;";

					pointer[zhunum] = zhuObj;
					zhunum++;
				} else { //客队

					var keObj = new Object();
					switch(matchData.eventType) {
						case 1:
							//进球
							keObj.src = "web_img/usual.png";
							keObj.src1 = "web_img/little.png";
							keObj.tit = matchData.minute + "分钟" + "客队" + matchData.relative_player + "进球";
							break;
						case 2:
							//点球
							keObj.src = "web_img/penalty.png";
							keObj.src1 = "web_img/little.png";
							keObj.tit = matchData.minute + "分钟" + "客队" + matchData.relative_player + "点球";
							break;
						case 5:
							//黄牌
							keObj.src = "web_img/yellow.png";
							keObj.src1 = "web_img/little.png";
							keObj.tit = matchData.minute + "分钟" + "客队" + matchData.relative_player + "黄牌";
							break;
						case 6:
							//红牌
							keObj.src = "web_img/red.png";
							keObj.src1 = "web_img/little.png";
							keObj.tit = matchData.minute + "分钟" + "客队" + matchData.relative_player + "红牌";
							break;
						case 7:
							//两黄
							keObj.src = "web_img/yere.png";
							keObj.src1 = "web_img/little.png";
							keObj.tit = matchData.minute + "分钟" + "客队" + matchData.relative_player + "两黄";
							break;
					}
					keObj.perPic = "position: absolute;top: 10px; left:" + perPic + "%;";
					keObj.per = "position: absolute;top: -2px; left:" + per + "%;";

					poiner[kenum] = keObj;
					kenum++;
				}
			}

			matchInfo.src1 = "web_img/Uruguay.png";
			matchInfo.text1 = match.awayTeam;
			matchInfo.pointer = pointer; //主队
			matchInfo.poiner = poiner; //客队
			matchInfo.url = "web_img/little_gray.png"; //中场点
			matchInfo.ling = "0'";
			matchInfo.jiu = "90'";
			matchInfo.oulian = "欧联";
			$rootScope.detailing = matchInfo;
		}

	}, function(data) { // 处理错误 .reject  
		alert('查询赛事信息错误！');
	});

}
app.controller("detactrl", function() { //比赛
	this.zhudui = "主队";
	this.kedui = "客队";
	this.zhenr = "阵容";
	this.saihou = "赛后";
});

//查询主客队信息
app.factory('homeAwayService', ['$http', '$q', '$location', function($http, $q, $location) {

	return {
		matchInfo: function() {
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
				$http({
					method: 'GET',
					url: urls + 'matchInfo/' + matchID
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
app.controller("zhuctrl", function(homeAwayService, $rootScope) {
	zhudui(homeAwayService, $rootScope);
});

function zhudui(homeAwayService, $rootScope) {
	var match = new Object();
	var promise = homeAwayService.matchInfo(); //查询主队信息
	promise.then(function(matchData) {
		var matchInfo = matchData.response.matchInfo;

		match.word = matchInfo.homeName;
		var homeLatest5 = matchInfo.homeLatest5;
		var imghtml = new Array();
		for(var i = 0; i < homeLatest5.length; i++) {
			var obj = new Object();
			if(homeLatest5[i] == "1") {
				obj.srcs = "web_img/W.png";
			} else if(homeLatest5[i] == "2") {
				obj.srcs = "web_img/L.png";
			} else if(homeLatest5[i] == "X") {
				obj.srcs = "web_img/D.png";
			}
			imghtml[i] = obj;
		}
		var starHtml = new Array();
		var titl = ["很烂", "一般", "还好", "较好", "很好"];
		for(var i = 1; i < 6; i++) {
			var obj = new Object();
			if(matchInfo.homeStar >= i) {
				obj.star = "web_img/icon_star_2.png";
			} else {
				obj.star = "web_img/icon_star_1.png";
			}
			obj.tilte = titl[i - 1];
			starHtml[i] = obj;
		}
		match.homeFmUpdateTime = matchInfo.homeFmUpdateTime;
		match.homeSummary = matchInfo.homeSummary;
		match.worda = matchInfo.homeFormation;
		match.wordb = matchInfo.weather;
		match.src = imghtml;
		match.text = matchInfo.judge;
		match.lian = "web_img/player.png";
		match.jie = "web_img/track.png";
		match.star1 = starHtml;
		match.hinjury = matchInfo.hinjury == "" || matchInfo.hinjury == null ? "暂无信息" : matchInfo.hinjury;
		match.hsuspended = matchInfo.hsuspended == null || matchInfo.hsuspended == "" ? "暂无信息" : matchInfo.hsuspended;
		match.hpossibleInjury = matchInfo.hpossibleInjury == null || matchInfo.hpossibleInjury == "" ? "暂无信息" : matchInfo.hpossibleInjury;
		$rootScope.zhudui = match;
	}, function(data) { // 处理错误 .reject  
		alert('查询主队信息错误！');
	});
}
app.controller("kectrl", function(homeAwayService, $rootScope) {
	kectrl(homeAwayService, $rootScope);
});

function kectrl(homeAwayService, $rootScope) {
	var match = new Object();
	var promise = homeAwayService.matchInfo(); //查询客队信息
	promise.then(function(matchData) {
		var matchInfo = matchData.response.matchInfo;

		match.word = matchInfo.awayName;
		var awayLatest5 = matchInfo.awayLatest5;
		var imghtml = new Array();
		for(var i = 0; i < awayLatest5.length; i++) {
			var obj = new Object();
			if(awayLatest5[i] == "1") {
				obj.srcs = "web_img/W.png";
			} else if(awayLatest5[i] == "2") {
				obj.srcs = "web_img/L.png";
			} else if(awayLatest5[i] == "X") {
				obj.srcs = "web_img/D.png";
			}
			imghtml[i] = obj;
		}
		var starHtml = new Array();
		var titl = ["很烂", "一般", "还好", "较好", "很好"];
		for(var i = 1; i < 6; i++) {
			var obj = new Object();
			if(matchInfo.awayStar >= i) {
				obj.star = "web_img/icon_star_2.png";
			} else {
				obj.star = "web_img/icon_star_1.png";
			}
			obj.tilte = titl[i - 1];
			starHtml[i] = obj;
		}
		match.awayFmUpdateTime = matchInfo.awayFmUpdateTime;
		match.awaySummary = matchInfo.awaySummary;
		match.worda = matchInfo.awayFormation;
		match.wordb = matchInfo.weather;
		match.src = imghtml;
		match.text = matchInfo.judge;
		match.lian = "web_img/player.png";
		match.jie = "web_img/track.png";
		match.star1 = starHtml;
		match.ainjury = matchInfo.ainjury == "" || matchInfo.ainjury == null ? "暂无信息" : matchInfo.ainjury;
		match.asuspended = matchInfo.asuspended == null || matchInfo.asuspended == "" ? "暂无信息" : matchInfo.asuspended;
		match.apossibleInjury = matchInfo.apossibleInjury == null || matchInfo.apossibleInjury == "" ? "暂无信息" : matchInfo.apossibleInjury;
		$rootScope.kedui = match;
	}, function(data) { // 处理错误 .reject  
		alert('查询客队队信息错误！');
	});
}
//查询阵容
app.factory('battleService', ['$http', '$q', '$location', function($http, $q, $location) {

	return {
		battle: function() {
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
				$http({
					method: 'GET',
					url: urls + 'battle/' + matchID
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

app.controller("zhenctrl", function(battleService, $rootScope) {

	zhenctrl(battleService, $rootScope);
});

function zhenctrl(battleService, $rootScope) {
	var battle = new Object();
	battle.word = "主队首发阵容";
	battle.word1 = "客队首发阵容";
	battle.word2 = "主队替补阵容";
	battle.word3 = "客队替补阵容";
	var promise = battleService.battle(); // 查询阵容
	promise.then(function(matchData) {
		var list = matchData.response.matchPlayer;
		var zhuli = new Array();
		var keli = new Array();
		var tibuli = new Array();
		var butili = new Array();
		var z=0;
		var k=0;
		var zt=0;
		var kt=0;
		for(var i = 0; i < list.length; i++) {

			var objz = new Object();
			if(list[i].first_fm == 1 && list[i].team == 0) {
				objz.number = list[i].number;
				objz.name = list[i].name;
				objz.spot = list[i].position;
				zhuli[z] = objz;
				z=z+1;
			}

			var objk = new Object();
			if(list[i].first_fm == 1 && list[i].team == 1) {
				objk.number = list[i].number;
				objk.name = list[i].name;
				objk.spot = list[i].position;
				keli[k] = objk;
				k=k+1;
			}

			var objtz = new Object();
			if(list[i].first_fm == 0 && list[i].team == 0) {
				objtz.number = list[i].number;
				objtz.name = list[i].name;
				objtz.spot = list[i].position;
				tibuli[zt] = objtz;
				zt=zt+1;
			}
			var objtk = new Object();
			if(list[i].first_fm == 0 && list[i].team == 1) {
				objtk.number = list[i].number;
				objtk.name = list[i].name;
				objtk.spot = list[i].position;
				butili[kt] = objtk;
				kt=kt+1;
			}
			
			
			
			
			
		}
		battle.zhuli = zhuli;
		battle.keli = keli;
		battle.tibuli = tibuli;
		battle.butili = butili;
		$rootScope.zhenrong = battle;
	}, function(data) { // 处理错误 .reject  
		alert('查询阵容信息错误！');
	});
}
//赛后总结
app.factory('articlesService', ['$http', '$q', '$location', function($http, $q, $location) {

	return {
		articles: function() {
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
				$http({
					method: 'GET',
					url: urls + 'articles/' + matchID + "/s"
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
app.controller("saictrl", function(articlesService, $rootScope) {
	saictrl(articlesService, $rootScope);

});

function saictrl(articlesService, $rootScope) {
	var alticles = new Object();
	var promise = articlesService.articles(); // 查询阵容
	promise.then(function(matchData) {
		var homegang = matchData.response.content;
		if(homegang == null || homegang == "") {
			alticles.falg = true;
			alticles.hou = "暂无信息 ";
		} else {
			alticles.falg = false;
			alticles.hou = homegang;
		}
		$rootScope.saihou = alticles;
	}, function(data) { // 处理错误 .reject  
		alert('查询赛后信息总结信息错误！');
	});
}
var times = [{
	"shi": "2015/2016"
}, {
	"shi": "2014/2015"
}, {
	"shi": "2015/2016"
}, {
	"shi": "2014/2015"
}, {
	"shi": "2015/2016"
}, {
	"shi": "2014/2015"
}, ];
var data = [{
	"nula": "null",
	"nulb": "null",
	"nulc": "null",
	"nuld": "null",
	"nule": "null",
	"nulf": "null",
	"nulg": "null"
}, {
	"nula": "东口顺昭",
	"nulb": "(def)",
	"nulc": "42",
	"nuld": "5",
	"nule": "4",
	"nulf": "0",
	"nulg": "9"
}, {
	"nula": "东口顺昭",
	"nulb": "(mid)",
	"nulc": "45",
	"nuld": "3",
	"nule": "2",
	"nulf": "1",
	"nulg": "5"
}, {
	"nula": "东口顺昭hj",
	"nulb": "(mid)",
	"nulc": "28",
	"nuld": "7",
	"nule": "5",
	"nulf": "0",
	"nulg": "4"
}, {
	"nula": "东口顺昭",
	"nulb": "(mid)",
	"nulc": "45",
	"nuld": "3",
	"nule": "0",
	"nulf": "0",
	"nulg": "2"
}, {
	"nula": "东口顺昭",
	"nulb": "(att)",
	"nulc": "1",
	"nuld": "2",
	"nule": "3",
	"nulf": "0",
	"nulg": "0"
}, {
	"nula": "东口顺昭",
	"nulb": "(att)",
	"nulc": "7",
	"nuld": "2",
	"nule": "0",
	"nulf": "0",
	"nulg": "4"
}, {
	"nula": "东口顺昭hj",
	"nulb": "(mid)",
	"nulc": "28",
	"nuld": "7",
	"nule": "5",
	"nulf": "0",
	"nulg": "4"
}, {
	"nula": "东口顺昭",
	"nulb": "(mid)",
	"nulc": "45",
	"nuld": "3",
	"nule": "0",
	"nulf": "0",
	"nulg": "2"
}, {
	"nula": "东口顺昭",
	"nulb": "(att)",
	"nulc": "1",
	"nuld": "2",
	"nule": "3",
	"nulf": "0",
	"nulg": "0"
}, {
	"nula": "东口顺昭",
	"nulb": "(att)",
	"nulc": "7",
	"nuld": "2",
	"nule": "0",
	"nulf": "0",
	"nulg": "4"
}, ];
app.controller("infoctrl", function() {
	tan = this;
	tan.title = "曼彻斯特联队";
	tan.times = times;
	tan.title1 = "player";
	tan.title2 = "pos";
	tan.title3 = "games";
	tan.title4 = "starts";
	tan.title5 = "goals";
	tan.title6 = "rc";
	tan.title7 = "yr";
	tan.data = data;
});
var match = [{
	"test": "全部"
}, {
	"test": "英超联赛"
}, {
	"test": "足总杯"
}, {
	"test": "联赛杯"
}, {
	"test": "冠军杯"
}];
var tou = [{
	"tit1": "Position",
	"tit2": "Gk",
	"tit3": "Gk",
	"tit4": "Att",
	"tit5": "Att",
	"tit6": "Att",
	"tit7": "Mid",
	"tit8": "Mid",
	"tit9": "Mid",
	"tit10": "Def",
	"tit11": "Def"
}, {
	"tit1": "Player",
	"tit2": "李相浩",
	"tit3": "李相浩李相浩",
	"tit4": "李相浩",
	"tit5": "李相浩",
	"tit6": "李相浩李相浩",
	"tit7": "李相浩",
	"tit8": "李相浩",
	"tit9": "李相浩",
	"tit10": "李相浩",
	"tit11": "李相浩"
}, ];
var nulll = [{
	"hee1": "null",
	"hee2": "null",
	"hee3": "null",
	"hee4": "null",
	"hee5": "null",
	"hee6": "null",
	"hee7": "null",
	"hee8": "null",
	"hee9": "null",
	"hee10": "null",
	"hee11": "null"
}, {
	"hee1": "null",
	"hee2": "null",
	"hee3": "null",
	"hee4": "null",
	"hee5": "null",
	"hee6": "null",
	"hee7": "null",
	"hee8": "null",
	"hee9": "null",
	"hee10": "null",
	"hee11": "null"
}];
var tuwen = [{
	"name1": "尤文图斯",
	"number1": "3-2",
	"srcs1": "web_img/D.png",
	"he1": "web_img/red.png",
	"he2": "",
	"he3": "",
	"he4": "web_img/D.png",
	"he5": "",
	"he6": "",
	"he7": "web_img/red.png",
	"he8": "",
	"he9": "",
	"he10": "",
	"he11": "",
	"he12": "",
	"he13": "web_img/L.png",
	"he14": "web_img/yellow.png",
	"he15": "",
	"he16": "web_img/yellow.png",
	"he17": "web_img/W.png",
	"he18": "",
	"he19": "web_img/red.png",
	"he20": "",
	"he21": "",
	"he22": "web_img/yes.png",
	"he23": "web_img/L.png",
	"he24": "",
	"he25": "web_img/yes.png",
	"he26": "",
	"he27": "",
	"he28": "web_img/yes.png",
	"he29": "",
	"he30": ""
}, {
	"name1": "尤文图斯",
	"number1": "3-2",
	"srcs1": "web_img/D.png",
	"he1": "web_img/red.png",
	"he2": "",
	"he3": "",
	"he4": "web_img/D.png",
	"he5": "",
	"he6": "",
	"he7": "web_img/red.png",
	"he8": "",
	"he9": "",
	"he10": "",
	"he11": "",
	"he12": "",
	"he13": "web_img/L.png",
	"he14": "web_img/yellow.png",
	"he15": "",
	"he16": "web_img/yellow.png",
	"he17": "web_img/W.png",
	"he18": "",
	"he19": "web_img/red.png",
	"he20": "",
	"he21": "",
	"he22": "web_img/yes.png",
	"he23": "web_img/L.png",
	"he24": "",
	"he25": "web_img/yes.png",
	"he26": "",
	"he27": "",
	"he28": "web_img/yes.png",
	"he29": "",
	"he30": ""
}, {
	"name1": "尤文图斯",
	"number1": "3-2",
	"srcs1": "web_img/D.png",
	"he1": "web_img/red.png",
	"he2": "",
	"he3": "",
	"he4": "web_img/D.png",
	"he5": "",
	"he6": "",
	"he7": "web_img/red.png",
	"he8": "",
	"he9": "",
	"he10": "",
	"he11": "",
	"he12": "",
	"he13": "web_img/L.png",
	"he14": "web_img/yellow.png",
	"he15": "",
	"he16": "web_img/yellow.png",
	"he17": "web_img/W.png",
	"he18": "",
	"he19": "web_img/red.png",
	"he20": "",
	"he21": "",
	"he22": "web_img/yes.png",
	"he23": "web_img/L.png",
	"he24": "",
	"he25": "web_img/yes.png",
	"he26": "",
	"he27": "",
	"he28": "web_img/yes.png",
	"he29": "",
	"he30": ""
}, {
	"name1": "尤文图斯",
	"number1": "3-2",
	"srcs1": "web_img/D.png",
	"he1": "web_img/red.png",
	"he2": "",
	"he3": "",
	"he4": "web_img/D.png",
	"he5": "",
	"he6": "",
	"he7": "web_img/red.png",
	"he8": "",
	"he9": "",
	"he10": "",
	"he11": "",
	"he12": "",
	"he13": "web_img/L.png",
	"he14": "web_img/yellow.png",
	"he15": "",
	"he16": "web_img/yellow.png",
	"he17": "web_img/W.png",
	"he18": "",
	"he19": "web_img/red.png",
	"he20": "",
	"he21": "",
	"he22": "web_img/yes.png",
	"he23": "web_img/L.png",
	"he24": "",
	"he25": "web_img/yes.png",
	"he26": "",
	"he27": "",
	"he28": "web_img/yes.png",
	"he29": "",
	"he30": ""
}, {
	"name1": "尤文图斯",
	"number1": "3-2",
	"srcs1": "web_img/D.png",
	"he1": "web_img/red.png",
	"he2": "",
	"he3": "",
	"he4": "web_img/D.png",
	"he5": "",
	"he6": "",
	"he7": "web_img/red.png",
	"he8": "",
	"he9": "",
	"he10": "",
	"he11": "",
	"he12": "",
	"he13": "web_img/L.png",
	"he14": "web_img/yellow.png",
	"he15": "",
	"he16": "web_img/yellow.png",
	"he17": "web_img/W.png",
	"he18": "",
	"he19": "web_img/red.png",
	"he20": "",
	"he21": "",
	"he22": "web_img/yes.png",
	"he23": "web_img/L.png",
	"he24": "",
	"he25": "web_img/yes.png",
	"he26": "",
	"he27": "",
	"he28": "web_img/yes.png",
	"he29": "",
	"he30": ""
}, {
	"name1": "尤文图斯",
	"number1": "3-2",
	"srcs1": "web_img/D.png",
	"he1": "web_img/red.png",
	"he2": "",
	"he3": "",
	"he4": "web_img/D.png",
	"he5": "",
	"he6": "",
	"he7": "web_img/red.png",
	"he8": "",
	"he9": "",
	"he10": "",
	"he11": "",
	"he12": "",
	"he13": "web_img/L.png",
	"he14": "web_img/yellow.png",
	"he15": "",
	"he16": "web_img/yellow.png",
	"he17": "web_img/W.png",
	"he18": "",
	"he19": "web_img/red.png",
	"he20": "",
	"he21": "",
	"he22": "web_img/yes.png",
	"he23": "web_img/L.png",
	"he24": "",
	"he25": "web_img/yes.png",
	"he26": "",
	"he27": "",
	"he28": "web_img/yes.png",
	"he29": "",
	"he30": ""
}, {
	"name1": "尤文图斯",
	"number1": "3-2",
	"srcs1": "web_img/D.png",
	"he1": "web_img/red.png",
	"he2": "",
	"he3": "",
	"he4": "web_img/D.png",
	"he5": "",
	"he6": "",
	"he7": "web_img/red.png",
	"he8": "",
	"he9": "",
	"he10": "",
	"he11": "",
	"he12": "",
	"he13": "web_img/L.png",
	"he14": "web_img/yellow.png",
	"he15": "",
	"he16": "web_img/yellow.png",
	"he17": "web_img/W.png",
	"he18": "",
	"he19": "web_img/red.png",
	"he20": "",
	"he21": "",
	"he22": "web_img/yes.png",
	"he23": "web_img/L.png",
	"he24": "",
	"he25": "web_img/yes.png",
	"he26": "",
	"he27": "",
	"he28": "web_img/yes.png",
	"he29": "",
	"he30": ""
}, {
	"name1": "尤文图斯",
	"number1": "3-2",
	"srcs1": "web_img/D.png",
	"he1": "web_img/red.png",
	"he2": "",
	"he3": "",
	"he4": "web_img/D.png",
	"he5": "",
	"he6": "",
	"he7": "web_img/red.png",
	"he8": "",
	"he9": "",
	"he10": "",
	"he11": "",
	"he12": "",
	"he13": "web_img/L.png",
	"he14": "web_img/yellow.png",
	"he15": "",
	"he16": "web_img/yellow.png",
	"he17": "web_img/W.png",
	"he18": "",
	"he19": "web_img/red.png",
	"he20": "",
	"he21": "",
	"he22": "web_img/yes.png",
	"he23": "web_img/L.png",
	"he24": "",
	"he25": "web_img/yes.png",
	"he26": "",
	"he27": "",
	"he28": "web_img/yes.png",
	"he29": "",
	"he30": ""
}, {
	"name1": "尤文图斯",
	"number1": "3-2",
	"srcs1": "web_img/D.png",
	"he1": "web_img/red.png",
	"he2": "",
	"he3": "",
	"he4": "web_img/D.png",
	"he5": "",
	"he6": "",
	"he7": "web_img/red.png",
	"he8": "",
	"he9": "",
	"he10": "",
	"he11": "",
	"he12": "",
	"he13": "web_img/L.png",
	"he14": "web_img/yellow.png",
	"he15": "",
	"he16": "web_img/yellow.png",
	"he17": "web_img/W.png",
	"he18": "",
	"he19": "web_img/red.png",
	"he20": "",
	"he21": "",
	"he22": "web_img/yes.png",
	"he23": "web_img/L.png",
	"he24": "",
	"he25": "web_img/yes.png",
	"he26": "",
	"he27": "",
	"he28": "web_img/yes.png",
	"he29": "",
	"he30": ""
}, {
	"name1": "尤文图斯",
	"number1": "3-2",
	"srcs1": "web_img/D.png",
	"he1": "web_img/red.png",
	"he2": "",
	"he3": "",
	"he4": "web_img/D.png",
	"he5": "",
	"he6": "",
	"he7": "web_img/red.png",
	"he8": "",
	"he9": "",
	"he10": "",
	"he11": "",
	"he12": "",
	"he13": "web_img/L.png",
	"he14": "web_img/yellow.png",
	"he15": "",
	"he16": "web_img/yellow.png",
	"he17": "web_img/W.png",
	"he18": "",
	"he19": "web_img/red.png",
	"he20": "",
	"he21": "",
	"he22": "web_img/yes.png",
	"he23": "web_img/L.png",
	"he24": "",
	"he25": "web_img/yes.png",
	"he26": "",
	"he27": "",
	"he28": "web_img/yes.png",
	"he29": "",
	"he30": ""
}, ];
app.controller("markctrl", function() {
	this.title = "比利亚雷亚尔";
	this.match = match;
	this.times = times;
	this.title1 = "player";
	this.title2 = "pos";
	this.title3 = "games";
	this.title4 = "starts";
	this.title5 = "goals";
	this.title6 = "rc";
	this.title7 = "yr";
	this.tou = tou;
	this.nulll = nulll;
	this.tuwen = tuwen;
});