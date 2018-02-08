//var url = "https://private-14388b-cxsidemo1.apiary-mock.com/";
//var url = "http://123.57.229.101:12317/CaiexOpenNewsApi/";
var url = "http://www.caiex.com:12317/CaiexOpenNewsApi/";

var app = angular.module('starter', ['ionic','angular-md5'])
var matchID = "";
var simatchID = "";
var interX;
var appCode = "caiexnews";
var security = "876eba451bb4280f864a24db7611bd79";
localStorage.setItem('lSKey',security);
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
			templateUrl: "xl_menu.html",
			controller: 'AppCtrl'
		})

		.state('app.xl_zixun', {
			url: "/xl_zixun",
			views: {
				'menuContent': {
					templateUrl: "xl_zixuncontent.html",
					controller: 'zixuncontentCtrl'
				}
			}
		})

		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/app/xl_zixun');
	})
	//菜单内容
app.controller('AppCtrl', Appdetail);

function Appdetail($scope, $rootScope, $http) {
	$scope.weeks = ["亚洲冠军联赛", "澳大利亚超级联赛", "亚运会男足", "非洲杯"];
}
//查询球员信息
app.factory('playerService', ['$http', '$q', '$location','md5', function($http, $q, $location,md5) {
	return {
		queryPlayers: function(playerID,encnlang) {
			if(encnlang =='Chinese')
				var encnl ='player_cn';
			else
				encnl ='player_en';
			var safe = localStorage.getItem('lSKey');
  			sign = md5.createHash("appCode" + appCode + 'playerId' + playerID + safe);
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
				$http({
//					method: 'GET',
//					url: url + 'player_en?playerId=' + playerID + "&appCode=" + appCode + "&sign=" + sign
					method: "POST",
					headers : {
				        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				    },
	                data:$.param({
	                	"playerId":playerID,
	                	"appCode":appCode,
	                	"sign":sign
	                }),
	                url: url + encnl	
				}).
				success(function(data) {
					deferred.resolve(eval("(" + data.result + ")")); // 声明执行成功，即http请求数据成功，可以返回数据了
				}).
				error(function(data) {
					deferred.reject(eval("(" + data.result + ")")); // 声明执行失败，即服务器返回错误  
				});
				return deferred.promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API  
			} // end query  
	};
}]);
//中心内容
app.controller('zixuncontentCtrl', zixuncontent);
function zixuncontent($rootScope, $ionicPopover, $ionicModal, $timeout, $location, $scope, $http, $interval, homeAwayService, matchesService, homeAwayyinService, playerService) {
	$scope.popover = $ionicPopover.fromTemplateUrl('my-popover.html', {
		scope: $scope
	});
	$ionicPopover.fromTemplateUrl('my-popover.html', {
		scope: $scope
	}).then(function(popover) {
		$scope.popover = popover;
//		$scope.popover.animate({ scrollTop: 0 });
//		$scope.popover.stopPropagation(); 
	});
	$scope.openPopover = function($event, playerid,encnlang) {
		$scope.popover.show($event);
		var obj = new Object();
		var promise = playerService.queryPlayers(playerid,encnlang); // 查询阵容
		promise.then(function(playerBasicInfo) {
			//var playerBasicInfo = matchData.response.PlayerBasicInfo;
			if(playerBasicInfo != null && playerBasicInfo != "") {
				//obj.src = playerBasicInfo.playerImg;
				obj.src = "web_img/logor.png";
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
	};
	$scope.closePopover = function() {
		$scope.popover.hide();
	};
	// 清除浮动框
	$scope.$on('$destroy', function() {
		$scope.popover.remove();
	});
	// 在隐藏浮动框后执行
	$scope.$on('popover.hidden', function() {
		// 执行代码
	});
	// 移除浮动框后执行
	$scope.$on('popover.removed', function() {
		// 执行代码
	});
//操盘手推荐
//	$ionicModal.fromTemplateUrl('my-modal.html', {
//		scope: $scope,
//	}).then(function(modal) {
//		$scope.modal = modal;
//	});
//	$scope.openModal = function() {
//		$scope.modal.show();
//		$scope.caiyi = "克隆VS哈萨克的痕迹——彩易老张德甲推荐";
//		$scope.day = "12-21 17:56";
//		$scope.state = "已完场";
//		$scope.doubt = "分手分手防守打法的胜负？";
//		$scope.one = "科尔沃";
//		$scope.two = "科尔沃USB";
//		$scope.country  = "德甲";
//		$scope.newday = "12-21 16:25";
//		$scope.plan1 = "单关";
//		$scope.plan2 = "主胜";
//		$scope.plan3 = "平";
//		$scope.plan4 = "客胜";
//		$scope.odds1 = "(0)";
//		$scope.odds2 = "2.72";
//		$scope.odds3 = "3.10";
//		$scope.odds4 = "2.28";
//		var go = new Array();
//		var obj = new Object();
//		obj.plan5 = "大小球";
//		obj.plan6 = "大球";
//		obj.plan7 = "小球";
//		obj.odds5 = "(2.5)";
//		obj.odds6 = "2.72";
//		obj.odds7 = "3.10";
//		go[0] = obj;
//		var obj1 = new Object();
//		obj1.plan5 = "亚盘";
//		obj1.plan6 = "主胜";
//		obj1.plan7 = "客胜";
//		obj1.odds5 = "(平手)";
//		obj1.odds6 = "2.72";
//		obj1.odds7 = "3.10";
//		go[1] = obj1;
//		$scope.go=go;
//		$scope.celsius = "5℃";
//		$scope.referee = "马努埃尔.格拉菲";
//		$scope.court = "北京鸟巢体育馆";
//		$scope.figure1 = "2.03";
//		$scope.figure2 = "0";
//		$scope.figure3 = "1.09";
//		$scope.figure4 = "2.03";
//		$scope.figure5 = "0";
//		$scope.figure6 = "1.09";
//		$scope.onedui = "科隆";
//		$scope.it1 = "随着里杰卡尔德的加盟，米兰三剑客在1988/89赛季合璧，随后AC米兰连续两年夺得欧冠冠军，那是球队最风光的年代之一；";
//		$scope.stop1 = "赫格尔(主力中场)";
//		$scope.injury1 = "赫格尔(主力中场)、赫格尔(主力中场)、赫格尔(主力中场)、赫格尔(主力中场)";
//		$scope.battle1 = "无";
//		$scope.twodui = "皇马";
//		$scope.it2 = "随后AC米兰连续两年夺得欧冠冠军，那是球队最风光的年代之一；三个风华正茂的荷兰人用才华撑起了米兰的王朝，那也是那个年代米兰球迷最甜美的一段回忆。 从那个辉煌年代的球衣中吸收灵感，显然阿迪达斯对米兰的下赛季抱有很大期望。";
//		$scope.stop2 = "赫格尔(主力中场)";
//		$scope.injury2 = "赫格尔(主力中场)、赫格尔(主力中场)、赫格尔(主力中场)、赫格尔(主力中场)";
//		$scope.battle2 = "无";
//		$scope.it3 = "赛中穿着亮相。 你经历过“米兰三剑客”的时代了么？对AC米兰回归传统的球衣设计怎么看？评论告诉我们吧！";
//		$scope.dai1 = "主胜 或 平";
//		$scope.dai2 = "科隆 0 @2.03";
//		$scope.dai3 = "2.5小@1.84";
//	};
//	$scope.closModal = function() {
//		$scope.modal.hide();
//	};
//	//当我们用完模型时，清除它！
//	$scope.$on('$destroy', function() {
//		$scope.modal.remove();
//	});
//	// 当隐藏模型时执行动作
//	$scope.$on('modal.hide', function() {
//		// 执行动作
//	});
//	// 当移动模型时执行动作
//	$scope.$on('modal.removed', function() {
//		// 执行动作
//	});
//操盘手推荐完
	// echarts路径配置
		require.config({　　
			paths: {　　　　
				echarts: 'http://echarts.baidu.com/build/dist'　　
			}
		});
	// 使用
		//require(['echarts', 'echarts/chart/line'], drawEcharts);
	
		function drawEcharts(ec) {　　
			drawSheng(ec);　　
			drawPing(ec);
			drawFu(ec);
			drawShengr(ec);　　
			drawPingr(ec);
			drawFur(ec);
		}
		function drawSheng(ec) {
			var xrays = new Array();
			for(var int = 0; int < 91; int++) {
				xrays[int] = int + "'";
			}　
			$.ajax({      //获取假数据
				async : false,
				type: "GET",
				url: "https://private-anon-ca0dbfd2f9-historicalcurvediagram.apiary-mock.com/oddsHistory?agentId=105&tId=201612231925514500001",
				dataType: "json",
				success: function(data){
				    successdata = data;
				}
			});
			var myBarChart = ec.init(document.getElementById('shengMain'));　
			var option = {　　　　
				tooltip: {　　　　 
					show: true　　
				},
				title: {
					text: '胜',
					padding:5,
					textStyle: { 
			            fontSize: 14,
			            fontWeight: 'bolder',
			        },
				}, 
				grid:{
//					borderWidth:0,//去除外围线
					x:30,
					y:30,
					x2:30,
					y2:30,
				},
				xAxis: [{
					splitLine: {show: false}, //去除网格线
					axisTick: {show: false}, //去掉刻度
					type: 'category',
					boundaryGap: false,
					data: xrays,
					axisLine:{
                        lineStyle:{
                            color:'#436eee',
                            width:1,
                        }
                   },
				}],
				yAxis: [{
					splitLine: {show: false},
					axisTick: {show: false},
					type: 'value',
//					type : 'category',
					axisLabel: {
						show: false,
//						formatter: '{value}'
					},
//					data:['100'],
					axisLine:{
                        lineStyle:{
                            color:'#436eee',
                            width:1,
                        }
                    },
				}],
				series: [{
//					calculable : true,    //是否启用拖拽重计算
					smooth:true,      //平滑曲线
					type: 'line',
					data:(function (){
						var res = [];
						var lenn = 0;
						var len = successdata.oddsHistory.length;
						while (lenn < len) {
							res.push(successdata.oddsHistory[lenn].price);
							++lenn;
						}
					return res;
					})(), 
//					symbol:'none',   //去掉折线上的圆点
					itemStyle: {
		                normal: {
		                	color:'#87cefa',
		                    lineStyle:{  
                                color:'#87cefa'  
                            }, 
                            areaStyle: {
		                        color:'#f3f3f3'
		                    },
		                }
		            },
				}]
			};
			myBarChart.setOption(option, true);
			//当setOption第二个参数为true时，会阻止数据合并
		}
	
		function drawPing(ec) {
			var xrays = new Array();
			for(var int = 0; int < 91; int++) {
				xrays[int] = int + "'";
			}　　
			var myLineChart = ec.init(document.getElementById('pingMain'));　　
			var option2 = {　　　　
				tooltip: {　　　　
					show: true　　
				},
				title: {
					text: '平',
					textStyle: {
			            fontSize: 14,
			            fontWeight: 'bolder',
			        },
				}, 
				grid:{
					x:30,
					y:30,
					x2:30,
					y2:30,
				},
				xAxis: [{
					splitLine: {show: false}, //去除网格线
					axisTick: {show: false}, //去掉刻度
					type: 'category',
					boundaryGap: false,
					data: xrays,
					axisLine:{
                        lineStyle:{
                            color:'#436eee',
                            width:1,
                        }
                    },
				}],
				yAxis: [{
					splitLine: {show: false},
					axisTick: {show: false},
					type: 'value',
					axisLabel: {
						show: false
					},
					axisLine:{
                        lineStyle:{
                            color:'#436eee',
                            width:1,
                        }
                    },
				}],
				series: [{
					smooth:true,
					type: 'line',
					data: (function (){
		                var res = [];
		                var len = 0;
		                while (len < 91) {
		                    res.push((Math.random()*10 + 2).toFixed(1) - 0);
		                    len++;
		                }
		                return res;
		            })(),
					itemStyle: {
		                normal: {
		                	color:'#87cefa',
		                    lineStyle:{  
                                color:'#87cefa'  
                            }, 
                            areaStyle: {
		                        color:'#f3f3f3'
		                    },
		                }
		            },
				}]
			};
			myLineChart.setOption(option2, true);
		}
		
		function drawFu(ec) {
			var xrays = new Array();
			for(var int = 0; int < 91; int++) {
				xrays[int] = int + "'";
			}　　
			var myLineChart = ec.init(document.getElementById('fuMain'));　　
			var option3 = {　　　　
				tooltip: {　　　　
					show: true　　
				},
				title: {
					text: '负',
					textStyle: {
			            fontSize: 14,
			            fontWeight: 'bolder',
			        },
				},  
				grid:{
					x:30,
					y:30,
					x2:30,
					y2:30,
				},
				xAxis: [{
					splitLine: {show: false}, //去除网格线
					axisTick: {show: false}, //去掉刻度
					type: 'category',
					boundaryGap: false,
					data: xrays,
					axisLine:{
                        lineStyle:{
                            color:'#436eee',
                            width:1,
                        }
                    },
				}],
				yAxis: [{
					splitLine: {show: false},
					axisTick: {show: false},
					type: 'value',
					axisLabel: {
						show: false
					},
					axisLine:{
                        lineStyle:{
                            color:'#436eee',
                            width:1,
                        }
                    },
				}],
				series: [{
					smooth:true,
					type: 'line',
					data: (function (){
		                var res = [];
		                var len = 0;
		                while (len < 91) {
		                    res.push((Math.random()*10 + 2).toFixed(1) - 0);
		                    len++;
		                }
		                return res;
		            })(),
					itemStyle: {
		                normal: {
		                	color:'#87cefa',
		                    lineStyle:{  
                                color:'#87cefa'  
                            }, 
                            areaStyle: {
		                        color:'#f3f3f3'
		                    },
		                }
		            },
				}]
			};
			myLineChart.setOption(option3, true);
		}
		
		function drawShengr(ec) {　
			var xrays = new Array();
			for(var int = 0; int < 91; int++) {
				xrays[int] = int + "'";
			}　
			var myBarChart = ec.init(document.getElementById('rshengMain'));　　
			var option4 = {　　　　
				tooltip: {　　　　
					show: true　　
				},
				title: {
					text: '让球胜',
					textStyle: {
			            fontSize: 14,
			            fontWeight: 'bolder',
			        },
				},  
				grid:{
					x:30,
					y:30,
					x2:30,
					y2:30,
				},
				xAxis: [{
					splitLine: {show: false}, //去除网格线
					axisTick: {show: false}, //去掉刻度
					type: 'category',
					boundaryGap: false,
					data: xrays,
					axisLine:{
                        lineStyle:{
                            color:'#436eee',
                            width:1,
                        }
                    },
				}],
				yAxis: [{
					splitLine: {show: false},
					axisTick: {show: false},
					type: 'value',
					axisLabel: {
						show: false
					},
					axisLine:{
                        lineStyle:{
                            color:'#436eee',
                            width:1,
                        }
                    },
				}],
				series: [{
					smooth:true,
					type: 'line',
					data: (function (){
		                var res = [];
		                var len = 0;
		                while (len < 91) {
		                    res.push((Math.random()*10 + 2).toFixed(1) - 0);
		                    len++;
		                }
		                return res;
		            })(),
					itemStyle: {
		                normal: {
		                	color:'#87cefa',
		                    lineStyle:{  
                                color:'#87cefa'  
                            }, 
                            areaStyle: {
		                        color:'#f3f3f3'
		                    },
		                }
		            },
				}]
			};
			myBarChart.setOption(option4, true);
		}
	
		function drawPingr(ec) {
			var xrays = new Array();
			for(var int = 0; int < 91; int++) {
				xrays[int] = int + "'";
			}　　
			var myLineChart = ec.init(document.getElementById('rpingMain'));　　
			var option5 = {　　　　
				tooltip: {　　　　
					show: true　　
				},
				title: {
					text: '让球平',
					textStyle: {
			            fontSize: 14,
			            fontWeight: 'bolder',
			        },
				},  
				grid:{
					x:30,
					y:30,
					x2:30,
					y2:30,
				},
				xAxis: [{
					splitLine: {show: false}, //去除网格线
					axisTick: {show: false}, //去掉刻度
					type: 'category',
					boundaryGap: false,
					data: xrays,
					axisLine:{
                        lineStyle:{
                            color:'#436eee',
                            width:1,
                        }
                    },
				}],
				yAxis: [{
					splitLine: {show: false},
					axisTick: {show: false},
					type: 'value',
					axisLabel: {
						show: false
					},
					axisLine:{
                        lineStyle:{
                            color:'#436eee',
                            width:1,
                        }
                    },
				}],
				series: [{
					smooth:true,
					type: 'line',
					data: (function (){
		                var res = [];
		                var len = 0;
		                while (len < 91) {
		                    res.push((Math.random()*10 + 2).toFixed(1) - 0);
		                    len++;
		                }
		                return res;
		            })(),
					itemStyle: {
		                normal: {
		                	color:'#87cefa',
		                    lineStyle:{  
                                color:'#87cefa'  
                            }, 
                            areaStyle: {
		                        color:'#f3f3f3'
		                    },
		                }
		            },
				}]
			};
			myLineChart.setOption(option5, true);
		}
		
		function drawFur(ec) {　
			var xrays = new Array();
			for(var int = 0; int < 91; int++) {
				xrays[int] = int + "'";
			}
			var myLineChart = ec.init(document.getElementById('rfuMain'));　　
			var option6 = {　　　　
				tooltip: {　　　　
					show: true　　
				},
				title: {
					text: '让球负',
					textStyle: {
			            fontSize: 14,
			            fontWeight: 'bolder',
			        },
				},  
				grid:{
					x:30,
					y:30,
					x2:30,
					y2:30,
				},
				xAxis: [{
					splitLine: {show: false}, //去除网格线
					axisTick: {show: false}, //去掉刻度
					type: 'category',
					boundaryGap: false,
					data: xrays,
					axisLine:{
                        lineStyle:{
                            color:'#436eee',
                            width:1,
                        }
                    },
				}],
				yAxis: [{
					splitLine: {show: false},
					axisTick: {show: false},
					type: 'value',
					axisLabel: {
						show: false
					},
					axisLine:{
                        lineStyle:{
                            color:'#436eee',
                            width:1,
                        }
                    },
				}],
				series: [{
					smooth:true,
					type: 'line',
					data: (function (){
		                var res = [];
		                var len = 0;
		                while (len < 91) {
		                    res.push((Math.random()*10 + 2).toFixed(1) - 0);
		                    len++;
		                }
		                return res;
		            })(),
					itemStyle: {
		                normal: {
		                	color:'#87cefa',
		                    lineStyle:{  
                                color:'#87cefa'  
                            }, 
                            areaStyle: {
		                        color:'#f3f3f3'
		                    },
		                }
		            },
				}]
			};
			myLineChart.setOption(option6, true);
		}
	//echarts  完

	var adsUrl = $location.absUrl();
	if(adsUrl != null) {
		var adsUrls = adsUrl.split("matchID=");
		var matchIDs = adsUrls[1].split("&");
		matchID = matchIDs[0];
		var siUrl = adsUrl.split("simatchID=");
		var aismatchIDs = siUrl[1].split("#/");
		simatchID = aismatchIDs[0];
	}
	$rootScope.jiantou = false; //默认不显示球队表现对比
	$scope.yuyansty = "background-color: #808080"; //默认中文；
	$scope.yuyanstyy = "";
	content($location, $scope, $http, homeAwayService);

	//下拉刷新
	$scope.doRefresh = function() {
		if($scope.langue == "Chinese") {
			content($location, $scope, $http, homeAwayService);
		} else if($scope.langue == "English") {
			contentyin($location, $scope, $http, homeAwayyinService);
		}
	}
	$scope.langue = "Chinese";
	//语言切换
	$scope.yuyanClick = function(num) {
		if(num == 1) {
			$scope.yuyansty = "background-color: #808080"; //默认中文；
			$scope.yuyanstyy = "";
			content($location, $scope, $http, homeAwayService);
			$scope.langue = "Chinese";
			$(".recommend").show();
		} else {
			$scope.yuyanstyy = "background-color: #808080";
			$scope.yuyansty = "";
			contentyin($location, $scope, $http, homeAwayyinService);
			$scope.langue = "English";
			$(".recommend").hide();
		}

	}
	$rootScope.jiantouUpClick = function() {
		//隐藏
		$rootScope.jiantou = false;
		$interval.cancel(interX);
	}

	$rootScope.jiantouDownClick = function() {
		//点击显示
		$rootScope.jiantou = true;
		teamCompore($scope, matchesService);
		interX = $interval(function() {
			teamCompore($scope, matchesService);
		}, 10000);
	}
}

function teamCompore($scope, matchesService) {
	var teamDetail = new Object();
	var pointer = new Array();
	var poiner = new Array();
	var promise = matchesService.matches(); //查询主队信息
	promise.then(function(match) {
		teamDetail.hjin = match.homeGoalAverage;
		teamDetail.hjinsty = "width:" + teamDetail.hjin / 5 * 100;
		teamDetail.ajin = match.awayGoalAverage;
		teamDetail.ajinsty = "width:" + teamDetail.ajin / 5 * 100;

		teamDetail.hshi = match.homeFumbleAverage;
		teamDetail.hshisty = "width: " + teamDetail.hshi / 5 * 100;
		teamDetail.ashi = match.awayFumbleAverage;
		teamDetail.ashisty = "width: " + teamDetail.ashi / 5 * 100;

		teamDetail.hchang = match.homeFumbleNo;
		teamDetail.hchangsty = "width: " + teamDetail.hchang / 5 * 5;
		teamDetail.achang = match.awayFumbleNo;
		teamDetail.achangsty = "width: " + teamDetail.achang / 5 * 5;

		teamDetail.hchangno = match.homeScoreNo;
		teamDetail.hchangnosty = "width: " + teamDetail.hchangno / 5 * 5;
		teamDetail.achangno = match.awayScoreNo;
		teamDetail.achangnosty = "width: " + teamDetail.achangno / 5 * 5;

		$scope.teamDetail = teamDetail;

		if(match.keyEvents != null && match.keyEvents != "") {
			var matchDataList = match.keyEvents;
			var zhunum = 0;
			var kenum = 0;

			for(var i = 0; i < matchDataList.length; i++) {
				var matchData = matchDataList[i];
				var per = matchData.minute * 100 / 95;
				var perPic = per - 0.2;
				if(matchData.team == 1) { //主队
					var zhuObj = new Object();
					switch(matchData.eventType) {					
						case 1:
							//进球
							zhuObj.src = "web_img/usual.png";
							zhuObj.src1 = "web_img/little.png";
							zhuObj.num = matchData.minute;
							zhuObj.player = matchData.playerName;
							break;
						case 2:
							//点球
							zhuObj.src = "web_img/penalty.png";
							zhuObj.src1 = "web_img/little.png";
							zhuObj.num = matchData.minute;
							zhuObj.player = matchData.playerName;
							break;
						case 5:
							//黄牌
							zhuObj.src = "web_img/yellow.png";
							zhuObj.src1 = "web_img/little.png";
							zhuObj.num = matchData.minute;
							zhuObj.player = matchData.playerName;
							break;
						case 6:
							//红牌
							zhuObj.src = "web_img/red.png";
							zhuObj.src1 = "web_img/little.png";
							zhuObj.num = matchData.minute;
							zhuObj.player = matchData.playerName;
							break;
						case 7:
							//两黄
							zhuObj.src = "web_img/yere.png";
							zhuObj.src1 = "web_img/little.png";
							zhuObj.num = matchData.minute;
							zhuObj.player = matchData.playerName;
							break;
					}
					var distance = per+(-2);
					zhuObj.perPic = "position: absolute;top: -28px; left:" + perPic + "%;";
					zhuObj.per = "position: absolute;top: -2px; left:" + per + "%;";
					zhuObj.pers = "position: absolute;top: -40px; left:" + distance + "%;font-size:12px;";
					zhuObj.perss = "position: absolute;top: -16px; left:" + per + "%;font-size:10px;";
					pointer[zhunum] = zhuObj;
					zhunum++;
//					$(document).ready(function(){
//						$(".odd:even").css("font-size","20px");
//					});
//					var jiou = $('.timenodezhu').children('.odd').length;
//					console.log("jiou = "+jiou);
//					for(var m=0;m<jiou;m++){
//						if(m % 2 ==0){
//							zhuObj.pers = "position: absolute;top: -60px; left:" + per + "%;font-size:12px;";
//						console.log(123);
//						}else{
//							zhuObj.pers = "position: absolute;top: -40px; left:" + per + "%;font-size:12px;";
//							console.log(456);
//						}
//					}
				} else { //客队
					var keObj = new Object();
					switch(matchData.eventType) {
						case 1:
							//进球
							keObj.src = "web_img/usual.png";
							keObj.src1 = "web_img/little.png";
							keObj.num = matchData.minute;
							keObj.player = matchData.playerName;
							break;
						case 2:
							//点球
							keObj.src = "web_img/penalty.png";
							keObj.src1 = "web_img/little.png";
							keObj.num = matchData.minute;
							keObj.player = matchData.playerName;
							break;
						case 5:
							//黄牌
							keObj.src = "web_img/yellow.png";
							keObj.src1 = "web_img/little.png";
							keObj.num = matchData.minute;
							keObj.player = matchData.playerName;
							break;
						case 6:
							//红牌
							keObj.src = "web_img/red.png";
							keObj.src1 = "web_img/little.png";
							keObj.num = matchData.minute;
							keObj.player = matchData.playerName;
							break;
						case 7:
							//两黄
							keObj.src = "web_img/yere.png";
							keObj.src1 = "web_img/little.png";
							keObj.num = matchData.minute;
							keObj.player = matchData.playerName;
							break;
					}
					var distance = per+(-2);
					keObj.perPic = "position: absolute;top: 15px; left:" + perPic + "%;";
					keObj.per = "position: absolute;top: -2px; left:" + per + "%;";
					keObj.pers = "position: absolute;top: 28px; left:" + distance + "%;font-size:12px;";
					keObj.perss = "position: absolute;top: 0px; left:" + per + "%;font-size:10px;";
					poiner[kenum] = keObj;
					kenum++;
				}
			}
			$scope.count0 = "0'";
			$scope.count90 = "90'";
			$scope.pointers = pointer; //主队
			$scope.poiners = poiner; //客队
		}else{
			$scope.idear = "此场赛事详细数据暂时缺失。";
//			$(".timeevenbox").hide();
		}
	}, function(data) { // 处理错误 .reject  
		alert('查询红黄牌错误！');
	})
}

//中文
function content($location, $scope, $http, homeAwayService) {
	$("#mask").css("height", $(document).height());
	$("#mask").css("width", $(document).width());
	$("#mask").show();
	$("#heid").show();
	var match = new Object();
	var promise = homeAwayService.matchInfo(); //查询主队信息
	promise.then(function(matchInfo) {
		if(matchInfo != null && matchInfo != "") {
			match.league = matchInfo.leagueName;
			match.homeName = matchInfo.homeName;
			match.hwen = "(主队)";
			match.awayName = matchInfo.awayName;
			match.awen = "(客队)";
			match.weather = matchInfo.weather;
			match.homeSummary = matchInfo.homeSummary == null || matchInfo.homeSummary == "" ? "暂无信息" : matchInfo.homeSummary;
			match.awaySummary = matchInfo.awaySummary == null || matchInfo.awaySummary == "" ? "暂无信息" : matchInfo.awaySummary;
			if(matchInfo.matchDate != null) {
				var week = strToweek(matchInfo.matchDate);
				match.matchDate = week;
			} else {
				match.matchDate = "暂无信息";
			}
			var date = new Date(+matchInfo.matchDate+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
			$scope.matchDate = date;

			match.homeImage = matchInfo.homeImage == null || matchInfo.homeImage == "" ? "web_img/zhudui.png" : matchInfo.homeImage;
			match.awayImage = matchInfo.awayImage == null || matchInfo.awayImage == "" ? "web_img/kedui.png" : matchInfo.awayImage;

			match.teamStrengthHome = "球队实力";
			match.teamStrengthAway = "球队实力";

			match.LastHome5 = "近5场战绩";
			match.LastAway5 = "近5场战绩";

			match.LastHome55 = "近5场主场战绩";
			match.LastAway55 = "近5场客场战绩";

			var hstarHtml = "";
			for(var i = 1; i < 6; i++) {
				if(matchInfo.homeStar >= i) {
					hstarHtml = hstarHtml + '<img src="web_img/icon_star_2.png" />&nbsp;';
				} else {
					hstarHtml = hstarHtml + '<img src="web_img/icon_star_1.png" />&nbsp;';
				}
			}

			var astarHtml = "";
			for(var i = 1; i < 6; i++) {
				if(matchInfo.awayStar >= i) {
					astarHtml = astarHtml + '<img src="web_img/icon_star_2.png" />&nbsp;';
				} else {
					astarHtml = astarHtml + '<img src="web_img/icon_star_1.png" />&nbsp;';
				}
			}
			var homeLatest5 = matchInfo.homeLatest5;
			var himghtml = "";
			for(var i = 0; i < homeLatest5.length; i++) {
				if(homeLatest5[i] == "1") {
					himghtml = himghtml + '<img src="web_img/sheng.png"/>&nbsp;';
				} else if(homeLatest5[i] == "2") {
					himghtml = himghtml + '<img src="web_img/fu.png"/>&nbsp;';
				} else if(homeLatest5[i] == "X") {
					himghtml = himghtml + '<img src="web_img/ping.png"/>&nbsp;';
				}
			}
			if(homeLatest5.length == 0) {
				himghtml = "暂无信息";
			}
			var awayLatest5 = matchInfo.awayLatest5;
			var aimghtml = "";
			for(var i = 0; i < awayLatest5.length; i++) {
				if(awayLatest5[i] == "1") {
					aimghtml = aimghtml + '&nbsp;<img src="web_img/sheng.png"/>';
				} else if(awayLatest5[i] == "2") {
					aimghtml = aimghtml + '&nbsp;<img src="web_img/fu.png"/>';
				} else if(awayLatest5[i] == "X") {
					aimghtml = aimghtml + '&nbsp;<img src="web_img/ping.png"/>';
				}
			}
			if(awayLatest5.length == 0) {
				aimghtml = "暂无信息";
			}
			match.himghtml = himghtml;
			match.aimghtml = aimghtml;

			var homeAtHomeLatest5 = matchInfo.homeAtHomeLatest5;
			var himghhtml = "";
			for(var i = 0; i < homeAtHomeLatest5.length; i++) {
				if(homeAtHomeLatest5[i] == "1") {
					himghhtml = himghhtml + '<img src="web_img/sheng.png"/>&nbsp;';
				} else if(homeAtHomeLatest5[i] == "2") {
					himghhtml = himghhtml + '<img src="web_img/fu.png"/>&nbsp;';
				} else if(homeAtHomeLatest5[i] == "X") {
					himghhtml = himghhtml + '<img src="web_img/ping.png"/>&nbsp;';
				}
			}
			if(homeAtHomeLatest5.length == 0) {
				himghhtml = "暂无信息";
			}
			var awayAtAwayLatest5 = matchInfo.awayAtAwayLatest5;
			var aimghhtml = "";
			for(var i = 0; i < awayAtAwayLatest5.length; i++) {
				if(awayAtAwayLatest5[i] == "1") {
					aimghhtml = aimghhtml + '&nbsp;<img src="web_img/sheng.png"/>';
				} else if(awayAtAwayLatest5[i] == "2") {
					aimghhtml = aimghhtml + '&nbsp;<img src="web_img/fu.png"/>';
				} else if(awayAtAwayLatest5[i] == "X") {
					aimghhtml = aimghhtml + '&nbsp;<img src="web_img/ping.png"/>';
				}
			}
			if(awayAtAwayLatest5.length == 0) {
				aimghhtml = "暂无信息";
			}
			match.himghhtml = himghhtml;
			match.aimghhtml = aimghhtml;
			match.hstarHtml = hstarHtml;
			match.astarHtml = astarHtml;

			match.homeFormation = matchInfo.homeFormation;
			match.awayFormation = matchInfo.awayFormation;

			var hi = 0;
			var homest = new Array();
			var ai = 0;
			var awayst = new Array();
			//主队伤停
			var hinjurys = matchInfo.homeinjury;
			//var hinjury=new Array();
			if(hinjurys != null && 　hinjurys != "") {
				if(hinjurys.indexOf(",") > 0 || hinjurys.indexOf("，") > 0) {
					var hinjuryss = hinjurys.split(/[,，]/);
					for(var i = 0; i < hinjuryss.length; i++) {
						var obj = new Object();
						obj.name = hinjuryss[i];
						obj.img = '<img src="web_img/shang.png" />';
						homest[hi] = obj;
						hi++;
					}
				} else {
					var obj = new Object();
					obj.name = hinjurys;
					obj.img = '<img src="web_img/shang.png" />';
					homest[hi] = obj;
					hi++;
				}
			}
			//match.hinjury = hinjury;
			//客队伤停
			var ainjurys = matchInfo.awayinjury;
			//var ainjury=new Array();
			if(ainjurys != null　 && ainjurys != "") {
				if(ainjurys.indexOf(",") > 0 || ainjurys.indexOf("，") > 0) {
					var ainjuryss = ainjurys.split(/[,，]/);
					for(var i = 0; i < ainjuryss.length; i++) {
						var obj = new Object();
						obj.name = ainjuryss[i];
						obj.img = '<img src="web_img/shang.png" />';
						awayst[ai] = obj;
						ai++;
					}
				} else {
					var obj = new Object();
					obj.name = ainjurys;
					obj.img = '<img src="web_img/shang.png" />';
					awayst[ai] = obj;
					ai++;
				}
			}
			//match.ainjury = ainjury;
			//主队停赛
			var hsuspendeds = matchInfo.homesuspended;
			//var hsuspended=new Array();
			if(hsuspendeds != null && hsuspendeds != "") {
				if(hsuspendeds.indexOf(",") > 0 || hsuspendeds.indexOf("，") > 0) {
					var hsuspendedss = hsuspendeds.split(/[,，]/);
					for(var i = 0; i < hsuspendedss.length; i++) {
						var obj = new Object();
						obj.name = hsuspendedss[i];
						obj.img = '<img src="web_img/ting.png" />';
						homest[hi] = obj;
						hi++;
					}
				} else {
					var obj = new Object();
					obj.name = hsuspendeds;
					obj.img = '<img src="web_img/ting.png" />';
					homest[hi] = obj;
					hi++;
				}
			}
			//match.hsuspended = hsuspended;
			//主队可能伤停
			var hpossibleInjurys = matchInfo.homepossibleinjury;
			//var hpossibleInjury=new Array();
			if(hpossibleInjurys != null && 　hpossibleInjurys != "") {
				if(hpossibleInjurys.indexOf(",") > 0 || hpossibleInjurys.indexOf("，") > 0) {
					var hpossibleInjuryss = hpossibleInjurys.split(/[,，]/);
					for(var i = 0; i < hpossibleInjuryss.length; i++) {
						var obj = new Object();
						obj.name = hpossibleInjuryss[i];
						obj.img = '<img src="web_img/yi.png" />';
						homest[hi] = obj;
						hi++;
					}
				} else {
					var obj = new Object();
					obj.name = hpossibleInjurys;
					obj.img = '<img src="web_img/yi.png" />';
					homest[hi] = obj;
					hi++;
				}
			}
			//match.hpossibleInjury = hpossibleInjury;

			//客队停赛
			var asuspendeds = matchInfo.awaysuspended;
			//var asuspended=new Array();
			if(asuspendeds != null && 　asuspendeds != "") {
				if(asuspendeds.indexOf(",") > 0 || asuspendeds.indexOf("，") > 0) {
					var asuspendedss = asuspendeds.split(/[,，]/);
					for(var i = 0; i < asuspendedss.length; i++) {
						var obj = new Object();
						obj.name = asuspendedss[i];
						obj.img = '<img src="web_img/ting.png" />';
						awayst[ai] = obj;
						ai++;
					}
				} else {
					var obj = new Object();
					obj.name = asuspendeds;
					obj.img = '<img src="web_img/ting.png" />';
					awayst[ai] = obj;
					ai++;
				}
			}
			//match.asuspendeds = asuspendeds;

			//客队可能伤停
			var apossibleInjurys = matchInfo.awaypossibleinjury;
			//var apossibleInjury=new Array();
			if(apossibleInjurys != null　 && apossibleInjurys != "") {
				if(apossibleInjurys.indexOf(",") > 0 || apossibleInjurys.indexOf("，") > 0) {
					var apossibleInjuryss = apossibleInjurys.split(/[,，]/);
					for(var i = 0; i < apossibleInjuryss.length; i++) {
						var obj = new Object();
						obj.name = apossibleInjuryss[i];
						obj.img = '<img src="web_img/yi.png" />';
						awayst[ai] = obj;

						ai++;
					}
				} else {
					var obj = new Object();
					obj.name = apossibleInjurys;
					obj.img = '<img src="web_img/yi.png" />';
					awayst[ai] = obj;

					ai++;
				}
			}
			var totalst = new Array();
			if(homest.length > awayst.length) {
				for(var i = 0; i < homest.length; i++) {
					var obj = new Object();
					obj.hname = homest[i].name;
					obj.himg = "&nbsp;&nbsp;&nbsp;&nbsp;" + homest[i].img + "&nbsp;&nbsp;&nbsp;&nbsp;";

					if(i > awayst.length || awayst.length == i) {
						obj.aimg = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
						obj.aname = "";
					} else {
						obj.aimg = "&nbsp;&nbsp;&nbsp;&nbsp;" + awayst[i].img + "&nbsp;&nbsp;&nbsp;&nbsp;";
						obj.aname = awayst[i].name;
					}
					totalst[i] = obj;
				}
			} else {
				for(var i = 0; i < awayst.length; i++) {
					var obj = new Object();
					if(i > homest.length || homest.length == i) {
						obj.hname = "";
						obj.himg = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
					} else {
						obj.hname = homest[i].name;
						obj.himg = "&nbsp;&nbsp;&nbsp;&nbsp;" + homest[i].img + "&nbsp;&nbsp;&nbsp;&nbsp;";
					}

					obj.aimg = "&nbsp;&nbsp;&nbsp;&nbsp;" + awayst[i].img + "&nbsp;&nbsp;&nbsp;&nbsp;";
					obj.aname = awayst[i].name;
					totalst[i] = obj;
				}
			}
			if(homest.length == 0 && awayst.length == 0) {
				var obj = new Object();
				obj.hname = "暂无";
				obj.himg = "";
				obj.aimg = "";
				obj.aname = "暂无";
				totalst[0] = obj;
			}
			//主队阵容
			$scope.homesf = matchInfo.homeBattleFormation;
			$scope.hometibu = matchInfo.homeBenchBattleFormation;
			$scope.awaysf = matchInfo.awayBattleFormation;
			$scope.awaytibu = matchInfo.awayBenchBattleFormation;
			match.totalst = totalst;
		}
		$scope.match = match;
		$("#mask").hide();
		$("#heid").hide();
	}, function(data) { // 处理错误 .reject 
		$("#mask").hide();
		$("#heid").hide();
		$scope.yuyanstyy = "background-color: #808080";
		$scope.yuyansty = "";
		$scope.langue = "English";
		//alert('查询中文賽事信息错误！');
	}).finally(function() {
		$scope.$broadcast('scroll.refreshComplete');
	});
}

function getTampStrDate(matchTimes) {
	var day = new Date(matchTimes);
	var Year = 0;
	var Month = 0;
	var Day = 0;
	var CurrentDate = "";
	Year = day.getFullYear(); //ie火狐下都可以
	Month = day.getMonth() + 1;
	Day = day.getDate();
	CurrentDate += Year + "-";
	if(Month >= 10) {
		CurrentDate += Month + "-";
	} else {
		CurrentDate += "0" + Month + "-";
	}
	if(Day >= 10) {
		CurrentDate += Day + " ";
	} else {
		CurrentDate += "0" + Day + " ";
	}
	var hours = day.getHours();
	if(hours >= 10) {
		CurrentDate += hours + ":";
	} else {
		CurrentDate += "0" + hours + ":";
	}
	var minutes = day.getMinutes();
	if(minutes >= 10) {
		CurrentDate += minutes + ":";
	} else {
		CurrentDate += "0" + minutes + ":";
	}
	var seconds = day.getSeconds();
	if(seconds >= 10) {
		CurrentDate += seconds + "";
	} else {
		CurrentDate += "0" + seconds + "";
	}
	return CurrentDate;
}
//英文
function contentyin($location, $scope, $http, homeAwayyinService) {
	$("#mask").css("height", $(document).height());
	$("#mask").css("width", $(document).width());
	$("#mask").show();
	$("#heid").show();
	var match = new Object();
	var promise = homeAwayyinService.matchInfo(); //查询主队信息
	promise.then(function(matchInfo) {
		if(matchInfo != null && matchInfo != "") {

			match.league = matchInfo.leagueName;
			match.homeName = matchInfo.homeName;
			match.hwen = "(Home)";
			match.awayName = matchInfo.awayName;
			match.awen = "(Away)";
			match.weather = matchInfo.weather;
			match.homeSummary = matchInfo.homeSummary == null || matchInfo.homeSummary == "" ? "暂无信息" : matchInfo.homeSummary;
			match.awaySummary = matchInfo.awaySummary == null || matchInfo.awaySummary == "" ? "暂无信息" : matchInfo.awaySummary;
			if(matchInfo.matchDate != null) {
				var week = strToweek(matchInfo.matchDate);
				match.matchDate = week;
			} else {
				match.matchDate = "暂无信息";
			}
			var date = new Date(+matchInfo.matchDate+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
			$scope.matchDate = date;

			match.homeImage = matchInfo.homeImage == null || matchInfo.homeImage == "" ? "web_img/zhudui.png" : matchInfo.homeImage;
			match.awayImage = matchInfo.awayImage == null || matchInfo.awayImage == "" ? "web_img/kedui.png" : matchInfo.awayImage;
			match.teamStrengthHome = "Team strength";
			match.teamStrengthAway = "Team strength";

			match.LastHome5 = "Last 5";
			match.LastAway5 = "Last 5";

			match.LastHome55 = "Last 5 Home";
			match.LastAway55 = "Last 5 Away";

			var hstarHtml = "";
			for(var i = 1; i < 6; i++) {
				if(matchInfo.homeStar >= i) {
					hstarHtml = hstarHtml + '<img src="web_img/icon_star_2.png" />&nbsp;';
				} else {
					hstarHtml = hstarHtml + '<img src="web_img/icon_star_1.png" />&nbsp;';
				}
			}

			var astarHtml = "";
			for(var i = 1; i < 6; i++) {
				if(matchInfo.awayStar >= i) {
					astarHtml = astarHtml + '<img src="web_img/icon_star_2.png" />&nbsp;';
				} else {
					astarHtml = astarHtml + '<img src="web_img/icon_star_1.png" />&nbsp;';
				}
			}
			var homeLatest5 = matchInfo.homeLatest5;
			var himghtml = "";
			for(var i = 0; i < homeLatest5.length; i++) {
				if(homeLatest5[i] == "1") {
					himghtml = himghtml + '<img src="web_img/sheng.png"/>&nbsp;';
				} else if(homeLatest5[i] == "2") {
					himghtml = himghtml + '<img src="web_img/fu.png"/>&nbsp;';
				} else if(homeLatest5[i] == "X") {
					himghtml = himghtml + '<img src="web_img/ping.png"/>&nbsp;';
				}
			}
			if(homeLatest5.length == 0) {
				himghtml = "暂无信息";
			}
			var awayLatest5 = matchInfo.awayLatest5;
			var aimghtml = "";
			for(var i = 0; i < awayLatest5.length; i++) {
				if(awayLatest5[i] == "1") {
					aimghtml = aimghtml + '&nbsp;<img src="web_img/sheng.png"/>';
				} else if(awayLatest5[i] == "2") {
					aimghtml = aimghtml + '&nbsp;<img src="web_img/fu.png"/>';
				} else if(awayLatest5[i] == "X") {
					aimghtml = aimghtml + '&nbsp;<img src="web_img/ping.png"/>';
				}
			}
			if(awayLatest5.length == 0) {
				aimghtml = "暂无信息";
			}
			match.himghtml = himghtml;
			match.aimghtml = aimghtml;

			var homeAtHomeLatest5 = matchInfo.homeAtHomeLatest5;
			var himghhtml = "";
			for(var i = 0; i < homeAtHomeLatest5.length; i++) {
				if(homeAtHomeLatest5[i] == "1") {
					himghhtml = himghhtml + '<img src="web_img/sheng.png"/>&nbsp;';
				} else if(homeAtHomeLatest5[i] == "2") {
					himghhtml = himghhtml + '<img src="web_img/fu.png"/>&nbsp;';
				} else if(homeAtHomeLatest5[i] == "X") {
					himghhtml = himghhtml + '<img src="web_img/ping.png"/>&nbsp;';
				}
			}
			if(homeAtHomeLatest5.length == 0) {
				himghhtml = "暂无信息";
			}
			var awayAtAwayLatest5 = matchInfo.awayAtAwayLatest5;
			var aimghhtml = "";
			for(var i = 0; i < awayAtAwayLatest5.length; i++) {
				if(awayAtAwayLatest5[i] == "1") {
					aimghhtml = aimghhtml + '&nbsp;<img src="web_img/sheng.png"/>';
				} else if(awayAtAwayLatest5[i] == "2") {
					aimghhtml = aimghhtml + '&nbsp;<img src="web_img/fu.png"/>';
				} else if(awayAtAwayLatest5[i] == "X") {
					aimghhtml = aimghhtml + '&nbsp;<img src="web_img/ping.png"/>';
				}
			}
			if(awayAtAwayLatest5.length == 0) {
				aimghhtml = "暂无信息";
			}
			match.himghhtml = himghhtml;
			match.aimghhtml = aimghhtml;
			match.hstarHtml = hstarHtml;
			match.astarHtml = astarHtml;

			match.homeFormation = matchInfo.homeFormation;
			match.awayFormation = matchInfo.awayFormation;

			var hi = 0;
			var homest = new Array();
			var ai = 0;
			var awayst = new Array();
			//主队伤停
			var hinjurys = matchInfo.homeinjury;
			//var hinjury=new Array();
			if(hinjurys != null && 　hinjurys != "") {
				if(hinjurys.indexOf(",") > 0 || hinjurys.indexOf("，") > 0) {
					var hinjuryss = hinjurys.split(/[,，]/);
					for(var i = 0; i < hinjuryss.length; i++) {
						var obj = new Object();
						obj.name = hinjuryss[i];
						obj.img = '<img src="web_img/shang.png" />';
						homest[hi] = obj;
						hi++;
					}
				} else {
					var obj = new Object();
					obj.name = hinjurys;
					obj.img = '<img src="web_img/shang.png" />';
					homest[hi] = obj;
					hi++;
				}
			}
			//match.hinjury = hinjury;
			//客队伤停
			var ainjurys = matchInfo.awayinjury;
			//var ainjury=new Array();
			if(ainjurys != null　 && ainjurys != "") {
				if(ainjurys.indexOf(",") > 0 || ainjurys.indexOf("，") > 0) {
					var ainjuryss = ainjurys.split(/[,，]/);
					for(var i = 0; i < ainjuryss.length; i++) {
						var obj = new Object();
						obj.name = ainjuryss[i];
						obj.img = '<img src="web_img/shang.png" />';
						awayst[ai] = obj;
						ai++;
					}
				} else {
					var obj = new Object();
					obj.name = ainjurys;
					obj.img = '<img src="web_img/shang.png" />';
					awayst[ai] = obj;
					ai++;
				}
			}
			//match.ainjury = ainjury;
			//主队停赛
			var hsuspendeds = matchInfo.homesuspended;
			//var hsuspended=new Array();
			if(hsuspendeds != null && hsuspendeds != "") {
				if(hsuspendeds.indexOf(",") > 0 || hsuspendeds.indexOf("，") > 0) {
					var hsuspendedss = hsuspendeds.split(/[,，]/);
					for(var i = 0; i < hsuspendedss.length; i++) {
						var obj = new Object();
						obj.name = hsuspendedss[i];
						obj.img = '<img src="web_img/ting.png" />';
						homest[hi] = obj;
						hi++;
					}
				} else {
					var obj = new Object();
					obj.name = hsuspendeds;
					obj.img = '<img src="web_img/ting.png" />';
					homest[hi] = obj;
					hi++;
				}
			}
			//match.hsuspended = hsuspended;
			//主队可能伤停
			var hpossibleInjurys = matchInfo.homepossibleinjury;
			//var hpossibleInjury=new Array();
			if(hpossibleInjurys != null && 　hpossibleInjurys != "") {
				if(hpossibleInjurys.indexOf(",") > 0 || hpossibleInjurys.indexOf("，") > 0) {
					var hpossibleInjuryss = hpossibleInjurys.split(/[,，]/);
					for(var i = 0; i < hpossibleInjuryss.length; i++) {
						var obj = new Object();
						obj.name = hpossibleInjuryss[i];
						obj.img = '<img src="web_img/yi.png" />';
						homest[hi] = obj;
						hi++;
					}
				} else {
					var obj = new Object();
					obj.name = hpossibleInjurys;
					obj.img = '<img src="web_img/yi.png" />';
					homest[hi] = obj;
					hi++;
				}
			}
			//match.hpossibleInjury = hpossibleInjury;

			//客队停赛
			var asuspendeds = matchInfo.awaysuspended;
			//var asuspended=new Array();
			if(asuspendeds != null && 　asuspendeds != "") {
				if(asuspendeds.indexOf(",") > 0 || asuspendeds.indexOf("，") > 0) {
					var asuspendedss = asuspendeds.split(/[,，]/);
					for(var i = 0; i < asuspendedss.length; i++) {
						var obj = new Object();
						obj.name = asuspendedss[i];
						obj.img = '<img src="web_img/ting.png" />';
						awayst[ai] = obj;
						ai++;
					}
				} else {
					var obj = new Object();
					obj.name = asuspendeds;
					obj.img = '<img src="web_img/ting.png" />';
					awayst[ai] = obj;
					ai++;
				}
			}
			//match.asuspendeds = asuspendeds;

			//客队可能伤停
			var apossibleInjurys = matchInfo.awaypossibleinjury;
			//var apossibleInjury=new Array();
			if(apossibleInjurys != null　 && apossibleInjurys != "") {
				if(apossibleInjurys.indexOf(",") > 0 || apossibleInjurys.indexOf("，") > 0) {
					var apossibleInjuryss = apossibleInjurys.split(/[,，]/);
					for(var i = 0; i < apossibleInjuryss.length; i++) {
						var obj = new Object();
						obj.name = apossibleInjuryss[i];
						obj.img = '<img src="web_img/yi.png" />';
						awayst[ai] = obj;

						ai++;
					}
				} else {
					var obj = new Object();
					obj.name = apossibleInjurys;
					obj.img = '<img src="web_img/yi.png" />';
					awayst[ai] = obj;

					ai++;
				}
			}
			var totalst = new Array();
			if(homest.length > awayst.length) {
				for(var i = 0; i < homest.length; i++) {
					var obj = new Object();
					obj.hname = homest[i].name;
					obj.himg = "&nbsp;&nbsp;&nbsp;&nbsp;" + homest[i].img + "&nbsp;&nbsp;&nbsp;&nbsp;";

					if(i > awayst.length || awayst.length == i) {
						obj.aimg = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
						obj.aname = "";
					} else {
						obj.aimg = "&nbsp;&nbsp;&nbsp;&nbsp;" + awayst[i].img + "&nbsp;&nbsp;&nbsp;&nbsp;";
						obj.aname = awayst[i].name;
					}
					totalst[i] = obj;
				}
			} else {
				for(var i = 0; i < awayst.length; i++) {
					var obj = new Object();
					if(i > homest.length || homest.length == i) {
						obj.hname = "";
						obj.himg = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
					} else {
						obj.hname = homest[i].name;
						obj.himg = "&nbsp;&nbsp;&nbsp;&nbsp;" + homest[i].img + "&nbsp;&nbsp;&nbsp;&nbsp;";
					}

					obj.aimg = "&nbsp;&nbsp;&nbsp;&nbsp;" + awayst[i].img + "&nbsp;&nbsp;&nbsp;&nbsp;";
					obj.aname = awayst[i].name;
					totalst[i] = obj;
				}
			}
			if(homest.length == 0 && awayst.length == 0) {
				var obj = new Object();
				obj.hname = "暂无";
				obj.himg = "";
				obj.aimg = "";
				obj.aname = "暂无";
				totalst[0] = obj;
			}
			//主队阵容
			$scope.homesf = matchInfo.homeBattleFormation;
			$scope.hometibu = matchInfo.homeBenchBattleFormation;
			$scope.awaysf = matchInfo.awayBattleFormation;
			$scope.awaytibu = matchInfo.awayBenchBattleFormation;
			match.totalst = totalst;
		}
		$scope.match = match;
		$("#mask").hide();
		$("#heid").hide();
	}, function(data) { // 处理错误 .reject 
		$("#mask").hide();
		$("#heid").hide();
		$scope.yuyansty = "background-color: #808080"; //默认中文；
		$scope.yuyanstyy = "";
		$scope.langue = "Chinese";
		//alert('查询英文賽事信息错误！');
	}).finally(function() {
		$scope.$broadcast('scroll.refreshComplete');
	});
}

function strToweek(date) {
	var date1 = new Date(date);
	var year = date1.getFullYear();
	var month = date1.getMonth()+1;
	
	var date2 = date1.getDate()
	var week = "";
	var num = date1.getDay();
	
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
	return year + "-" + month + "-" + date2 + "  " + week;
}

//查询红黄牌
app.factory('matchesService', ['$http', '$q', '$location','md5', function($http, $q, $location,md5) {

	return {
		matches: function() {
			var safe = localStorage.getItem('lSKey');
  			sign = md5.createHash("appCode" + appCode + 'caiexMatchId' + simatchID + safe);
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
				$http({
					method: "POST",
					headers : {
				        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				    },
	                data:$.param({
	                	"caiexMatchId":simatchID,
	                	"appCode":appCode,
	                	"sign":sign
	                }),
	                url: url + "matches_cn"					
				}).
				success(function(data) {
					deferred.resolve(eval("(" + data.result + ")")); // 声明执行成功，即http请求数据成功，可以返回数据了  
				}).
				error(function(data) {
					deferred.reject(eval("(" + data.result + ")")); // 声明执行失败，即服务器返回错误  
				});
				return deferred.promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API  
			} // end query  
	};
}]);

//查询主客队信息 中文
app.factory('homeAwayService', ['$http', '$q', '$location','md5', function($http, $q, $location,md5) {
	return {
		matchInfo: function() {
			var safe = localStorage.getItem('lSKey');
  			sign = md5.createHash("appCode" + appCode + 'caiexMatchId' + matchID + safe);
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
				$http({
					method: "POST",
					headers : {
				        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				    },
	                data:$.param({
	                	"caiexMatchId":matchID,
	                	"appCode":appCode,
	                	"sign":sign
	                }),
	                url: url + "matchInfo_cn"					
				}).
				success(function(data) {
					deferred.resolve(eval("(" + data.result + ")")); // 声明执行成功，即http请求数据成功，可以返回数据了
				}).
				error(function(data) {
					deferred.reject(eval("(" + data.result + ")")); // 声明执行失败，即服务器返回错误  
				});
				return deferred.promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API  
			} // end query  
	};
}]);

//英文
app.factory('homeAwayyinService', ['$http', '$q', '$location', 'md5',function($http, $q, $location,md5) {

	return {
		matchInfo: function() {
			var safe = localStorage.getItem('lSKey');
  			sign = md5.createHash("appCode" + appCode + 'siMatchId' + simatchID + safe);
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
				$http({
					method: "POST",
					headers : {
				        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				    },
	                data:$.param({
	                	"siMatchId":simatchID,
	                	"appCode":appCode,
	                	"sign":sign
	                }),
	                url: url + "matchInfo_en"				
				}).
				success(function(data) {
					deferred.resolve(eval("(" + data.result + ")")); // 声明执行成功，即http请求数据成功，可以返回数据了
				}).
				error(function(data) {
					deferred.reject(eval("(" + data.result + ")")); // 声明执行失败，即服务器返回错误  
				});
				return deferred.promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API  
			} // end query  
	};
}]);