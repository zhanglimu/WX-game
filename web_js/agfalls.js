var app = angular.module("agfalls", []);
var player_id = ''; //用户id
var url = "http://101.200.156.97/CAIEX-GAME/";
//登录
//var userNickName =getTGamePlayersCookie().player_nickname;
var appid = 'wxd67f8fc253fdc6f3';
var headPicUrl = '';

var pcnavbox = [
		{"url":"web_match.html","text":"赛事游戏"},
		{"url":"web_news.html","text":"赛事信息","selected":true},
		{"url":"web_gameuser.html","text":"个人中心"},
//		{"url":"web_gift.html","text":"兑奖中心"},
//		{"url":"web_giftlist.html","text":"兑奖记录"},
		{"url":"http://www.caiex.com/caiex/","text":"公司介绍"}
	];
	app.controller("agpcnavctrl",function(){
		this.pcnavbox = pcnavbox;
		this.src = "web_img/logoSI.png";
		this.src0 = "web_img/logo.png";
		this.header = "web_img/0.jpg"
	});
// controller 声明方法1: 声明controller的那行代码, 把function部分代码都包含进来; 缺点是: app.controller() 参数部分太长
app.controller("fallsctrl", function($rootScope,userService) {
	if(getCookie("TGamePlayers")==null || getCookie("TGamePlayers")==""){
		var tgamePlayers=getTGamePlayersCookie();
		player_id=tgamePlayers.player_id;
		headPicUrl=tgamePlayers.headPicUrl;
		$rootScope.playerMoney=tgamePlayers.money;
	}else{
		player_id=getCookie("TGamePlayers");
	}
	fc = this;
	var navbox = [{
			"url": "web_falls.html",
			"text": "赛事日期",
			"selected": true
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
			"text": "个人中心"
		}
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
	];
/*	var promiseUser = userService.query(); // 查询用户信息
	promiseUser.then(function(datas) {
		if(datas!=null){
		
		var headPicUrl = datas.headPicUrl;
		fc.word = "赛事日期";
		fc.url = "web_gameuser.html";
		fc.src = headPicUrl;
		fc.navbox = navbox;
	
		}
	}, function(data) { // 处理错误 .reject  
		alert('头像地址查询错误！');
	});*/
	// ============ 初始化数据 ====================
	//点击关闭登录二维码页面
	$('.theme-poptit .close').click(function() {
		$('.theme-popover-mask').fadeOut(100);
		$('.theme-popover').slideUp(200);
	});
	//登录
	fc.word = "赛事日期";
	fc.url = "web_gameuser.html";
	fc.src = headPicUrl;
	fc.navbox = navbox;
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
//查询每天多少场比赛
app.factory('agfallService', ['$http', '$q', '$location', function($http, $q, $location) {

	return {
		query: function() {
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
				$http({
					method: 'GET',
					url: url + 'tabList/getMatchInfoDate.shtml?player_id=' + player_id
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
					deferred.resolve(data.data); // 声明执行成功，即http请求数据成功，可以返回数据了  
				}).
				error(function(data) {
					deferred.reject(data.data); // 声明执行失败，即服务器返回错误  
				});
				return deferred.promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API  
			} // end query  
	};
}]);
// controller 声明方法2: 先声明controller, 标明注入一个函数; 再在一个纯纯的javascript函数中实现controller具体代码; 优点是: 易于理解, 易读, 好维护.
app.controller("agfall", myagfall);

function myagfall($rootScope, agfallService, moneyService) {
	afc = this;
	/*var promiseUser = userService.query(); // 同步调用，获得承诺接口  
	promiseUser.then(function(datas) {
		player_id = datas.player_id;*/
	// ================ controller 赋值 ==================
	//初始化金额
	afc.src = "web_img/position.png";
	afc.src1 = "web_img/sign.png";
	afc.src2 = "web_img/sumgold.png";
	var promises = moneyService.queryMoney(); // 查询用户金额
	promises.then(function(data) {
		if(data!=null){
			$rootScope.userMoney = data;
		}
	}, function(data) { // 处理错误 .reject  
		alert('用户金额查询错误！');
	});
	$rootScope.toggle = function(){
        $(".more").addClass("moreup");
        $("dd:gt(0)").toggle();
        $(".more").click(function(){
			$(this).toggleClass("moreup");
		});
		//event.stopPropagation(); //  阻止事件冒泡
    };

	// ============ 初始化数据 ====================
	var title_left = new Array();
	var title_right = new Array();
	var num_left = new Array(); //todo:ajax返回值
	var games_team=["web_img/zhudui.png","web_img/kedui.png"];
	var num_right = new Array(); //todo:ajax返回值
	var games_name=["乌兹别克斯坦","阿森纳"];
	var games_miao=["16:30:00","17:30:00","15:00:00","17:30:00","16:30:00","17:30:00","16:30:00"];
	var promise = agfallService.query(); // 同步调用，获得承诺接口  
	promise.then(function(data) { // 调用承诺API获取数据 .resolve  
		var matchDates = data.data;
		if(matchDates!=null){
		var numL = 0;
		var numR = 0;
		for(var i = 0; i < matchDates.length; i++) {
				title_left[numL] = matchDates[i].date;
				num_left[numL] = matchDates[i].num;
				numL++;
		}
		var gamelist = [{
			"more": num_left[0],						
			"time": title_left[0],	
			"prc":  games_team[0],
			"prc1":games_team[1],
			"best":games_name[0],
			"second":games_miao[0],
			"best1":games_name[1],
			"dataurl": 'web_tab.html?date=' + title_left[0]
		}, {
			"more": num_left[1],
			"time": title_left[1],
			"prc":  games_team[0],
			"prc1":games_team[1],
			"best":games_name[0],
			"second":games_miao[1],
			"best1":games_name[1],
			"dataurl": 'web_tab.html?date=' + title_left[1]
		}, {
			"more": num_left[2],
			"time": title_left[2],
			"prc":  games_team[0],
			"prc1":games_team[1],
			"best":games_name[0],
			"second":games_miao[2],
			"best1":games_name[1],
			"dataurl": 'web_tab.html?date=' + title_left[2]
		}, {
			"more": num_left[3],
			"time": title_left[3],
			"prc":  games_team[0],
			"prc1":games_team[1],
			"best":games_name[0],
			"second":games_miao[3],
			"best1":games_name[1],
			"dataurl": 'web_tab.html?date=' + title_left[3]
		},
		 {
			"more": num_left[4],
			"time": title_left[4],
			"prc":  games_team[0],
			"prc1":games_team[1],
			"best":games_name[0],
			"second":games_miao[4],
			"best1":games_name[1],
			"dataurl": 'web_tab.html?date=' + title_left[4]
		}, {
			"more": num_left[5],
			"time": title_left[5],
			"prc":  games_team[0],
			"prc1":games_team[1],
			"best":games_name[0],
			"second":games_miao[5],
			"best1":games_name[1],
			"dataurl": 'web_tab.html?date=' + title_left[5]
		}, {
			"more": num_left[6],
			"time": title_left[6],
			"prc":  games_team[0],
			"prc1":games_team[1],
			"best":games_name[0],
			"second":games_miao[6],
			"best1":games_name[1],
			"dataurl": 'web_tab.html?date=' + title_left[6]
		},]
		afc.gamelist = gamelist;
	}
	}, function(data) { // 处理错误 .reject  
		alert('查询每天多少场比赛错误！');
	});
	
//	var games_num=["2016-10-25","2016-10-26","2016-10-27","2016-10-28","2016-10-29","2016-10-30","2016-10-31"];
//	var games_more=["2场","1场","1场","1场","1场","1场","1场"];
//	var games_team=["web_img/zhudui.png","web_img/kedui.png"];
	//var games_name=["乌兹别克斯坦","阿森纳"];
	//var games_miao=["16:30:00","17:30:00","15:00:00","17:30:00","16:30:00","17:30:00","16:30:00"];
	//var gamelist=[
	//	{"time":games_num[0],"more":games_more[0],"url":games_team[0],"best":games_name[0],"num":"0","num1":"0","second":games_miao[0],"url1":games_team[1],"best1":games_name[1]},
	//	{"time":games_num[1],"more":games_more[1],"url":games_team[0],"best":games_name[0],"num":"0","num1":"0","second":games_miao[1],"url1":games_team[1],"best1":games_name[1]},
	//	{"time":games_num[2],"more":games_more[2],"url":games_team[0],"best":games_name[0],"num":"0","num1":"0","second":games_miao[2],"url1":games_team[1],"best1":games_name[1]},
	//	{"time":games_num[3],"more":games_more[3],"url":games_team[0],"best":games_name[0],"num":"0","num1":"0","second":games_miao[3],"url1":games_team[1],"best1":games_name[1]},
	//	{"time":games_num[4],"more":games_more[4],"url":games_team[0],"best":games_name[0],"num":"0","num1":"0","second":games_miao[4],"url1":games_team[1],"best1":games_name[1]},
	//	{"time":games_num[5],"more":games_more[5],"url":games_team[0],"best":games_name[0],"num":"0","num1":"0","second":games_miao[5],"url1":games_team[1],"best1":games_name[1]},
	//	{"time":games_num[6],"more":games_more[6],"url":games_team[0],"best":games_name[0],"num":"0","num1":"0","second":games_miao[6],"url1":games_team[1],"best1":games_name[1]}
	//]	
	//afc.gamelist=gamelist;

};

// controller 声明方法3.1: 用constant的方式实现简单赋值:
app.controller("hhctrl", ["myConst", myhhctrl]); // 顺序不能写反

// ============ 初始化数据 ====================
app.constant("myConst", {
	"src3": "web_img/sign1.png",
	"text": "签到可得1000金币",
	"words": "签    到"
});

// ================ controller 赋值 ==================
function myhhctrl(m) {
	//签到
	this.src3 = m.src3;
	this.text = m.text;
	this.words = m.words;
};

// controller 声明方法3.2: 用value的方式实现简单赋值 + 依赖注入的另一种写法
app.controller("hhctrl", myhhctrl2); // 顺序不能写反

// ============ 初始化数据 ====================
app.value("myConst2", {
	"src3": "web_img/sign1.png",
	"text": "签到可得1000金币",
	"words": "签    到 "
});

// ================ controller 赋值 ==================
function myhhctrl2($rootScope,$http, myConst2,moneyService) {
	m = myConst2;
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