var app = angular.module("agSI", []);
var url = "http://101.200.156.97/CAIEX-GAME/";
var player_id =''; //用户id
//登录
var appid = 'wxd67f8fc253fdc6f3';

var TGamePlayers = getTGamePlayersCookie();
var player_id =TGamePlayers.player_id; //用户id
var headPicUrl = TGamePlayers.headPicUrl;
var playerMoney = TGamePlayers.money;

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
		"text": "SI简介",
		"selected": true
	}
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
app.controller("agSIingctrl", function($rootScope,userService,moneyService) {
	var SI = this;
	SI.src0 = "web_img/white.png";
	SI.src1 = "web_img/white.png";
	SI.word = "SI";
	SI.url = "web_gameuser.html";
	SI.navbox = navbox;
	var promiseUser = userService.query(); // 同步调用，获得承诺接口  获取用户信息
	promiseUser.then(function(datas) {
		if(datas==null || datas==""){
			SI.src = "web_img/logo.png";//  未登录时    静默显示logo
		}else{
		var headPicUrl = datas.headPicUrl;
		SI.src = headPicUrl;
		SI.navbox = navbox;
		}
	}, function(data) { // 处理错误 .reject  
		alert('查询用户头像错误！');
	});
	var promiseMoney = moneyService.getMatchInfoDate(); // 获取盈利金额
		promiseMoney.then(function(data) {
			$rootScope.userMoney = data;
			$rootScope.playerMoney = data;
		}, function(data) { // 处理错误 .reject  
			//alert('查询金额错误！');
		});
});
//	var SIone = [
//		{
//			"SIurl":"web_img/SI.png",
//			"title":"快人一步",
//			"text":"Soccerinternationl 是一家提供全世界范围的足球比赛前瞻，往期比赛的回顾，各种维度的数据统计和分析的专业足球情报机构，一站式的足球比赛伤病和分析系统。"
//		},
//		{
//			"SIurl":"web_img/SI_1.png",
//			"title":"关于 Soccerinternationl",
//			"text":"足球世界是一家位于英国，雇员遍布欧洲，亚洲和美洲的国际公司。从1999年开始， 公司就致力于给用户提供第一手的足球新闻情报和分析。",
//			"edit":"在全球市场上，在线博彩和专业彩民对于准确快速的足球信息和情报要求越来越大，足球世界公司应运而生，之后，我们便根据客户的要求，覆盖越来越多的足球联赛，大到世界上最著名的五大联赛，小至荷兰乙级联赛，法国乙级联赛，乃至最近新加入的巴西甲级联赛，俄罗斯超级联赛等。",
//			"word":"多亏了我们整个编辑团队的努力，撰写出一场场高质量，高准确性，简单易读的足球情报，让我们的服务客户遍布于体育博彩公司，专业投资基金，和职业博彩人等，当然，我们的情报系统也服务于线上和线下的媒体。"
//		},
//		{
//			"SIurl":"web_img/SI_2.png",
//			"title":"我们的产品",
//			"text":"我们提供世界范围内众多的足球联赛情报信息服务。我们的编辑团队都是这方面的专家，他们接受专业的培训，全职的投入于足球情报的搜集和深度分析，从英国本土，到欧洲大陆，从亚洲到美洲，我们专注于那些非常难以获得的足球信息，让用户便利的得到汇总和分析，省时省力。",
//			"edit":"我们提供所有和你购买的联赛相关的信息和赛后报告，用户可以随时在线上查看或者推送到邮箱。",
//			"word":"信息提醒系统可以及时提醒用户有最新的信息发生，第一时间通知用户。"
//		}
//	];
//	app.controller("cartCtrl",function($scope){
//		this.SIone = SIone;
//	});