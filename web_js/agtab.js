var app = angular.module("agtab", ['angular-md5']);
var date = "";
var url = "http://101.200.156.97/CAIEX-GAME/";
//var url = "https://private-14388b-cxsidemo1.apiary-mock.com/";
var urls = "http://www.caiex.com:12317/CaiexOpenNewsApi/";
var payout_type = "1"; //默认1 新赛事  
var player_id = ''; //用户id
var headPicUrl = ''; //用户头像
////var game_type = "1";
var appCode = "caiexnews";
var security = "876eba451bb4280f864a24db7611bd79";
localStorage.setItem('lSKey',security);
//document.cookie = "TGamePlayers=\"{\\\"birthday\\\":1466471918000,\\\"city\\\":\\\"Chaoyang\\\",\\\"headPicUrl\\\":\\\"http://wx.qlogo.cn/mmopen/6d5gd7VZYlTpOFaI0ELdicff98vstSbFrdzYZDkIFlMtlo1F9YvC5Jndq9AxSFklyE0N807VAbuHDYJgT0JzsVjaIAlsicm8HY/0\\\",\\\"money\\\":9000.00,\\\"player_id\\\":98,\\\"player_nickname\\\":\\\"  \\\",\\\"sex\\\":1,\\\"union_id\\\":\\\"oa7AjwpT7TPx3ASGIZBPpn4ZndZY\\\",\\\"update_time\\\":1480024384000}\"";

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
		this.srcc = "web_img/logoSI.png";
		this.src0 = "web_img/logo.png";
		this.Sihref = "web_SI.html";
//		this.header = "web_img/0.jpg";
// ============ 初始化数据 ====================
	//点击关闭登录二维码页面
	$('.theme-poptit .close').click(function() {
		$('.theme-popover-mask').fadeOut(100);
		$('.theme-popover').slideUp(200);
	});
	
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

app.factory('agService', ['$http', '$q', '$location', function($http, $q, $location) {
	return {
		query: function() {
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
				$http({
					method: 'GET',
					url: url + 'tabList/getMatchInfo.shtml?dateVal=' + date + "&payout_type=" + payout_type+ "&player_id=" + player_id
				}).
				success(function(data, status, headers, config) {
					deferred.resolve(data.data.gameList); // 声明执行成功，即http请求数据成功，可以返回数据了  
				}).
				error(function(data, status, headers, config) {
					deferred.reject(data.data.gameList); // 声明执行失败，即服务器返回错误  
				});
				return deferred.promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API  
			} // end query  
	};
}]);

//报名
app.factory('joinGameService', ['$http', '$q', '$location', function($http, $q, $location) {
	return {
		joinGame: function(gameID, gameType) {
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
				$http({
					method: 'GET',
					url: url + "tabList/joinGame.shtml?game_id=" + gameID + "&game_type=" + gameType + "&player_id=" + player_id
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
	},*/ 
	{
		"url": "http://www.caiex.com/caiex/",
		"text": "公司介绍"
	},
	{
		"url": "web_SI.html",
		"text": "SI简介"
	}
	
];
//查询用户金额
app.factory('moneyService', ['$http', '$q', '$location', function($http, $q, $location) {
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
					deferred.resolve(data); // 声明执行成功，即http请求数据成功，可以返回数据了  
				}).
				error(function(data) {
					deferred.reject(data); // 声明执行失败，即服务器返回错误  
				});
				return deferred.promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API  
			} // end query  
	};
}]);
app.controller("agtabctrl", function(userService,$rootScope,moneyService) {
	// cookie processing
    var TGamePlayers=getTGamePlayersCookie();
    if(getCookie("TGamePlayers")==null || getCookie("TGamePlayers")==""){
        if (TGamePlayers.player_id == null || TGamePlayers.player_id == '') {
            console.log(player_id);
        } else {
            player_id = TGamePlayers.player_id;
            $rootScope.headPicUrl=TGamePlayers.headPicUrl;
//          $rootScope.playerMoney=TGamePlayers.money;
        }
    }else{
        var gamePlayers=getCookie("TGamePlayers");
        if(gamePlayers.indexOf(",")>0){
            var TGamePlayers=getTGamePlayersCookie();
            player_id=TGamePlayers.player_id;
            $rootScope.headPicUrl=TGamePlayers.headPicUrl;
//          $rootScope.playerMoney=TGamePlayers.money;
        }else{
            player_id=getCookie("TGamePlayers");
        }
    }


	if(player_id == '' || player_id == null) {
		$rootScope.loginFagle = false;
		$rootScope.loginClass = "signin";
	} else {
		$rootScope.loginFagle = true;
		$rootScope.loginClass = "cart-info";
	}	
	
	var user = this;
	user.src1 = "web_img/icon.png";
	user.word = "赛事游戏";
	var promiseUser = userService.query(); // 同步调用，获得承诺接口  
	promiseUser.then(function(datas) {
		if(datas.data==null || datas.data==""){
			user.src = "web_img/logo.png";//  未登录时    静默显示logo
		}else{
			var headPicUrl = datas.headPicUrl;
			user.url = "web_gameuser.html";
			user.src = TGamePlayers.headPicUrl;
			user.navbox = navbox;
		}
	}, function(data) { // 处理错误 .reject
		alert('用户头像查询错误！');
	});
	var promises = moneyService.queryMoney(); // 查询用户金额
	promises.then(function(data) {
		if(data!=null){
			$rootScope.userMoney = data;
			$rootScope.playerMoney=data;
		}
	}, function(data) { // 处理错误 .reject  
		alert('用户金额查询错误！');
	});
	user.navbox = navbox;
});

app.controller("agctrl", function($scope, $location, agService, joinGameService, matchIDService, querySIMatchIDService) {
	var madate = sessionStorage.getItem('pickdate');
	
	if(madate==null || madate==""){
			$("#pickdate").val("");
		}else{
			$("#pickdate").val(madate);
			date=madate;
			$("#tab p").css("background","none");
		}
	
	//date = getNowFormatDate(0);
	var matchType=sessionStorage.getItem('payout' + date);
	if(matchType=="2"){
		payout_type = 2;
	}else{
		payout_type = 1;
	}	
	game($scope, agService, "1");
	//点击日期
	 $("#pickdate").change(function(){
	 	//alert($("#pickdate").val());
		date=$("#pickdate").val();
		sessionStorage.setItem('pickdate',date);
		game($scope, agService, "1");
		$("#tab p").css("background","none");
	});
	//点击新赛事 已结束
	$scope.tabClick = function(ptype) {
		if(ptype == "1") {
			payout_type = "2";
			sessionStorage.setItem('payout' + date, "2"); //1 新赛事  2表示已结束
			$(".wu").hide();
		} else {
			payout_type = "1";
			sessionStorage.setItem('payout' + date, "1"); //1 新赛事  2表示已结束
			$(".wu").show();
		}
		game($scope, agService, "1");
	}

	//点击自由赛 锦标赛
	$scope.gameClick = function(isclickFree, gameID, gtype) {

		if(isclickFree == true && gtype == '2') { //锦标赛
			for(var i = 0; i < $scope.agctrlLists.length; i++) {
				if($scope.agctrlLists[i].gameID == gameID) {
					$scope.agctrlLists[i].isclickFree = false;
					sessionStorage.setItem('gameType' + gameID, "2"); //1表示自由赛  2表示锦标赛
				}
			}

		} else if(isclickFree == false && gtype == '1') { //自由赛
			for(var i = 0; i < $scope.agctrlLists.length; i++) {
				if($scope.agctrlLists[i].gameID == gameID) {
					$scope.agctrlLists[i].isclickFree = true;
					sessionStorage.setItem('gameType' + gameID, "1"); //1表示自由赛  2表示锦标赛
				}
			}
		}
	}

	//刷新按钮
	$("#pointe").click(function() {
		$("#pointe img").attr('src', 'web_img/icons.png');
		setTimeout(function() {
			$("#pointe img").attr('src', 'web_img/icon.png');
		}, 500);
		game($scope, agService, "1");
	});
	//报名
	$scope.toGame = function(gameID, gameType, joinState, gpid) {
//判断浏览器
        //平台、设备和操作系统
        var system = {
            win: false,
            mac: false,
            xll: false,
            ipad:false
        };
        //检测平台
        var p = navigator.platform;
        system.win = p.indexOf("Win") == 0;
        system.mac = p.indexOf("Mac") == 0;
        system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
        system.ipad = (navigator.userAgent.match(/iPad/i) != null)?true:false;
        //跳转语句，如果是手机访问就自动跳转到wap.baidu.com页面
        if (system.win || system.mac || system.xll||system.ipad) {  
			if(player_id==null || player_id==''){
				alert("未登录！");
			return false;
		}
        } else {
			var weixin =new is_weixn;
			//window.location.href = "../web-game/web_game.html";
     	}
        function is_weixn(){
		    var ua = navigator.userAgent.toLowerCase();
		    if(ua.match(/MicroMessenger/i)=="micromessenger") {
		        return true;
		    } else {
		    	window.location.href = "../web-game/web_game.html";
		    }
		}
//判断浏览器end		
		if(gameType == '1' && joinState == '0') {
			alert("比赛未报名！");
			return false;
		} else if(gameType == '2' && joinState == '0') {
			alert("比赛未报名！");
			return false;
		}
		if(joinState == 998) {
			if(gameType == 2) {
				$("#gameIDBombbox").val(gameID);
				$("#gameIDgameType").val(gameType);
				$('#overlay1').fadeIn('fast', function() {
					$('#box1').animate({
						'top': '100px'
					}, 500);
				});
			} else {
				var promise = joinGameService.joinGame(gameID, gameType); // 报名
				promise.then(function(data) {

					if(data.result.resultCode == 1) {
						//alert("报名成功！");
						if(gameType == 1) {
							window.location.href = "web_information.html?gp_id=" + data.data + "&game_id=" + gameID + "&game_type=" + gameType;
						} else if(gameType == 2) {
							window.location.href = "web_informations.html?gp_id=" + data.data + "&game_id=" + gameID + "&game_type=" + gameType;
						}

					} else {
						alert(data.result.resultMsg + "   报名失败！");
					}

				}, function(data) { // 处理错误 .reject  
					alert('报名比赛错误！');
				});
			}
		} else {
			if(gameType == 1) {
				window.location.href = "web_information.html?gp_id=" + gpid + "&game_id=" + gameID + "&game_type=" + gameType;
			} else if(gameType == 2) {
				window.location.href = "web_informations.html?gp_id=" + gpid + "&game_id=" + gameID + "&game_type=" + gameType;
			}
		}

	}

	//报名
	$scope.toGames = function() {
		if(player_id==null || player_id==''){
			alert("未登陆！");
			return false;
		}
		var gameID = $("#gameIDBombbox").val();
		var gameType = $("#gameIDgameType").val();

		var promise = joinGameService.joinGame(gameID, gameType); // 报名
		promise.then(function(data) {
			$('#box1').animate({
				'top': '-1000px'
			}, 500, function() {
				$('#overlay1').fadeOut('fast');
			});
			if(data.result.resultCode == 1) {
				window.location.href = "web_informations.html?gp_id=" + data.data + "&game_id=" + gameID + "&game_type=" + gameType;
			} else {
				alert(data.result.resultMsg + "   报名失败！");
			}

		}, function(data) { // 处理错误 .reject  
			alert('报名错误！');
		});

	}
	$scope.boxclose1 = function() {
		$('#box1').animate({
			'top': '-1000px'
		}, 500, function() {
			$('#overlay1').fadeOut('fast');
		});
	}

	//跳转到咨询
	$scope.toNewsDetail = function(unique_id) {
		var promiseID = matchIDService.queryID(unique_id); // 报名自由赛
		promiseID.then(function(matchData) {
			var promiseSIID = querySIMatchIDService.querySIMatchID(unique_id); // 报名自由赛
			promiseSIID.then(function(matchSIData) {
				if(matchSIData.caiex_matchnews_id != null && matchData.matchID != null) {
					window.location.href = "xl_zixun.html?matchID=" + matchData.matchID + "&simatchID=" + matchSIData.caiex_matchnews_id;
				} else {
					alert("没有SI资讯信息");
				}

			}, function(data) { // 处理错误 .reject  
				//alert('查询matchID错误！');
			});
		}, function(data) { // 处理错误 .reject  
			//alert('查询matchID错误！');
		});
	}
});

//根据uniqueID查询matchid
app.factory('matchIDService',['$http', '$q', '$location','md5',function($http, $q, $location,md5) {
	return {
		queryID: function(uniqueID) {
  			var safe = localStorage.getItem('lSKey');
  			sign = md5.createHash("appCode" + appCode +'uniqueid' + uniqueID + safe);
			var deferred = $q.defer();
				$http({
					method: "POST",
					headers : {
				        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				    },
	                data:$.param({
	                	"uniqueid":uniqueID,
	                	"appCode":appCode,
	                	"sign":sign
	                }),
	                url: urls + "queryMatchID"	
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

//根据uniqueID查询simatchid
app.factory('querySIMatchIDService', ['$http', '$q', '$location','md5', function($http, $q, $location,md5) {
	return {
		querySIMatchID: function(uniqueID) {
			var safe = localStorage.getItem('lSKey');
			sign = md5.createHash("appCode" + appCode +'uniqueid' + uniqueID + safe);
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
				$http({
					method: "POST",
					headers : {
				        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				    },
	                data:$.param({
	                	"uniqueid":uniqueID,
	                	"appCode":appCode,
	                	"sign":sign
	                }),
	                url: urls + "querySIMatchID"
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
app.controller("baoctrl", function() {
	this.jin = "报名需要1000￥";
	this.list = "web_information.html";
	this.bao = "确认报名";
	this.src1 = "web_img/sign1.png"
});

function getMatchState(state, payout_state) {
	if(payout_state == 1) {
		return '已结束';
	}

	switch(state) {
		case 0:
			return '未开赛';
		case 1:
			return '已开赛';
		case 2:
			return '已结束';
		case 3:
			return '中场';
		case 4:
			return '比赛取消';
	}
}

function game($scope, agService, game_type) {
	if(payout_type == "1") {
		$scope.payout_type = "1";
		$scope.tabstylea = "color:#fff;font-weight:bold;background:#bc1b20;";
		$scope.tabstyleb = "";
	} else {
		$scope.payout_type = "2";
		$scope.tabstylea = "";
		$scope.tabstyleb = "color:#fff;font-weight:bold;background:#bc1b20;";
	}
	var agctrlLists = new Array();
	var promise = agService.query(); // 查询某一天所有的比赛
	promise.then(function(data) {
		for(var i = 0; i < data.length; i++) {
			var matchInfo = data[i];
			var teams = matchInfo.match_teams.split(' vs ');
			var homeScore;
			var awayScore;
			var matchScore = matchInfo.match_score;

			if(matchScore == "-") {
				var halfScore = matchInfo.half_score;
				if(halfScore == "-") {
					homeScore = 0;
					awayScore = 0;
				} else {
					homeScore = halfScore.split("-")[0];
					awayScore = halfScore.split("-")[1];
				}
			} else {
				homeScore = matchScore.split("-")[0];
				awayScore = matchScore.split("-")[1];
			}

			var freeState = getMatchState(matchInfo.match_state, matchInfo.free_payout_state);
			var gameState = getMatchState(matchInfo.match_state, matchInfo.champion_payout_state);
			var ctrl = new Object();
			ctrl.freegp_id = matchInfo.gpFree_id;
			ctrl.gpgame_id = matchInfo.gpGame_id;
			ctrl.imga = "web_img/Mexico.png";
			ctrl.team = teams[0];
			ctrl.score = homeScore;
			ctrl.scores = awayScore;
			ctrl.imgb = "web_img/Uruguay.png";
			ctrl.teams = teams[1];
			ctrl.title = "赛事类型:";
			ctrl.title1 = "状态:";
			ctrl.title2 = "开始时间:";
			ctrl.title3 = "累计奖池:";
			ctrl.title5 = "报名截止:";
			ctrl.text = "围观";
			if(sessionStorage.getItem('gameType' + matchInfo.game_id) == null || sessionStorage.getItem('gameType' + matchInfo.game_id) == "2") { //锦标赛
				ctrl.isclickFree = false;
			} else if(sessionStorage.getItem('gameType' + matchInfo.game_id) == "1") { //自由赛
				ctrl.isclickFree = true;
			}

			ctrl.content = "自由赛";
			ctrl.content1 = freeState;
			ctrl.content2 = matchInfo.game_start_time;
			ctrl.content3 = matchInfo.free_player_now;
			ctrl.content4 = "2万金币";
			ctrl.touzhu = "去投注";
			ctrl.text1 = "报名费:";

			ctrl.contenter = "锦标赛";
			ctrl.contenter1 = gameState;
			ctrl.contenter2 = matchInfo.end_sign_time;
			ctrl.contenter3 = matchInfo.champion_player_now;
			ctrl.contenter4 = matchInfo.sum_jackpot;
			ctrl.contenter5 = matchInfo.sign_cost;
			ctrl.baoming = "去报名";
			ctrl.text1 = "报名费:";
			ctrl.gameID = matchInfo.game_id;
			var buttonFree = "";
			if(matchInfo.free_game_state == 0) {
				buttonFree = '0';
			} else {
				if(matchInfo.free_payout_state == 1) {
					buttonFree = "1";
				} else if(matchInfo.free_payout_state == 2) {
					buttonFree = "2";
				} else {
					if(matchInfo.freeJoinState > 0) {
						//已经报名
						buttonFree = "3";
					} else {
						//未报名
						buttonFree = "4";
					}
				}
			}
			var buttonJoin = "";
			if(matchInfo.champion_game_state == 0) {
				buttonJoin = "0";
			} else {
				if(matchInfo.champion_payout_state == 1) {
					buttonJoin = "1";
				} else if(matchInfo.champion_payout_state == 2) {
					buttonJoin = "2";
				} else {
					if(matchInfo.championJoinState > 0) {
						//已报名
						buttonJoin = "3";
					} else {
						//未报名
						buttonJoin = "4";
					}
				}
			}
			ctrl.championJoinState = matchInfo.championJoinState;
			ctrl.freeJoinState = matchInfo.freeJoinState;
			ctrl.buttonJoin = buttonJoin;
			ctrl.buttonFree = buttonFree;
			ctrl.match_code = matchInfo.match_code;
			ctrl.sort = matchInfo.game_start_time;
			agctrlLists[i] = ctrl;

		}

		$scope.agctrlLists = agctrlLists;
	}, function(data) { // 处理错误 .reject  
		alert('查询比赛信息错误！');
	});
}
// controller 声明方法3.1: 用value的方式实现简单赋值:
app.controller("hhctrl",myhhctrl2); // 顺序不能写反

// ============ 初始化数据 ====================
app.value("myConst", {
	"src3": "web_img/sign1.png",
	"text": "签到可得1000金币",
	"words": "签    到"
});

// ================ controller 赋值 ==================
function myhhctrl2($rootScope,$http, myConst,moneyService) {
	m = myConst;
	//签到
	this.src3 = m.src3;
	this.text = m.text;
	this.words = m.words;
	$(".signbutton").click(function() {
		$('#web_box').animate({
			'top': '-1000px'
		}, 500, function() {
			$http.get(url + 'fallsList/dailySignIn.shtml?player_id=' + player_id)
				.success(function(response) {
					if(response.result.resultCode == 1) {
						alert("签到成功！");
						var promises = moneyService.queryMoney(); // 同步调用，获得承诺接口  
						promises.then(function(data) {
							$rootScope.userMoney = data;
						}, function(data) { // 处理错误 .reject  
							alert('签到查询金额错误！');
						});
					} else {
						alert(response.result.resultMsg + "   签到失败！");
					}
				});
		});
	});

};
