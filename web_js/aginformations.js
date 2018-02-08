var app = angular.module("aginfor", []);
var url = "http://101.200.156.97/CAIEX-GAME/";
var game_type; //自由赛 锦标赛
var gp_id;
var game_id;
var game_state;
//var userNickName; //用户名
//var player_id = getCookie("TGamePlayers"); //用户id
//var headPicUrl; //图片地址
var TGamePlayers = getTGamePlayersCookie();
var player_id =TGamePlayers.player_id; //用户id
var headPicUrl = TGamePlayers.headPicUrl;
var playerMoney = TGamePlayers.money;

var wpage_num = 1; //自己的当前页
//var page_num = 1; //自己的当前页
var allpage_num = 1; //所有日志的当前页
var logType = 1;
var optType = 1; //主胜的赔率变化曲线图
var ticket_price = 1000;
//登录
//var userNickName =getTGamePlayersCookie().player_nickname;
var appid = 'wxd67f8fc253fdc6f3';
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
			window.location.href = "index.html";
		};
	});

	//查询用户金额
app.factory('moneySer', ['$http', '$q', '$location', function($http, $q, $location) {
	return {
		queryMoney: function() {
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
//参数
app.factory('joinGameService', ['$http', '$q', '$location', function($http, $q, $location) {
	return {
		joinGame: function() {
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
				$http({
					method: 'GET',
					url: url + "agInfoMation/goToGame.shtml?game_id=" + game_id + "&game_type=" + game_type + "&player_id=" + player_id
				}).
				success(function(data, status, headers, config) {
					deferred.resolve(data); // 声明执行成功，即http请求数据成功，可以返回数据了  
				}).
				error(function(data, status, headers, config) {
					deferred.reject(data); // 声明执行失败，即服务器返回错误  
				});
				return deferred.promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API  
			} // end query  
	};
}]);

var navbox = [{
		"url": "index.html",
		"text": "赛事游戏",
		"selected": true
	},
	/*{
	"url": "web_tab.html",
	"text": "赛事游戏",
	"selected": true
}, {
	"url": "web_news.html",
	"text": "赛事信息"
},*/
	{
		"url": "web_gameuser.html",
		"text": "个人中心"
	},
	/*, {
		"url": "web_gift.html",
		"text": "兑奖中心"
	}, {
		"url": "web_giftlist.html",
		"text": "兑奖记录"
	}, {
		"url": "#",
		"text": "关于"
	}*/
	{
		"url": "http://www.caiex.com/caiex/",
		"text": "公司介绍"
	},
	{
		"url": "web_SI.html",
		"text": "SI简介"
	}
];

app.controller("aginforctrl", function($rootScope, $location, joinGameService,moneySer) {
//  $rootScope.playerMoney=playerMoney;
	var adsUrl = $location.absUrl();
	if(adsUrl != null) {
		var adsUrls = adsUrl.split("gp_id=");
		var gameIdTypeGP = adsUrls[1].split("&game_id=");
		gp_id = gameIdTypeGP[0];
		var gameIdType = gameIdTypeGP[1].split("&game_type=");
		game_id = gameIdType[0];
		game_type = gameIdType[1];
	}
	var urlObj = this;
	var promise = joinGameService.joinGame(); // 报名锦标赛
	promise.then(function(data) {
		game_state = data.game_state;
		userNickName = data.userNickName; //用户名
		player_id = data.player_id; //用户id
		headPicUrl = data.headPicUrl; //图片地址
		urlObj.src0 = "web_img/white.png";
		urlObj.href = "web_gameuser.html";
		urlObj.src1 = headPicUrl; //headPicUrl
		urlObj.word = "赛事游戏";
		urlObj.url = "web_gameuser.html";
		urlObj.src = TGamePlayers.headPicUrl;
		urlObj.navbox = navbox;
	}, function(data) { // 处理错误 .reject  
		//alert('查询用户信息错误！');
	});
	var promises = moneySer.queryMoney(); // 查询用户金额
	promises.then(function(data) {
		if(data!=null){
			$rootScope.userMoney = data;
			$rootScope.playerMoney=data;
		}
	}, function(data) { // 处理错误 .reject  
		alert('用户金额查询错误！');
	})
});

//赛事信息 红黄牌
app.factory('matchService', ['$http', '$q', '$location', function($http, $q, $location) {
	return {
		queryMatch: function() {
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
				$http({
					method: 'GET',
					url: url + 'agInfoMation/getAllMatchData.shtml?game_id=' + game_id + "&player_id=" + player_id
				}).
				success(function(data) {
					deferred.resolve(data.data); // 声明执行成功，即http请求数据成功，可以返回数据了  
				}).
				error(function(data) {
					deferred.reject(data); // 声明执行失败，即服务器返回错误  
				});
				return deferred.promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API  
			} // end query  
	};
}]);
app.controller("infomctrl", function(matchService, $interval) { //比赛
	var match = this;
	matchInfo(match, matchService);

	//定时刷新
	$interval(function() {
		myInterval()
	}, 10000);

	function myInterval() {
		matchInfo(match, matchService)
	}
});

function matchInfo(match, matchService) {
	var promiseUser = matchService.queryMatch(); // 同步调用，获得承诺接口  
	promiseUser.then(function(data) {
		var matchState = data.matchState;
		switch(matchState.half) {
			case '未':
				match.word = "VS";
				match.wor = "未开赛";
				match.wod = matchState.match_time;
				break;
			case '完':
				match.word = matchState.score.replace("-", ":");
				match.wor = "已结束";
				match.wod = "";
				break;
			case '中':
				match.word = matchState.score.replace("-", ":");
				match.wor = "中场休息";
				match.wod = "45分钟";
				break;
			default:
				match.word = matchState.score.replace("-", ":");
				match.wor = "进行中";
				match.wod = matchState.duration_time + "分钟  " + matchState.half + "半场";
				break;
		}
		match.src = "web_img/Mexico.png";
		match.text = matchState.home_team;
		//match.wor = "即将开赛";
		//match.word = "0 : 0";
		//match.wod = "1-29  13:25";
		match.src1 = "web_img/Uruguay.png";
		match.text1 = matchState.away_team;

		//
		var matchDataList = data.matchData;
		var zhunum = 0;
		var kenum = 0;
		var pointer = new Array();
		var poiner = new Array();
		for(var i = 0; i < matchDataList.length; i++) {
			var matchData = matchDataList[i];
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
		match.pointer = pointer; //主队
		match.poiner = poiner; //客队

		match.url = "web_img/little_gray.png"; //中场点
		match.ling = "0'";
		match.jiu = "90'";
	}, function(data) { // 处理错误 .reject  
		//alert('查询赛事信息错误！');
	});
}

//本场余额
var tr = [{
	"text": "持有方案"
}, {
	"text": "买入价"
}, {
	"text": "报价"
}, {
	"text": "状态"
}, {
	"text": "操作"
}, ];

//交易记录
var record = [{
	"user": "用户名"
}, {
	"user": "操作"
}, {
	"user": "方案"
}, {
	"user": "买入价"
}, {
	"user": "卖出价"
}, ];

//查询赔率
app.factory('oddsService', ['$http', '$q', '$location', function($http, $q, $location) {
	return {
		queryOdds: function() {
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
				$http({
					method: 'GET',
					url: url + 'gameList/getMatchOdds.shtml?game_id=' + game_id
				}).
				success(function(data) {
					deferred.resolve(data.data); // 声明执行成功，即http请求数据成功，可以返回数据了  
				}).
				error(function(data) {
					deferred.reject(data); // 声明执行失败，即服务器返回错误  
				});
				return deferred.promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API  
			} // end query  
	};
}]);

//查询余额
app.factory('moneyService', ['$http', '$q', '$location', function($http, $q, $location) {
	return {
		queryMoney: function() {
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
				$http({
					method: 'GET',
					url: url + 'agInfoMation/getUserPosition.shtml?gp_id=' + gp_id + '&game_id=' + game_id + "&player_id=" + player_id
				}).
				success(function(data) {
					console.log(data.data);
					deferred.resolve(data); // 声明执行成功，即http请求数据成功，可以返回数据了  
				}).
				error(function(data) {
					deferred.reject(data); // 声明执行失败，即服务器返回错误
				});
				return deferred.promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API  
			} // end query  
	};
}]);
//卖出
app.factory('sellService', ['$http', '$q', '$location', function($http, $q, $location) {
	return {
		sellTicket: function(game_id, gpp_id, price) {
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
				$http({
					method: 'GET',
					url: url + 'agInfoMation/soldTicket.shtml?gpp_id=' + gpp_id + "&price=" + price + '&game_id=' + game_id + "&player_id=" + player_id
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
//赔率变化曲线图
app.factory('priceService', ['$http', '$q', '$location', function($http, $q, $location) {
	return {
		getAllPriHistory: function(opt) {
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
				$http({
					method: 'GET',
					url: url + 'agInfoMation/getAllPriHistory.shtml?game_id=' + game_id + "&opt=" + opt + "&player_id=" + player_id
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

//卖出价格刷新按钮
app.factory('newPriceService', ['$http', '$q', '$location', function($http, $q, $location) {
	return {
		getNewPrice: function(gpp_id) {
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
				$http({
					method: 'GET',
					url: url + 'gameList/getNewPrice.shtml?game_id=' + game_id + "&gpp_id=" + gpp_id
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

// controller - modular
app.controller("modular", function($scope, $interval, oddsService, moneyService, queryTicketService, rangeInfoService, sellService, priceService, ticketService, newPriceService, rangeInfoServiceMy) { //比赛
	$scope.showProduct = "HAD";
	$scope.logType = 1;
	var mc = this;
	queryOdds($scope, oddsService, moneyService, queryTicketService, rangeInfoService, mc, priceService, "2", rangeInfoServiceMy)

	mc.buybuy = function(opt, odds) {

		$("#buyopt").val(opt);
		$("#buyOdds").val(odds);
		$('#overlaykeep').fadeIn('fast', function() {
			$('#boxkeep').animate({
				'top': '100px'
			}, 500);
		});
	};

	//买票
	$(".surekeep").click(function() {
		var promise = ticketService.buyTicket(); //查询赔率
		promise.then(function(data) {
			if(data.result.resultCode == 1) {
				alert("即场买入成功！");
				queryOdds($scope, oddsService, moneyService, queryTicketService, rangeInfoService, mc, priceService, "2", rangeInfoServiceMy);
			} else {
				alert(data.result.resultMsg);
			}
		}, function(data) { // 处理错误 .reject  
			alert('买票错误！');
		});
	});
	//准备卖出
	mc.sel = function(gpp_id) {
		if($("tr[gppid='" + gpp_id + "'] .farrow").next().text() != "持有" && $("tr[gppid='" + gpp_id + "'] .farrow").next().text() != "售出被拒") {
			alert("彩票尚未确认为持有状态，请稍等。。。");
			return;
		}
		$("#currentSoldGppid").val(gpp_id);
		var price = $("tr[gppid='" + gpp_id + "'] .farrow").text();
		//alert(price);

		var maichu = "您将收入" + price + "金币";

		$scope.maichu = maichu;
		$scope.maichugpp_id = gpp_id;
		$('#overlaysell').fadeIn('fast', function() {
			$('#boxsell').animate({
				'top': '100px'
			}, 500);
		});

	};

	//卖出刷新价格 按钮
	mc.refreshPrice = function() {
		var gpp_id = $("#currentSoldGppid").val();
		var promise = newPriceService.getNewPrice(gpp_id); //刷新价格
		promise.then(function(data) {
			$scope.maichu = "您将收入" + data + "金币";
			$("tr[gppid='" + gpp_id + "'] .farrow").text(data);
		}, function(data) { // 处理错误 .reject  
			alert('卖出刷新价格错误！');
		});
	};
	//确认卖出
	$(".suresell").click(function() {
		var gpp_id = $("#currentSoldGppid").val();
		var price = $("tr[gppid='" + gpp_id + "'] .farrow").text();

		var promiseMoney = sellService.sellTicket(game_id, gpp_id, price); //卖出 票
		promiseMoney.then(function(data) {
				if(data.result.resultCode == 1) {
					alert("售出请求已提交！");
				} else {
					alert(data.result.resultMsg);
				}
				queryOdds($scope, oddsService, moneyService, queryTicketService, rangeInfoService, mc, priceService, "2", rangeInfoServiceMy);
			},
			function(data) { // 处理错误 .reject  
				alert('卖票错误！');
			});

	});

	//定时刷新
	$interval(function() {
		myIntervals()
	}, 10000);

	function myIntervals() {
		queryOdds($scope, oddsService, moneyService, queryTicketService, rangeInfoService, mc, priceService, "2", rangeInfoServiceMy);
	}
	//点击胜平负 赔率变化曲线图

	$scope.initClickEffect = function(opt) {
			optType = opt;
			var promisePrice = priceService.getAllPriHistory(opt); //曲线图
			promisePrice.then(function(datas) {
					if(datas.result.resultCode == 1) {
						var data = datas.data;
						var odds = new Array();
						for(var d in data) {
							if(d >= 0 && d <= 45) {
								odds[d] = parseFloat(data[d]);
							} else if(d > 45 && d < 60) {
								continue;
							} else if(d >= 60) {
								odds[d - 14] = parseFloat(data[d]);
							}
						}

						myChart.setOption({
							series: [{
								name: '购买价格',
								type: 'line',
								data: odds,
								markPoint: {
									data: [{
										type: 'max',
										name: '最大值'
									}, {
										type: 'min',
										name: '最小值'
									}]
								},
								markLine: {
									data: [{
										type: 'average',
										name: '平均值'
									}]
								}
							}]
						});
					}
				},
				function(data) { // 处理错误 .reject  
					//alert('曲线图错误！');
				});
		}
		//点击HAD HHAD
	$scope.tabtClick = function(ttype) {
		if(ttype == "HAD") {
			$scope.showProduct = "HHAD";
			queryOdds($scope, oddsService, moneyService, queryTicketService, rangeInfoService, mc, priceService, "1", rangeInfoServiceMy);
		} else {
			$scope.showProduct = "HAD";
			queryOdds($scope, oddsService, moneyService, queryTicketService, rangeInfoService, mc, priceService, "3", rangeInfoServiceMy);
		}
	}

	//点击全部日志  我的日志
	$scope.meanuClick = function(ltype) {
		if(ltype == 1) {
			logType = 2;
			$scope.logType = 2;
		} else {
			logType = 1;
			$scope.logType = 1;
		}
		queryOdds($scope, oddsService, moneyService, queryTicketService, rangeInfoService, mc, priceService, "2", rangeInfoServiceMy);
	}

	//刷新赔率
	$("#refreshOdds").click(function(event) {
		queryOdds($scope, oddsService, moneyService, queryTicketService, rangeInfoService, mc, priceService, "2", rangeInfoServiceMy);
		event.stopPropagation();
	});

	//自己日志
	$scope.wpageNumClick = function(numtype) {
			if(numtype == '-1') { //上一页
				wpage_num = wpage_num - 1;
				queryOdds($scope, oddsService, moneyService, queryTicketService, rangeInfoService, mc, priceService, "2", rangeInfoServiceMy);
			} else if(numtype == '+1') { //下一页
				wpage_num = wpage_num + 1;
				queryOdds($scope, oddsService, moneyService, queryTicketService, rangeInfoService, mc, priceService, "2", rangeInfoServiceMy);
			} else { //点击哪一页
				wpage_num = numtype * 1;

				queryOdds($scope, oddsService, moneyService, queryTicketService, rangeInfoService, mc, priceService, "2", rangeInfoServiceMy);
			}
		}
		//所有日志
	$scope.apageNumClick = function(numtype) {
		if(numtype == '-1') { //上一页
			allpage_num = allpage_num - 1;
			queryOdds($scope, oddsService, moneyService, queryTicketService, rangeInfoService, mc, priceService, "2", rangeInfoServiceMy);
		} else if(numtype == '+1') { //下一页
			allpage_num = allpage_num + 1;
			queryOdds($scope, oddsService, moneyService, queryTicketService, rangeInfoService, mc, priceService, "2", rangeInfoServiceMy);
		} else { //点击哪一页
			allpage_num = numtype * 1;

			queryOdds($scope, oddsService, moneyService, queryTicketService, rangeInfoService, mc, priceService, "2", rangeInfoServiceMy);
		}
	}

	//刷新买卖
	$("#refreshMoney").click(function() {
		queryOdds($scope, oddsService, moneyService, queryTicketService, rangeInfoService, mc, priceService, "2", rangeInfoServiceMy);
	});
});




//service - 买入
app.factory('ticketService', ['$http', '$q', '$location', function($http, $q, $location) {
	return {
		buyTicket: function() {
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
				$http({
					method: 'GET',
					url: url + 'agInfoMation/buyTicket.shtml?gp_id=' + gp_id + '&game_id=' + game_id + "&opt=" + $("#buyopt").val() + "&ticket_num=" + $(".number").text() + "&player_id=" + player_id
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

//排行榜
app.factory('rangeInfoService', ['$http', '$q', '$location', function($http, $q, $location) {
	return {
		rangeInfo: function() {
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
				$http({
					method: 'GET',
					url: url + 'agInfoMation/getRangeInfo.shtml?game_id=' + game_id + "&player_id=" + player_id
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

//排行榜
app.factory('rangeInfoServiceMy', ['$http', '$q', '$location', function($http, $q, $location) {
	return {
		rangeInfoMy: function() {
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
				$http({
					method: 'GET',
					url: url + 'agInfoMation/getRangeInfoMy.shtml?game_id=' + game_id + "&player_id=" +
						player_id
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
app.controller("maictrl", function(oddsService, moneyService, ticketService, priceService) {
	this.mai = "请确认买几张！";
	this.jian = "-";
	this.shu = "1";
	this.jia = "+";
	this.qu = "取消";
	this.ding = "确认";
	$("#modified0").click(function() {
		var numberTick = $(".number").text() * 1;
		if(numberTick < 1) {
			$(".number").html(0);
		} else if(numberTick > 1) {
			$(".number").html(numberTick - 1);
		}
	});
	$("#modified1").click(function() {
		var numberTick = $(".number").text() * 1;
		if(numberTick >= 8) {
			$(".number").html(8);
		} else {
			$(".number").html($(".number").text() * 1 + 1);
		}
	});

	//刷新
	/*var mc = this;
	this.refreshMoney = function() {
		queryOdds($scope, oddsService, moneyService, queryTicketService, mc, priceService);
	}*/
});

//查询交易记录
app.factory('queryTicketService', ['$http', '$q', '$location', function($http, $q, $location) {
	return {
		queryTicket: function(type, num) {
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
				$http({
					method: 'GET',
					url: url + 'agInfoMation/getAllOperLogs.shtml?game_id=' + game_id + "&page_num=" + num + "&type=" + type + "&game_type=2" + "&player_id=" + player_id
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

function queryOdds($scope, oddsService, moneyService, queryTicketService, rangeInfoService, mc, priceService, opt1, rangeInfoServiceMy) {
	if($scope.showProduct == "HAD") {
		$scope.tabstylea = "background:#ffd100;color:#000;font-weight:bold;";
		$scope.tabstyleb = "";
	} else {
		$scope.tabstylea = "";
		$scope.tabstyleb = "background:#ffd100;color:#000;font-weight:bold;";
	}

	if($scope.logType == 1) {
		$scope.meanustylea = "background:#ffd100;color:#000;font-weight:bold;";
		$scope.meanustyleb = "";
	} else {
		$scope.meanustylea = "";
		$scope.meanustyleb = "background:#ffd100;color:#000;font-weight:bold;";
	}
	var promise = oddsService.queryOdds(); //查询赔率
	promise.then(function(data) {
			var oddsObj = data;
			var tbody = new Array();
			var promiseMoney = moneyService.queryMoney(); //查询赔率
			promiseMoney.then(function(data) {
					if(data.data != null) {
						var userCash = (data.data.userCash * 1).toFixed(2);
						mc.money = "余额：" + userCash;
						var position = data.data.positionData;
						var game = data.data.game;
						var closeType = "售出";
						var closeStyle = "";
						for(var pos in position) {
							var state = "";
							if(position[pos].state == 1) {
								state = "持有";
							} else if(position[pos].state == 3) {
								state = "买入待确认";
							} else if(position[pos].state == 5) {
								state = "卖出待确认";
							} else if(position[pos].state == 6) {
								state = "中奖";
							} else if(position[pos].state == 7) {
								state = "未中奖";
							} else if(position[pos].state == 8) {
								state = "售出被拒";
							} else if(position[pos].state == 9) {
								state = "比赛取消";
							} else {
								continue;
							}
							var disabled = "";
							var price = "";
							var color = "";
							var buyTicketFont = "售出";
							var obj = new Object();
							if((game.match_state == 2 || game.match_state == 4) || position[pos].current_price == 0) {
								price = "停止报价";
								buyTicketFont = "关盘";
								closeType = "关盘";
								obj.style = "background-color:#B5B5B5";
								closeStyle = "background-color:#B5B5B5";
								obj.disabled = true;
							} else {
								price = position[pos].current_price;
								buyTicketFont = "售出";
								closeType = "售出";
								obj.style = "cursor: pointer;";
								closeStyle = "";
								obj.disabled = false;
							}

							obj.wo = getOpt(position[pos].chose_opt);
							obj.num = position[pos].purchase_cost;
							obj.numb = price;
							obj.wor = state;
							obj.buton = buyTicketFont;
							obj.gpp_id = position[pos].gpp_id;
							tbody[pos] = obj;
						}
						mc.tbody = tbody;
					} else {
						mc.money = "余额：0.00";
					}
					var disabledType = false;
					if(closeType == "售出") {
						disabledType = false;
					} else {
						disabledType = true;
					}
					//HAD的赔款
					var ul = [{
						"id": "HADHOPT",
						"wo": "主胜",
						"can": "赔率",
						"shuzi": oddsObj.had_H,
						"odds": oddsObj.had_H,
						"opt": "1",
						"disabled": disabledType,
						"style": closeStyle,
						//"src": "web_img/down.png",
						"wor": "购买价格",
						"peifu": (ticket_price / oddsObj.had_H).toFixed(2),
						"but": "买入"
					}, {
						"id": "HADDOPT",
						"wo": "平",
						"can": "赔率",
						"shuzi": oddsObj.had_D,
						"odds": oddsObj.had_D,
						"opt": "X",
						"disabled": disabledType,
						"style": closeStyle,
						//"src": "web_img/up.png",
						"wor": "购买价格",
						"peifu": (ticket_price / oddsObj.had_D).toFixed(2),
						"but": "买入"
					}, {
						"id": "HADAOPT",
						"wo": "主负",
						"can": "赔率",
						"shuzi": oddsObj.had_A,
						"odds": oddsObj.had_A,
						"opt": "2",
						"disabled": disabledType,
						"style": closeStyle,
						//"src": "web_img/down.png",
						"wor": "购买价格",
						"peifu": (ticket_price / oddsObj.had_A).toFixed(2),
						"but": "买入"
					}, ];
					if(oddsObj.handicap_line == null) {
						oddsObj.handicap_line = "0";
					}
					var line = (oddsObj.handicap_line * -1).toFixed(0);
					//HHAD的赔率
					var ol = [{
						"id": "HHADHOPT",
						"wo": "主胜",
						"can": "赔率",
						"shuzi": oddsObj.hhad_H,
						"odds": oddsObj.hhad_H,
						"opt": "1[" + oddsObj.handicap_line + "]",
						"disabled": disabledType,
						"style": closeStyle,
						//"src": "web_img/up.png",
						"wor": "购买价格",
						"peifu": (ticket_price / oddsObj.hhad_H).toFixed(2),
						"but": "买入"
					}, {
						"id": "HHADDOPT",
						"wo": "平",
						"can": "赔率",
						"shuzi": oddsObj.hhad_D,
						"odds": oddsObj.hhad_D,
						"opt": "X[" + oddsObj.handicap_line + "]",
						"disabled": disabledType,
						"style": closeStyle,
						//"src": "web_img/up.png",
						"wor": "购买价格",
						"peifu": (ticket_price / oddsObj.hhad_D).toFixed(2),
						"but": "买入"
					}, {
						"id": "HHADAOPT",
						"wo": "主负",
						"can": "赔率",
						"shuzi": oddsObj.hhad_A,
						"odds": oddsObj.hhad_A,
						"opt": "2[" + line + "]",
						"disabled": disabledType,
						"style": closeStyle,
						//"src": "web_img/down.png",
						"wor": "购买价格",
						"peifu": (ticket_price / oddsObj.hhad_A).toFixed(2),
						"but": "买入"
					}, ];
					mc.ol = ol;
					mc.title = "受注选项";
					mc.src = "web_img/refresh.png";
					mc.tab = "胜平负";

					mc.tabb = "让(" + oddsObj.handicap_line + ")胜平负";
					mc.ul = ul;

					mc.title1 = "持有订单";
					mc.name = userNickName;

					mc.tr = tr;

					mc.title2 = "赔率变化曲线";
					if(opt1 == "1") {
						optType = "1[" + oddsObj.handicap_line + "]";
					} else if(opt1 == "3") {
						optType = "1";
					}
					var promisePrice = priceService.getAllPriHistory(optType); //曲线图
					promisePrice.then(function(datas) {
							if(datas.result.resultCode == 1) {
								var data = datas.data;
								var odds = new Array();
								for(var d in data) {
									if(d >= 0 && d <= 45) {
										odds[d] = parseFloat(data[d]);
									} else if(d > 45 && d < 60) {
										continue;
									} else if(d >= 60) {
										odds[d - 14] = parseFloat(data[d]);
									}
								}
								myChart.setOption({
									series: [{
										name: '购买价格',
										type: 'line',
										data: odds,
										markPoint: {
											data: [{
												type: 'max',
												name: '最大值'
											}, {
												type: 'min',
												name: '最小值'
											}]
										},
										markLine: {
											data: [{
												type: 'average',
												name: '平均值'
											}]
										}
									}]
								});
							}
						},
						function(data) { // 处理错误 .reject  
							//alert('查询曲线图错误！');
						});

					mc.title3 = "排行榜";
					var ranking = new Array();
					var promiseRange = rangeInfoService.rangeInfo();
					promiseRange.then(function(data) {
						var myRang = rangeInfoServiceMy.rangeInfoMy();
						myRang.then(function(mydata) {
							//排行榜
							if(data != null) {
								for(var t = 0; t < data.length; t++) {
									var rangeObj = new Object();
									rangeObj.src = data[t].player_pic;
									rangeObj.name = data[t].player_name;
									if(t == 0) {
										rangeObj.srcr = "web_img/gold.png";
									} else if(t == 1) {
										rangeObj.srcr = "web_img/silver.png";
									} else if(t == 2) {
										rangeObj.srcr = "web_img/copper.png";
									}
									var rank = t + 1;
									rangeObj.nber = rank;
									rangeObj.src1 = "web_img/sum.png";
									rangeObj.money = (data[t].cash_money).toFixed(2);
									rangeObj.src2 = "web_img/purse.png";
									rangeObj.money1 = (data[t].ticket_money).toFixed(2);
									rangeObj.src3 = "web_img/piggy.png";
									rangeObj.money2 = (data[t].all_money).toFixed(2);
									rangeObj.word = "奖励";
									rangeObj.money3 = data[t].bonus + "币";

									if(data[t].player_name.length > 5) {
										var name = data[t].player_name.substring(0, 5);
										rangeObj.namer = name + "...";
									} else {
										rangeObj.namer = data[t].player_name;
									}
									ranking[t] = rangeObj;
									if(data[t].player_id == player_id) {
										mc.srcv = data[t].player_pic;
										mc.namer = "doing豪美";
										if(data[t].player_name.length > 5) {
											var name = data[t].player_name.substring(0, 5);
											mc.srcr = name + "...";
										} else {
											mc.srcr = data[t].player_name;
										}
										mc.nber = rank;
										mc.srcv1 = "web_img/sum.png";
										mc.money4 = (data[t].cash_money).toFixed(2);
										mc.srcv2 = "web_img/purse.png";
										mc.money1 = (data[t].ticket_money).toFixed(2);
										mc.srcv3 = "web_img/piggy.png";
										mc.money2 = (data[t].all_money).toFixed(2);
										mc.word = "奖励";
										mc.money3 = data[t].bonus + "币";
									}
								}
								if(mc.word != "奖励") {
									mc.srcv = mydata.player_pic;
									mc.namer = "doing豪美";
									if(mydata.player_name.length > 5) {
										var name = mydata.player_name.substring(0, 5);
										mc.srcr = name + "...";
									} else {
										mc.srcr = mydata.player_name;
									}

									mc.nber = mydata.ranking;
									mc.srcv1 = "web_img/sum.png";
									mc.money4 = (mydata.cash_money).toFixed(2);
									mc.srcv2 = "web_img/purse.png";
									mc.money1 = (mydata.ticket_money).toFixed(2);
									mc.srcv3 = "web_img/piggy.png";
									mc.money2 = (mydata.all_money).toFixed(2);
									mc.word = "奖励";
									mc.money3 = mydata.bonus + "币";
								}
							}
							mc.ranking = ranking;
						}, function(data) { // 处理错误 .reject  
							//alert('查询排行榜错误！');
						});
					}, function(data) { // 处理错误 .reject  
						//alert('查询排行榜错误！');
					});

					mc.title4 = "交易记录";
					mc.metab = "全部";
					mc.metab1 = "自己";
					mc.record = record;
					//mc.data = data;
					//所有的交易记录
					var pages = 8;
					var promiseLog = queryTicketService.queryTicket(1, allpage_num);
					promiseLog.then(function(data) {

						//查询所有的日志
						if(data.data != null) {

							var datar = new Array();
							for(var i = 0; i < data.data.rows.length; i++) {
								var allLog = data.data.rows[i];
								var objLog = new Object();

								if(allLog.player_nickname.length > 5) {
									var name = allLog.player_nickname.substring(0, 5);
									objLog.users = name + "...";
								} else {
									objLog.users = allLog.player_nickname;
								}

								objLog.word = allLog.operation;
								objLog.text = getOpt(allLog.opt);
								objLog.shu = allLog.buy_price;
								objLog.shuzi = allLog.sold_price;
								datar[i] = objLog;
							}

							var yema = new Array();

							var total = Math.ceil(data.data.total / pages);
							if(allpage_num > 1) {
								$scope.dyclass = true;
							} else {
								$scope.dyclass = false;
							}
							for(var i = 0; i < total; i++) {

								if(i + 1 == allpage_num) {
									$scope.currnum = allpage_num;
								}
							}
							if(total > allpage_num) {
								$scope.xyclass = true;
							} else {
								$scope.xyclass = false;
							}

							if(total > allpage_num && total-allpage_num>1) {
								$scope.currd = true;
							} else {
								$scope.currd = false;
							}
							if(total > allpage_num) {
								$scope.totalnum1=true;
								$scope.totalnum=total;
							} else {
								$scope.totalnum1=false;
							}
							if(allpage_num > 1) {
								$scope.onenum=true;
							} else {
								$scope.onenum=false;
							}
							if(allpage_num-1>1) {
								$scope.currd1 = true;
							} else {
								$scope.currd1 = false;
							}
							mc.data = datar;
						}
					}, function(data) { // 处理错误 .reject  
						//alert('查询全部日志错误！');
					});

					var promiseLog = queryTicketService.queryTicket(2, wpage_num); //查询自己日志
					promiseLog.then(function(data) {

						//查询自己的日志
						if(data.data != null) {

							var datar = new Array();
							for(var i = 0; i < data.data.rows.length; i++) {
								var allLog = data.data.rows[i];
								var objLog = new Object();

								if(allLog.player_nickname.length > 5) {
									var name = allLog.player_nickname.substring(0, 5);
									objLog.users1 = name + "...";
								} else {
									objLog.users1 = allLog.player_nickname;
								}
								objLog.word1 = allLog.operation;
								objLog.text1 = getOpt(allLog.opt);
								objLog.shu1 = allLog.buy_price;
								objLog.shuzi1 = allLog.sold_price;
								datar[i] = objLog;
							}

							var yema = new Array();

							var total = Math.ceil(data.data.total / pages);
							if(wpage_num > 1) {
								$scope.dclass = true;
							} else {
								$scope.dclass = false;
							}
							for(var i = 0; i < total; i++) {
								if(i + 1 == wpage_num) {
									$scope.currnummy = wpage_num;
								}
							}

							if(total > wpage_num) {
								$scope.xclass = true;
							} else {
								$scope.xclass = false;
							}

							if(total > wpage_num && total-wpage_num>1 ) {
								$scope.currdmy = true;
							} else {
								$scope.currdmy = false;
							}
							if(total > wpage_num) {
								$scope.totalnummy1=true;
								$scope.totalnummy=total;
							} else {
								$scope.totalnummy1=false;
							}
							if(wpage_num-1>1) {
								$scope.currdmy1 = true;
							} else {
								$scope.currdmy1 = false;
							}
							if(wpage_num > 1) {
								$scope.onenummy=true;
							} else {
								$scope.onenummy=false;
							}

							mc.datar = datar;
						}
					}, function(data) { // 处理错误 .reject  
						//alert('查询自己日志错误！');
					});

				},
				function(data) { // 处理错误 .reject  
					//alert('查询票错误！');
				});

		},
		function(data) { // 处理错误 .reject  
			//alert('查询赔率，价格错误！');
		});
}

function getOpt(optNum) {

	var opt = optNum.charAt(0);
	switch(opt) {
		case "1":
			return optNum.replace("1", "主胜");
			break;
		case "2":
			return optNum.replace("2", "主负");
			break;
		case "X":
			return optNum.replace("X", "平");
			break;
	}
}