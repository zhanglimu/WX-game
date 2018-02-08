var app = angular.module("aguser", []);
var url = "http://101.200.156.97/CAIEX-GAME/";
var dateVal; //哪一天
var zpage_num = 1; //昨天的当前页数
var jpage_num = 1; //今天的当前页数
var mpage_num = 1; //明天的当前页数
//登录
var appid = 'wxd67f8fc253fdc6f3';

var TGamePlayers = getTGamePlayersCookie();
var player_id =TGamePlayers.player_id; //用户id
var headPicUrl = TGamePlayers.headPicUrl;
//var playerMoney = TGamePlayers.money;
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
		this.Sihref = "web_SI.html";
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
			//$rootScope.playerMoney = playerMoney;
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
		"url": "index.html",
		"text": "赛事游戏"
	},
	/*{
	"url": "web_tab.html",
	"text": "赛事游戏"
}, {
	"url": "web_news.html",
	"text": "赛事信息"
},*/
	{
		"url": "web_gameuser.html",
		"text": "个人中心",
		"selected": true
	},
	/*, {
		"url": "web_gift.html",
		"text": "兑奖中心"
	}, {
		"url": "web_giftlist.html",
		"text": "兑奖记录"
	}, */
	{
		"url": "http://www.caiex.com/caiex/",
		"text": "公司介绍"
	},
	{
		"url": "web_SI.html",
		"text": "SI简介"
	}
];

var pointer = [ //主队牌
	{
		"src": "web_img/yellow.png",
		"src1": "web_img/little.png"
	}, {
		"src": "web_img/usual.png",
		"src1": "web_img/little.png"
	},
];
var poiner = [ //客队牌
	{
		"src": "web_img/penalty.png",
		"src1": "web_img/little.png"
	}, {
		"src": "web_img/red.png",
		"src1": "web_img/little.png"
	}, {
		"src": "web_img/yere.png",
		"src1": "web_img/little.png"
	},
];

var explain = [ //shuoming
	{
		"src": "web_img/yellow.png",
		"color": "黄牌"
	}, {
		"src": "web_img/red.png",
		"color": "红牌"
	}, {
		"src": "web_img/usual.png",
		"color": "普球"
	}, {
		"src": "web_img/penalty.png",
		"color": "点球"
	}, {
		"src": "web_img/yere.png",
		"color": "黄变红"
	},
];

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
app.controller("aguserctrl", function(userService,moneyService) {
	var user = this;
	var promiseUser = userService.query(); // 同步调用，获得承诺接口  获取用户信息
	promiseUser.then(function(datas) {
		if(datas==null || datas==""){
			user.src = "web_img/logo.png";//  未登录时    静默显示logo
		}else{
		var headPicUrl = datas.headPicUrl;
		user.src1 = "web_img/date.png";
		user.src = headPicUrl;
		user.navbox = navbox;
		}
	}, function(data) { // 处理错误 .reject  
		alert('查询用户头像错误！');
	});
	
//	user.src = "web_img/logo.png";//  未登录时    静默显示logo
	user.navbox = navbox;
});

//金额
app.factory('moneyService', ['$http', '$q', '$location', function($http, $q, $location) {
	return {
		getMatchInfoDate: function() {
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
				$http({
					method: 'GET',
					url: url + 'gameList/getUserMoney.shtml?play_id=' + player_id
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
app.controller("touctrl", function($scope, userService, moneyService,$rootScope) {
	dateVal = getNowFormatDate(0);
	var user = this;
    user.dateVal = dateVal;
	var promiseUser = userService.query(); // 获取用户信息
	promiseUser.then(function(datas) {
		if(datas==null || datas==""){
			user.hai = "web_img/logor.png";//  未登录时    静默显示logo
		}else{
		player_id = datas.player_id;
		user.hai = datas.headPicUrl;
		}
		var promiseMoney = moneyService.getMatchInfoDate(); // 获取盈利金额
		promiseMoney.then(function(data) {
			$rootScope.userMoney = data;
			$rootScope.playerMoney = data;
			user.jinbi = "web_img/sum.png";
			user.mon = data;

			user.auto = "连续签到7天，奖250金币。";
			user.auto0 = "连续签到一个月可获支付宝10元代金券一张";

		}, function(data) { // 处理错误 .reject  
			//alert('查询金额错误！');
		});
	}, function(data) { // 处理错误 .reject  
		//alert('查询用户信息错误！');
	});
});
app.controller("userrctrl", function($rootScope) {
//  $rootScope.playerMoney = playerMoney;
	this.zuo = "上一天";
	var checkDay=sessionStorage.getItem('userNewDay');
	var jday="";
	if(checkDay==null){
		jday = getNowFormatDate(0);
		sessionStorage.setItem('userNewDay',getNowFormatDate(0));
	}else{
		jday =checkDay;
	}
	//var jday = getNowFormatDate(0);
	var jdays = jday.split("-");
	var dayy = jdays[2].split(" ");
	$rootScope.jin = jdays[1] + "-" + dayy[0];
	
	this.ming = "下一天";
	var zjmbl = sessionStorage.getItem('userDay' + player_id);
	if(zjmbl == null) {
		$rootScope.zjmType = 'jt';
		dayTypeColor(2, $rootScope);
	} else {
		if(zjmbl == 'zt') {
			dayTypeColor(1, $rootScope);
		} else if(zjmbl == 'jt') {
			dayTypeColor(2, $rootScope);
		} else {
			dayTypeColor(3, $rootScope);
		}
		$rootScope.zjmType = zjmbl;
	}
	
});

function dayTypeColor(dayType, $rootScope) {
	if(dayType == 1) {
		sessionStorage.setItem('userDay' + player_id, "zt");
		$rootScope.zjmType = 'zt';
		$rootScope.tabstylea = "background:#ffd100;color:#000;font-weight:bold;";
		$rootScope.tabstyleb = "";
		$rootScope.tabstylec = "";
	} else if(dayType == 2) {
		sessionStorage.setItem('userDay' + player_id, "jt");
		$rootScope.zjmType = 'jt';
		$rootScope.tabstylea = "";
		$rootScope.tabstylec = "";
		$rootScope.tabstyleb = "background:#ffd100;color:#000;font-weight:bold;";
	} else {
		sessionStorage.setItem('userDay' + player_id, "mt");
		$rootScope.zjmType = 'mt';
		$rootScope.tabstylea = "";
		$rootScope.tabstyleb = "";
		$rootScope.tabstylec = "background:#ffd100;color:#000;font-weight:bold;";
	}
}
var tdtbody = [ //昨天
	{
		"fang": "方案"
	}, {
		"fang": "买入报价"
	}, {
		"fang": "卖出价"
	}, {
		"fang": "盈亏额"
	}, {
		"fang": "是否中奖/金额"
	}
];

var tdtbody1 = [{
	"fang": "排名"
}, {
	"fang": "奖金"
}];

//赛事信息  and 盈利情况
app.factory('dateDetailService', ['$http', '$q', '$location', function($http, $q, $location) {
	return {
		getMatchInfoDateDetail: function($scope, page_num) {
//			alert($scope.dateVal);
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
				$http({
					method: 'GET',
					url: url + 'webuserList/getMatchInfoDateDetail.shtml?dateVal=' + $scope.dateVal + '&page_num=' + page_num + "&player_id=" + player_id
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

//买卖记录

app.factory('buyService', ['$http', '$q', '$location', function($http, $q, $location) {
	return {
		getMatchListPosition: function(game_id, page_num, game_type) {
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
				$http({
					method: 'GET',
					url: url + 'webuserList/getMatchListPosition.shtml?game_id=' + game_id + "&page_num=" + page_num + "&game_type=" + game_type + "&player_id=" + player_id
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
app.controller("zuoctrl", function($rootScope,$scope, $http, dateDetailService, buyService) {
	var checkDays=sessionStorage.getItem('userNewDay');
	if(checkDays==null){
		dateVal = getNowFormatDate(-1);
	}else{
		var arr1=checkDays.split("-");
		dateVal = getNowStrDate(new Date(arr1[0],parseInt(arr1[1])-1,arr1[2]),-1);
	}
	
	$scope.dateVal = dateVal;
	var detail = this;
	//$scope.zjmType = 'zt';	
	var totalGames = new Array();
	matchdetail($scope, $http, dateDetailService, buyService, detail, 1, totalGames);
	$scope.gameFree = function(game_type, game_id) {
		if(game_type == 1) { //自由赛
			zpage_num = 1;
			pageCurr($scope, $http, 1, 1, game_id);
			for(var i = 0; i < totalGames.length; i++) {
				if(totalGames[i] == game_id) {
					$scope.userrctrls[i].isclickGame = true;
					$scope.userrctrls[i].type = true;
					sessionStorage.setItem('game_type_zuo' + game_id, 1); //1表示自由赛  2表示锦标赛
				}
			}

		} else { //锦标赛
			zpage_num = 1;
			pageCurr($scope, $http, 1, 2, game_id);
			for(var i = 0; i < totalGames.length; i++) {
				if(totalGames[i] == game_id) {
					$scope.userrctrls[i].isclickGame = false;
					$scope.userrctrls[i].type = false;
					sessionStorage.setItem('game_type_zuo' + game_id, 2); //1表示自由赛  2表示锦标赛
				}
			}
			pageCurr($scope, $http, 1, 2, game_id);
		}

	}
	$scope.togameHTML = function(isclickGame, game_id, gpFree_id, gpGame_id) {
		if(isclickGame == true) { //自由赛
			if(gpFree_id==null){
				alert("您没有报名自由赛！");
				return false;
			}
			window.location.href = "web_information.html?gp_id=" + gpFree_id + "&game_id=" + game_id + "&game_type=" + 1;
		} else { //锦标赛
			if(gpGame_id==null){
				alert("您没有报名锦标赛！");
				return false;
			}
			window.location.href = "web_informations.html?gp_id=" + gpGame_id + "&game_id=" + game_id + "&game_type=" + 2;
		}
	}
	//点击昨天
	$rootScope.dayclickzuo = function() {
		dayTypeColor(1, $rootScope);
		var checkDay=sessionStorage.getItem('userNewDay');//选中的日期
		var arr1=checkDay.split("-");
		$scope.dateVal = getNowStrDate(new Date(arr1[0],parseInt(arr1[1])-1,arr1[2]),-1);
		matchdetail($scope, $http, dateDetailService, buyService, detail, 1, totalGames);
	}
});

function matchdetail($scope, $http, dateDetailService, buyService, detail, game_type, totalGames) {
	var objMatchs = new Array();
	var promiseDetail = dateDetailService.getMatchInfoDateDetail($scope, zpage_num); //根据时间查询
	promiseDetail.then(function(data) {
		var matchInfoDateDetails = data.data;
		for(var i = 0; i < matchInfoDateDetails.length; i++) {
			var objMatch = new Object();
			var matchInfoList = matchInfoDateDetails[i];
			objMatch.tdtbody = tdtbody;
			objMatch.tdtbody1 = tdtbody1;
			objMatch.src = "web_img/Mexico.png";
			objMatch.text = matchInfoList.w500.home_team;

			var half = matchInfoList.w500.half;
			var score = matchInfoList.w500.score;
			var duration_time = matchInfoList.w500.duration_time;

			totalGames[i] = matchInfoList.game_id;
			objMatch.game_id = matchInfoList.game_id;

			objMatch.gpFree_id = matchInfoList.gpFree_id;
			objMatch.gpGame_id = matchInfoList.gpGame_id;
			switch(half) {
				case '未':
					objMatch.word = "--:--";
					objMatch.wor = "未开赛";
					objMatch.wod = matchInfoList.w500.match_time;
					break;
				case '完':
					objMatch.word = score.replace("-", ":");
					objMatch.wor = "已结束";
					objMatch.wod = "";
					break;
				case '中':
					objMatch.word = score.replace("-", ":");
					objMatch.wor = "中场休息";
					objMatch.wod = "45分钟";
					break;
				default:
					objMatch.word = score.replace("-", ":");
					objMatch.wor = "进行中";

					objMatch.wod = duration_time + "分钟  " + half + "半场";
					break;
			}
			objMatch.src1 = "web_img/Uruguay.png";
			objMatch.text1 = matchInfoList.w500.away_team;
			objMatch.url = "web_img/little_gray.png"; //中场点

			var matchDataList = matchInfoList.keyEvents;
			var zhunum = 0;
			var kenum = 0;
			var pointer = new Array();
			var poiner = new Array();
			for(var n = 0; n < matchDataList.length; n++) {
				var matchData = matchDataList[n];
				var per = matchData.time_minute * 100 / 95;
				var perPic = per - 0.4;
				if(matchData.team_type == 1) { //主队
					var zhuObj = new Object();
					switch(matchData.event_type) {

						case 1:
							//进球
							zhuObj.src = "web_img/usual.png";
							zhuObj.src1 = "web_img/little.png";
							zhuObj.tit = matchData.time_minute + "分钟" + "主队" + matchData.relative_player + "进球";
							break;
						case 2:
							//点球
							zhuObj.src = "web_img/penalty.png";
							zhuObj.src1 = "web_img/little.png";
							zhuObj.tit = matchData.time_minute + "分钟" + "主队" + matchData.relative_player + "点球";
							break;
						case 5:
							//黄牌
							zhuObj.src = "web_img/yellow.png";
							zhuObj.src1 = "web_img/little.png";
							zhuObj.tit = matchData.time_minute + "分钟" + "主队" + matchData.relative_player + "黄牌";
							break;
						case 6:
							//红牌
							zhuObj.src = "web_img/red.png";
							zhuObj.src1 = "web_img/little.png";
							zhuObj.tit = matchData.time_minute + "分钟" + "主队" + matchData.relative_player + "红牌";
							break;
						case 7:
							//两黄
							zhuObj.src = "web_img/yere.png";
							zhuObj.src1 = "web_img/little.png";
							zhuObj.tit = matchData.time_minute + "分钟" + "主队" + matchData.relative_player + "两黄";
							break;
					}
					zhuObj.perPic = "position: absolute;top: -22px; left:" + perPic + "%;";
					zhuObj.per = "position: absolute;top: -2px; left:" + per + "%;";

					pointer[zhunum] = zhuObj;
					zhunum++;
				} else if(matchData.team_type == 2) { //客队

					var keObj = new Object();
					switch(matchData.event_type) {
						case 1:
							//进球
							keObj.src = "web_img/usual.png";
							keObj.src1 = "web_img/little.png";
							keObj.tit = matchData.time_minute + "分钟" + "客队" + matchData.relative_player + "进球";
							break;
						case 2:
							//点球
							keObj.src = "web_img/penalty.png";
							keObj.src1 = "web_img/little.png";
							keObj.tit = matchData.time_minute + "分钟" + "客队" + matchData.relative_player + "点球";
							break;
						case 5:
							//黄牌
							keObj.src = "web_img/yellow.png";
							keObj.src1 = "web_img/little.png";
							keObj.tit = matchData.time_minute + "分钟" + "客队" + matchData.relative_player + "黄牌";
							break;
						case 6:
							//红牌
							keObj.src = "web_img/red.png";
							keObj.src1 = "web_img/little.png";
							keObj.tit = matchData.time_minute + "分钟" + "客队" + matchData.relative_player + "红牌";
							break;
						case 7:
							//两黄
							keObj.src = "web_img/yere.png";
							keObj.src1 = "web_img/little.png";
							keObj.tit = matchData.time_minute + "分钟" + "客队" + matchData.relative_player + "两黄";
							break;
					}
					keObj.perPic = "position: absolute;top: 10px; left:" + perPic + "%;";
					keObj.per = "position: absolute;top: -2px; left:" + per + "%;";

					poiner[kenum] = keObj;
					kenum++;
				}
			}
			objMatch.pointer = pointer; //主队
			objMatch.poiner = poiner; //客队
			objMatch.ling = "0'";
			objMatch.jiu = "90'";
			objMatch.explain = explain; //shuoming

			objMatch.zi = "自由赛";
			objMatch.jin = "锦标赛";
			//昨天自由赛锦标赛cookie
			var zijin = sessionStorage.getItem('game_type_zuo' + matchInfoList.game_id);
			var cooyestd = null;
			if(zijin == null) {
				cooyestd = 2;
				objMatch.isclickGame = false;
				objMatch.type = false;
			} else {
				cooyestd = zijin;
				if(cooyestd == "1") {
					objMatch.isclickGame = true;
					objMatch.type = true;
				} else if(cooyestd == "2") {
					objMatch.isclickGame = false;
					objMatch.type = false;
				}

			}
			objMatch.game_type = cooyestd;
			objMatchs[i] = objMatch;
			pageCurr($scope, $http, zpage_num, cooyestd, matchInfoList.game_id);

		}
		$scope.userrctrls = objMatchs;
	}, function(data) { // 处理错误 .reject  
		//alert('查询昨天赛事信息错误！');
	});
}

function pageCurr($scope, $http, mypage_num, game_type, game_id) {
	$http.get(url + 'webuserList/getMatchListPosition.shtml?game_id=' + game_id + "&page_num=" + mypage_num + "&game_type=" + game_type + "&player_id=" + player_id)
		.success(function(response) {
			if(response.data != null) {

				var data = response.data.rows;

				var totalPages = [];
				if(Math.ceil(response.data.total / 3) > 0) {
					for(var i = 0; i < Math.ceil(response.data.total / 3); i++) {
						totalPages[i] = i + 1;
					}
				}

				$scope.totalPages = totalPages;
				createPageData(mypage_num, Math.ceil(response.data.total / 3), game_id + 'page', "AllLogs", game_id, game_type);
				totalPage = Math.ceil(response.data.total / 3);

				if(game_type == 1) {
					var html = '<tr class="first">' +
						'<td>方案</td>' +
						'<td>买入价</td>' +
						'<td>卖出价</td>' +
						'<td>盈亏额</td>' +
						'<td>是否中奖/金额</td>' +
						'</tr>';
					for(var i = 0; i < data.length; i++) {
						var price = null;
						if(data[i].state == 6) {
							price = data[i].current_price;
						} else {
							price = "-";
						}
						html = html + '<tr><td>' + data[i].chose_opt + '</td>' +
							'<td class="hong">' + data[i].purchase_cost + '</td>' +
							'<td class="lu">' + data[i].sold_price + '</td>' +
							'<td class="lastup">' + data[i].profit + '</td>' +
							'<td>' + data[i].stateName + '/' + price + '</td>' +
							'</tr> ';
					}
					$("#" + game_id).html(html);
				} else {
					var html = '<tr class="first">' +
						'<td>排名</td>' +
						'<td>奖金</td>' +
						'</tr>';
					for(var i = 0; i < data.length; i++) {
						html = html + '<tr>' +
							'<td>' + data[i].rank + '</td>' +
							'<td>' + data[i].bonus + '金币</td>' +
							'</tr>';
					}
					$("#" + game_id + "s").html(html);

				}
				//$scope.matchInfoLogs=response.data.rows;

				/* pageNum 当前页 ， total 总页数  */
				function createPageData(pageNum, total, type, method, game_id, game_type) {
					if(total == 0) {
						$('#' + type).html('');
					} else {

						var totalPage = total;
						var npageNum = pageNum - 1;
						var param = npageNum + "k" + game_id;
						var jpageNum = pageNum + 1;
						var paramj = jpageNum + "m" + game_id;
						var param1 = "1f" + game_id;
						var parama = totalPage + "n" + game_id;
						var previousPage = '<a id=' + param + ' > < </a>';
						var nextPage = '<a id=' + paramj + '> > </a>';
						var pageFirst = '<a id=' + param1 + '>1</a>';
						var pageLast = '<a id=' + parama + '>' + totalPage + '</a>';
						var currentPage = '';
						var betweenFirst = '...';
						var betweenLast = '...';
						if(pageNum == 1) {
							previousPage = '';

							pageFirst = '<span class="current" style="background-color: #999">1</span>';

						} else if(pageNum == totalPage) {
							nextPage = '';

							pageLast = '<span class="current" style="background-color: #999">' + totalPage + '</span>';

						} else {
							currentPage = '<span class="current" style="background-color: #999">' + pageNum + '</span>';
						}

						if(totalPage == 1) {
							$('#' + type).html('<span class="current">1</span>');
						} else if(totalPage != 0) {
							if(pageNum - 1 <= 1) {
								betweenFirst = '';
							}

							if(totalPage - pageNum <= 1) {
								betweenLast = '';
							}
							$('#' + type).html(previousPage + pageFirst + betweenFirst + currentPage + betweenLast + pageLast + nextPage);
							$("#" + param).click(function() {
								mypage_num = mypage_num - 1;
								pageCurr($scope, $http, mypage_num, game_type, game_id);
							});
							$("#" + paramj).click(function() {
								mypage_num = mypage_num + 1;
								pageCurr($scope, $http, mypage_num, game_type, game_id);
							});
							$("#" + param1).click(function() {
								mypage_num = 1;
								pageCurr($scope, $http, mypage_num, game_type, game_id);
							});
							$("#" + parama).click(function() {
								mypage_num = totalPage;
								pageCurr($scope, $http, mypage_num, game_type, game_id);
							});
						}
					}
				}
			}
		});

}
app.controller("jinctrl", function($rootScope,$scope, $interval, $http, dateDetailService, buyService) {
	//$scope.zjmType = 'jt';
	var detail = this;
	var totalGames = new Array();
	//定时刷新
	$interval(function() {
		var userDate = sessionStorage.getItem('userClickDate');
		if(userDate != null && userDate != $scope.dateVal) {
				sessionStorage.setItem('userDay' + player_id, "jt");
				$rootScope.zjmType = 'jt';
				$rootScope.tabstylea = "";
				$rootScope.tabstylec = "";
				$rootScope.tabstyleb = "border:1px #55b5ad solid;background:#ffd100;color:#000;font-weight:bold;";
				$scope.dateVal = userDate;
				matchdetailTody($scope, $http, dateDetailService, buyService, detail, 1, totalGames);
				var userDates=userDate.split("-");
				$rootScope.jin=userDates[1]+"-"+userDates[2];
				sessionStorage.setItem('userNewDay',userDate);
		}

	}, 1000);
	var checkDay=sessionStorage.getItem('userNewDay');
	if(checkDay==null){
		dateVal = getNowFormatDate(0);
	}else{
		dateVal =checkDay;
	}
	
	$scope.dateVal = dateVal;
	matchdetailTody($scope, $http, dateDetailService, buyService, detail, 1, totalGames);
	$scope.gameFree = function(game_type, game_id) {
		if(game_type == 1) { //自由赛
			jpage_num = 1;
			pageCurr($scope, $http, 1, 1, game_id);
			for(var i = 0; i < totalGames.length; i++) {
				if(totalGames[i] == game_id) {
					$scope.jinctrls[i].isclickGame = true;
					$scope.jinctrls[i].type = true;
					sessionStorage.setItem('game_type_jin' + game_id, 1);
				}
			}

		} else { //锦标赛
			jpage_num = 1;
			for(var i = 0; i < totalGames.length; i++) {
				if(totalGames[i] == game_id) {
					$scope.jinctrls[i].isclickGame = false;
					$scope.jinctrls[i].type = false;
					sessionStorage.setItem('game_type_jin' + game_id, 2);
				}
			}
			pageCurr($scope, $http, 1, 2, game_id);
		}

	}

	$scope.togameHTML = function(isclickGame, game_id, gpFree_id, gpGame_id) {
		if(isclickGame == true) { //自由赛
			if(gpFree_id==null){
				alert("您没有报名自由赛！");
				return false;
			}
			window.location.href = "web_information.html?gp_id=" + gpFree_id + "&game_id=" + game_id + "&game_type=" + 1;
		} else { //锦标赛
			if(gpGame_id==null){
				alert("您没有报名锦标赛！");
				return false;
			}
			window.location.href = "web_informations.html?gp_id=" + gpGame_id + "&game_id=" + game_id + "&game_type=" + 2;
		}
	}

	//点击今天
	$rootScope.dayclickjin = function() {
		dayTypeColor(2, $rootScope);
		var checkDay=sessionStorage.getItem('userNewDay');//选中的日期
		var arr1=checkDay.split("-");
		$scope.dateVal = getNowStrDate(new Date(arr1[0],parseInt(arr1[1])-1,arr1[2]),0);
		matchdetailTody($scope, $http, dateDetailService, buyService, detail, 1, totalGames);
	}
});

function matchdetailTody($scope, $http, dateDetailService, buyService, detail, game_type, totalGames) {
	var objMatchs = new Array();

	var promiseDetail = dateDetailService.getMatchInfoDateDetail($scope, jpage_num); //根据时间查询
	promiseDetail.then(function(data) {
		var matchInfoDateDetails = data.data;
		for(var i = 0; i < matchInfoDateDetails.length; i++) {
			var objMatch = new Object();
			var matchInfoList = matchInfoDateDetails[i];
			objMatch.tdtbodya = tdtbody;
			objMatch.tdtbody1a = tdtbody1;
			objMatch.src1 = "web_img/Mexico.png";
			objMatch.tex1 = matchInfoList.w500.home_team;
			var half = matchInfoList.w500.half;
			var score = matchInfoList.w500.score;
			var duration_time = matchInfoList.w500.duration_time;

			totalGames[i] = matchInfoList.game_id;
			objMatch.game_id = matchInfoList.game_id;
			objMatch.gpFree_id = matchInfoList.gpFree_id;
			objMatch.gpGame_id = matchInfoList.gpGame_id;

			switch(half) {
				case '未':
					objMatch.word1 = "--:--";
					objMatch.wor1 = "未开赛";
					objMatch.wod1 = matchInfoList.w500.match_time;
					break;
				case '完':
					objMatch.word1 = score.replace("-", ":");
					objMatch.wor1 = "已结束";
					objMatch.wod1 = "";
					break;
				case '中':
					objMatch.word1 = score.replace("-", ":");
					objMatch.wor1 = "中场休息";
					objMatch.wod1 = "45分钟";
					break;
				default:
					objMatch.word1 = score.replace("-", ":");
					objMatch.wor1 = "进行中";

					objMatch.wod1 = duration_time + "分钟  " + half + "半场";
					break;
			}

			objMatch.src11 = "web_img/Uruguay.png";
			objMatch.text11 = matchInfoList.w500.away_team;
			objMatch.url1 = "web_img/little_gray.png"; //中场点

			var matchDataList = matchInfoList.keyEvents;
			var zhunum = 0;
			var kenum = 0;
			var pointer = new Array();
			var poiner = new Array();
			for(var j = 0; j < matchDataList.length; j++) {
				var matchData = matchDataList[j];
				var per = matchData.time_minute * 100 / 95;
				var perPic = per - 0.4;
				if(matchData.team_type == 1) { //主队
					var zhuObj = new Object();
					switch(matchData.event_type) {

						case 1:
							//进球
							zhuObj.src = "web_img/usual.png";
							zhuObj.src1 = "web_img/little.png";
							zhuObj.tit = matchData.time_minute + "分钟" + "主队" + matchData.relative_player + "进球";
							break;
						case 2:
							//点球
							zhuObj.src = "web_img/penalty.png";
							zhuObj.src1 = "web_img/little.png";
							zhuObj.tit = matchData.time_minute + "分钟" + "主队" + matchData.relative_player + "点球";
							break;
						case 5:
							//黄牌
							zhuObj.src = "web_img/yellow.png";
							zhuObj.src1 = "web_img/little.png";
							zhuObj.tit = matchData.time_minute + "分钟" + "主队" + matchData.relative_player + "黄牌";
							break;
						case 6:
							//红牌
							zhuObj.src = "web_img/red.png";
							zhuObj.src1 = "web_img/little.png";
							zhuObj.tit = matchData.time_minute + "分钟" + "主队" + matchData.relative_player + "红牌";
							break;
						case 7:
							//两黄
							zhuObj.src = "web_img/yere.png";
							zhuObj.src1 = "web_img/little.png";
							zhuObj.tit = matchData.time_minute + "分钟" + "主队" + matchData.relative_player + "两黄";
							break;
					}
					zhuObj.perPic = "position: absolute;top: -22px; left:" + perPic + "%;";
					zhuObj.per = "position: absolute;top: -2px; left:" + per + "%;";

					pointer[zhunum] = zhuObj;
					zhunum++;
				} else if(matchData.team_type == 2) { //客队

					var keObj = new Object();
					switch(matchData.event_type) {
						case 1:
							//进球
							keObj.src = "web_img/usual.png";
							keObj.src1 = "web_img/little.png";
							keObj.tit = matchData.time_minute + "分钟" + "客队" + matchData.relative_player + "进球";
							break;
						case 2:
							//点球
							keObj.src = "web_img/penalty.png";
							keObj.src1 = "web_img/little.png";
							keObj.tit = matchData.time_minute + "分钟" + "客队" + matchData.relative_player + "点球";
							break;
						case 5:
							//黄牌
							keObj.src = "web_img/yellow.png";
							keObj.src1 = "web_img/little.png";
							keObj.tit = matchData.time_minute + "分钟" + "客队" + matchData.relative_player + "黄牌";
							break;
						case 6:
							//红牌
							keObj.src = "web_img/red.png";
							keObj.src1 = "web_img/little.png";
							keObj.tit = matchData.time_minute + "分钟" + "客队" + matchData.relative_player + "红牌";
							break;
						case 7:
							//两黄
							keObj.src = "web_img/yere.png";
							keObj.src1 = "web_img/little.png";
							keObj.tit = matchData.time_minute + "分钟" + "客队" + matchData.relative_player + "两黄";
							break;
					}
					keObj.perPic = "position: absolute;top: 10px; left:" + perPic + "%;";
					keObj.per = "position: absolute;top: -2px; left:" + per + "%;";

					poiner[kenum] = keObj;
					kenum++;
				}
			}
			objMatch.pointer = pointer; //主队
			objMatch.poiner = poiner; //客队
			objMatch.ling1 = "0'";
			objMatch.jiu1 = "90'";
			objMatch.explain = explain; //shuoming

			objMatch.zi = "自由赛";
			objMatch.jin = "锦标赛";
			//今天自由赛锦标赛cookie
			var today = sessionStorage.getItem('game_type_jin' + matchInfoList.game_id);
			var cootoday = null;
			if(today == null) {
				cootoday = 2;
				objMatch.isclickGame = false;
				objMatch.type = false;
			} else {
				cootoday = today;
				if(cootoday == "1") {
					objMatch.isclickGame = true;
					objMatch.type = true;
				} else if(cootoday == "2") {
					objMatch.isclickGame = false;
					objMatch.type = false;
				}
			}
			objMatch.game_type = cootoday;
			objMatchs[i] = objMatch;
			pageCurr($scope, $http, jpage_num, cootoday, matchInfoList.game_id);
		}
		$scope.jinctrls = objMatchs;
	}, function(data) { // 处理错误 .reject  
		//alert('查询今天赛事信息错误！');
	});
}
var tdtbodyb = [ //明天
	{
		"fang": "方案"
	}, {
		"fang": "买入报价"
	}, {
		"fang": "卖出价"
	}, {
		"fang": "盈亏额"
	}, {
		"fang": "是否中奖/金额"
	}
];

app.controller("mingctrl", function($rootScope,$scope, $http, dateDetailService, buyService) {
	//$scope.zjmType = 'mt';
	var checkDays=sessionStorage.getItem('userNewDay');
	if(checkDays==null){
		dateVal = getNowFormatDate(1);
	}else{
		var arr1=checkDays.split("-");
		dateVal = getNowStrDate(new Date(arr1[0],parseInt(arr1[1])-1,arr1[2]),1);
	}
	$scope.dateVal = dateVal;
	var detail = this;
	var totalGames = new Array();
	matchdetailMing($scope, $http, dateDetailService, buyService, detail, 1, totalGames);
	$scope.gameFree = function(game_type, game_id) {
		if(game_type == 1) { //自由赛
			zpage_num = 1;
			pageCurr($scope, $http, 1, 1, game_id);
			for(var i = 0; i < totalGames.length; i++) {
				if(totalGames[i] == game_id) {
					$scope.mingctrls[i].isclickGame = true;
					$scope.mingctrls[i].type = true;
					sessionStorage.setItem('game_type_ming' + game_id, 1);
				}
			}

		} else { //锦标赛
			zpage_num = 1;
			for(var i = 0; i < totalGames.length; i++) {
				if(totalGames[i] == game_id) {
					$scope.mingctrls[i].isclickGame = false;
					$scope.mingctrls[i].type = false;
					sessionStorage.setItem('game_type_ming' + game_id, 2);
				}
			}
			pageCurr($scope, $http, 1, 2, game_id);
		}

	}
	$scope.togameHTML = function(isclickGame, game_id, gpFree_id, gpGame_id) {
		if(isclickGame == true) { //自由赛
			if(gpFree_id==null){
				alert("您没有报名自由赛！");
				return false;
			}
			window.location.href = "web_information.html?gp_id=" + gpFree_id + "&game_id=" + game_id + "&game_type=" + 1;
		} else { //锦标赛
			if(gpGame_id==null){
				alert("您没有报名锦标赛！");
				return false;
			}
			window.location.href = "web_informations.html?gp_id=" + gpGame_id + "&game_id=" + game_id + "&game_type=" + 2;
		}
	}
	//点击明天
	$rootScope.dayclickming = function() {
		dayTypeColor(3, $rootScope);
		var checkDay=sessionStorage.getItem('userNewDay');//选中的日期
		var arr1=checkDay.split("-");
		$scope.dateVal = getNowStrDate(new Date(arr1[0],parseInt(arr1[1])-1,arr1[2]),1);
		matchdetailMing($scope, $http, dateDetailService, buyService, detail, 1, totalGames);
	}
});

function matchdetailMing($scope, $http, dateDetailService, buyService, detail, game_type, totalGames) {
	var objMatchs = new Array();

	var promiseDetail = dateDetailService.getMatchInfoDateDetail($scope, mpage_num); //根据时间查询
	promiseDetail.then(function(data) {

		var matchInfoDateDetails = data.data;

		for(var i = 0; i < matchInfoDateDetails.length; i++) {
			var objMatch = new Object();
			var matchInfoList = matchInfoDateDetails[i];
			objMatch.tdtbodyb = tdtbody;
			objMatch.tdtbody1b = tdtbody1;
			objMatch.src2 = "web_img/Mexico.png";
			objMatch.text2 = matchInfoList.w500.home_team;
			var half = matchInfoList.w500.half;
			var score = matchInfoList.w500.score;
			var duration_time = matchInfoList.w500.duration_time;

			switch(half) {
				case '未':
					objMatch.word2 = "--:--";
					objMatch.wor2 = "未开赛";
					objMatch.wod2 = matchInfoList.w500.match_time;
					break;
				case '完':
					objMatch.word2 = score.replace("-", ":");
					objMatch.wor2 = "已结束";
					objMatch.wod2 = "";
					break;
				case '中':
					objMatch.word2 = score.replace("-", ":");
					objMatch.wor2 = "中场休息";
					objMatch.wod1 = "45分钟";
					break;
				default:
					objMatch.word2 = score.replace("-", ":");
					objMatch.wor2 = "进行中";

					objMatch.wod2 = duration_time + "分钟  " + half + "半场";
					break;
			}

			objMatch.src12 = "web_img/Uruguay.png";
			objMatch.text12 = matchInfoList.w500.away_team;
			objMatch.url2 = "web_img/little_gray.png"; //中场点
			objMatch.isclickGame = true;
			totalGames[i] = matchInfoList.game_id;
			objMatch.game_id = matchInfoList.game_id;
			objMatch.type = true;
			objMatch.gpFree_id = matchInfoList.gpFree_id;
			objMatch.gpGame_id = matchInfoList.gpGame_id;
			var matchDataList = matchInfoList.keyEvents;
			var zhunum = 0;
			var kenum = 0;
			var pointer = new Array();
			var poiner = new Array();
			for(var j = 0; j < matchDataList.length; j++) {
				var matchData = matchDataList[j];
				var per = matchData.time_minute * 100 / 95;
				var perPic = per - 0.4;
				if(matchData.team_type == 1) { //主队
					var zhuObj = new Object();
					switch(matchData.event_type) {

						case 1:
							//进球
							zhuObj.src = "web_img/usual.png";
							zhuObj.src1 = "web_img/little.png";
							zhuObj.tit = matchData.time_minute + "分钟" + "主队" + matchData.relative_player + "进球";
							break;
						case 2:
							//点球
							zhuObj.src = "web_img/penalty.png";
							zhuObj.src1 = "web_img/little.png";
							zhuObj.tit = matchData.time_minute + "分钟" + "主队" + matchData.relative_player + "点球";
							break;
						case 5:
							//黄牌
							zhuObj.src = "web_img/yellow.png";
							zhuObj.src1 = "web_img/little.png";
							zhuObj.tit = matchData.time_minute + "分钟" + "主队" + matchData.relative_player + "黄牌";
							break;
						case 6:
							//红牌
							zhuObj.src = "web_img/red.png";
							zhuObj.src1 = "web_img/little.png";
							zhuObj.tit = matchData.time_minute + "分钟" + "主队" + matchData.relative_player + "红牌";
							break;
						case 7:
							//两黄
							zhuObj.src = "web_img/yere.png";
							zhuObj.src1 = "web_img/little.png";
							zhuObj.tit = matchData.time_minute + "分钟" + "主队" + matchData.relative_player + "两黄";
							break;
					}
					zhuObj.perPic = "position: absolute;top: -22px; left:" + perPic + "%;";
					zhuObj.per = "position: absolute;top: -2px; left:" + per + "%;";

					pointer[zhunum] = zhuObj;
					zhunum++;
				} else if(matchData.team_type == 2) { //客队

					var keObj = new Object();
					switch(matchData.event_type) {
						case 1:
							//进球
							keObj.src = "web_img/usual.png";
							keObj.src1 = "web_img/little.png";
							keObj.tit = matchData.time_minute + "分钟" + "客队" + matchData.relative_player + "进球";
							break;
						case 2:
							//点球
							keObj.src = "web_img/penalty.png";
							keObj.src1 = "web_img/little.png";
							keObj.tit = matchData.time_minute + "分钟" + "客队" + matchData.relative_player + "点球";
							break;
						case 5:
							//黄牌
							keObj.src = "web_img/yellow.png";
							keObj.src1 = "web_img/little.png";
							keObj.tit = matchData.time_minute + "分钟" + "客队" + matchData.relative_player + "黄牌";
							break;
						case 6:
							//红牌
							keObj.src = "web_img/red.png";
							keObj.src1 = "web_img/little.png";
							keObj.tit = matchData.time_minute + "分钟" + "客队" + matchData.relative_player + "红牌";
							break;
						case 7:
							//两黄
							keObj.src = "web_img/yere.png";
							keObj.src1 = "web_img/little.png";
							keObj.tit = matchData.time_minute + "分钟" + "客队" + matchData.relative_player + "两黄";
							break;
					}
					keObj.perPic = "position: absolute;top: 10px; left:" + perPic + "%;";
					keObj.per = "position: absolute;top: -2px; left:" + per + "%;";

					poiner[kenum] = keObj;
					kenum++;
				}
			}
			objMatch.pointer = pointer; //主队
			objMatch.poiner = poiner; //客队
			objMatch.ling2 = "0'";
			objMatch.jiu2 = "90'";
			objMatch.explain = explain; //shuoming

			objMatch.zi = "自由赛";
			objMatch.jin = "锦标赛";

			//今天自由赛锦标赛cookie
			var tomo = sessionStorage.getItem('game_type_ming' + matchInfoList.game_id);
			var cootomo = null;
			if(tomo == null) {
				cootomo = 2;
				objMatch.isclickGame = false;
				objMatch.type = false;
			} else {
				cootomo = tomo;
				if(cootomo == "1") {
					objMatch.isclickGame = true;
					objMatch.type = true;
				} else if(cootomo == "2") {
					objMatch.isclickGame = false;
					objMatch.type = false;
				}
			}
			objMatch.game_type = cootomo;
			objMatchs[i] = objMatch;
			pageCurr($scope, $http, mpage_num, cootomo, matchInfoList.game_id);
		}
		$scope.mingctrls = objMatchs;
	}, function(data) { // 处理错误 .reject  
		//alert('查询明天赛事信息错误！');
	});
}